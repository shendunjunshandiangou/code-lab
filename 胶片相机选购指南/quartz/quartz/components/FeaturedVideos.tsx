import { QuartzComponentProps } from "./types"

export type FeaturedVideo = {
  bvid: string
  title: string
  creator: string
  url?: string
  category?: string
  summary?: string
}

type FrontmatterLike = Record<string, unknown> | undefined

function readVideos(frontmatter: FrontmatterLike): FeaturedVideo[] {
  const rawVideos = frontmatter?.featured_videos
  if (!Array.isArray(rawVideos)) return []

  return rawVideos.filter((video): video is FeaturedVideo => {
    if (!video || typeof video !== "object") return false
    const item = video as Record<string, unknown>
    return (
      typeof item.bvid === "string" &&
      /^BV[0-9A-Za-z]{10}$/.test(item.bvid) &&
      typeof item.title === "string" &&
      typeof item.creator === "string"
    )
  })
}

export function getFeaturedVideos(props: Pick<QuartzComponentProps, "allFiles" | "fileData">) {
  const currentVideos = readVideos(props.fileData.frontmatter as FrontmatterLike)
  if (currentVideos.length > 0) return currentVideos

  const videoPage = props.allFiles.find((file) => String(file.slug ?? "") === "videos")
  return readVideos(videoPage?.frontmatter as FrontmatterLike)
}

export function FeaturedVideoGrid({
  videos,
  className = "",
}: {
  videos: FeaturedVideo[]
  className?: string
}) {
  if (videos.length === 0) return null

  return (
    <>
      <style id="featured-video-layout-inline">{`
        .center>article.portal-rich-page.videos-page{width:100%;max-width:none;margin:0;padding:0}
        .featured-video-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--site-line-dark)}
        .featured-video-grid .bilibili-card{min-width:0}
        @media(max-width:960px){.featured-video-grid{grid-template-columns:1fr}}
      `}</style>
      <div class={`featured-video-grid ${className}`.trim()} data-video-count={videos.length}>
        {videos.map((video) => {
          const link = video.url ?? `https://www.bilibili.com/video/${video.bvid}/`
          return (
            <article class="bilibili-card" data-bvid={video.bvid}>
              <div class="bilibili-cover">
                <div class="bilibili-cover-placeholder">
                  <span>BILIBILI{video.category ? ` · ${video.category}` : ""}</span>
                  <strong>{video.creator}</strong>
                </div>
                <button class="bilibili-play" type="button" aria-label={`播放${video.title}`}>
                  <span aria-hidden="true">▶</span>
                </button>
              </div>
              <div class="bilibili-card-body">
                <p>{video.creator}</p>
                <h3>{video.title}</h3>
                {video.summary ? <span class="bilibili-summary">{video.summary}</span> : null}
                <a href={link}>B 站打开原视频 →</a>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}

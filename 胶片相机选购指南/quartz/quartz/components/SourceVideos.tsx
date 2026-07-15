// @ts-ignore
import bilibiliScript from "./scripts/bilibili.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

type SourceVideo = {
  platform?: string
  bvid?: string
  title?: string
  creator?: string
  url?: string
  cover?: string
  duration?: string
  role?: string
}

const portalSlugs = new Set(["index", "learn", "buying", "cameras", "film", "videos", "about"])

const SourceVideos: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (portalSlugs.has(String(fileData.slug ?? ""))) return null

  const frontmatter = (fileData.frontmatter ?? {}) as Record<string, any>
  const videos = Array.isArray(frontmatter.source_videos)
    ? (frontmatter.source_videos as SourceVideo[]).filter((video) => video?.url || video?.bvid)
    : []
  const sourceNote = frontmatter.source_note as string | undefined
  const gridSizeClass = videos.length === 1 ? "is-single" : videos.length === 2 ? "is-pair" : "is-multi"

  // 尚未补充来源字段的文章不显示大块空状态，避免打断阅读。
  if (videos.length === 0 && !sourceNote) return null

  return (
    <section class="source-video-section" aria-labelledby="source-video-title">
      <div class="source-video-heading">
        <p>内容来源</p>
        <h2 id="source-video-title">参考视频与编辑说明</h2>
        <span>
          {sourceNote ??
            "本站将公开视频中的观点重新组织为适合阅读和查询的结构，并结合公开机型资料进行必要核验。原视频观点与本站补充信息应分别理解。"}
        </span>
      </div>

      {videos.length > 0 ? (
        <div class={`source-video-grid ${gridSizeClass}`} data-video-count={videos.length}>
          {videos.map((video) => {
            const link = video.url ?? `https://www.bilibili.com/video/${video.bvid}`
            return (
              <article class="bilibili-card" data-bvid={video.bvid ?? ""}>
                <div class="bilibili-cover">
                  {video.cover ? (
                    <img src={video.cover} alt={`${video.title ?? "参考视频"}封面`} loading="lazy" />
                  ) : (
                    <div class="bilibili-cover-placeholder">
                      <span>BILIBILI</span>
                      <strong>原视频</strong>
                    </div>
                  )}
                  {video.bvid ? (
                    <button class="bilibili-play" type="button" aria-label={`播放${video.title ?? "参考视频"}`}>
                      <span aria-hidden="true">▶</span>
                    </button>
                  ) : null}
                  {video.duration ? <small>{video.duration}</small> : null}
                </div>
                <div class="bilibili-card-body">
                  <p>{video.creator ?? "视频创作者"}</p>
                  <h3>{video.title ?? "参考视频"}</h3>
                  <a href={link}>前往 B 站观看 →</a>
                </div>
              </article>
            )
          })}
        </div>
      ) : null}

      <div class="editorial-disclosure">
        <span>整理原则</span>
        <p>不下载或重新托管 B 站视频；保留创作者与原链接；二手价格、图片授权和待核验参数会在页面中明确标记。</p>
      </div>
    </section>
  )
}

SourceVideos.afterDOMLoaded = bilibiliScript

export default (() => SourceVideos) satisfies QuartzComponentConstructor

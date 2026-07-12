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

const SourceVideos: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (fileData.slug === "index") return null

  const frontmatter = (fileData.frontmatter ?? {}) as Record<string, any>
  const videos = Array.isArray(frontmatter.source_videos)
    ? (frontmatter.source_videos as SourceVideo[]).filter((video) => video?.url || video?.bvid)
    : []
  const sourceNote =
    frontmatter.source_note ??
    "本站将公开视频中的观点重新组织为适合阅读和查询的结构，并结合公开机型资料进行必要核验。原视频观点与本站补充信息应分别理解。"

  return (
    <section class="source-video-section" aria-labelledby="source-video-title">
      <div class="source-video-heading">
        <p>EDITORIAL SOURCES</p>
        <h2 id="source-video-title">内容来源与延伸观看</h2>
        <span>{sourceNote}</span>
      </div>

      {videos.length > 0 ? (
        <div class="source-video-grid">
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
      ) : (
        <div class="source-video-empty">
          <strong>原视频映射正在整理</strong>
          <p>播放器与视频卡片能力已经接入。具体视频将在确认 BV 号、创作者、标题和封面后逐条上线，避免错误署名。</p>
        </div>
      )}

      <div class="editorial-disclosure">
        <span>整理原则</span>
        <p>不下载或重新托管 B 站视频；保留创作者与原链接；二手价格、图片授权和待核验参数会在页面中明确标记。</p>
      </div>
    </section>
  )
}

SourceVideos.afterDOMLoaded = bilibiliScript

export default (() => SourceVideos) satisfies QuartzComponentConstructor
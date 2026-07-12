import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

type FrontmatterRecord = Record<string, any>

function categoryFor(slug: string, frontmatter: FrontmatterRecord) {
  if (frontmatter.entity === "camera" || frontmatter.cssclasses?.includes?.("camera-detail")) return "相机图鉴"
  if (slug === "buying" || slug.includes("选购决策")) return "帮我选相机"
  if (slug === "learn" || slug.includes("科普入门")) return "新手入门"
  if (slug === "film" || slug.includes("胶卷")) return "胶卷与成像"
  if (slug === "videos") return "视频精选"
  if (slug === "about") return "关于本站"
  if (slug === "cameras" || slug.includes("推荐机型大全")) return "相机图鉴"
  return frontmatter.section ?? "胶片摄影指南"
}

function descriptionFor(category: string, frontmatter: FrontmatterRecord) {
  if (frontmatter.description) return frontmatter.description
  if (category === "相机图鉴") return "参数不是答案。先看这台相机适合谁、需要承担什么，以及它是否值得进入你的日常。"
  if (category === "帮我选相机") return "从拍摄场景、完整预算和操作习惯出发，把模糊的购买冲动收敛成清晰的选择。"
  if (category === "新手入门") return "用最少的背景知识，理解胶片、相机、冲洗和扫描是怎样一起工作的。"
  return "面向普通读者的胶片摄影知识与选购指南。"
}

const PageHero: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = String(fileData.slug ?? "")
  if (slug === "index") return null

  const frontmatter = (fileData.frontmatter ?? {}) as FrontmatterRecord
  const title = frontmatter.title ?? slug.split("/").pop()?.replaceAll("-", " ") ?? "胶片相机指南"
  const category = categoryFor(slug, frontmatter)
  const isCamera = frontmatter.entity === "camera" || frontmatter.cssclasses?.includes?.("camera-detail")
  const heroImage = frontmatter.hero_image as string | undefined
  const current = fileData.slug ?? ("index" as FullSlug)
  const homeHref = resolveRelative(current, "index" as FullSlug)
  const categoryHref = resolveRelative(
    current,
    (category === "相机图鉴"
      ? "cameras"
      : category === "帮我选相机"
        ? "buying"
        : category === "新手入门"
          ? "learn"
          : category === "胶卷与成像"
            ? "film"
            : category === "视频精选"
              ? "videos"
              : "index") as FullSlug,
  )

  const price =
    frontmatter.price_min && frontmatter.price_max
      ? `¥${frontmatter.price_min}～${frontmatter.price_max}`
      : frontmatter.price_min
        ? `约 ¥${frontmatter.price_min} 起`
        : "价格随成色变化"

  return (
    <section class={`editorial-hero ${isCamera ? "camera-editorial-hero" : "article-editorial-hero"}`}>
      <div class="editorial-hero-inner">
        <div class="editorial-hero-copy">
          <nav class="reader-breadcrumb" aria-label="当前位置">
            <a href={homeHref}>首页</a>
            <span>/</span>
            <a href={categoryHref}>{category}</a>
          </nav>
          <p class="editorial-kicker">{category}</p>
          <h1>{title}</h1>
          <p class="editorial-deck">{descriptionFor(category, frontmatter)}</p>

          {isCamera ? (
            <div class="camera-hero-facts" aria-label="机型摘要">
              <div>
                <span>类型</span>
                <strong>{frontmatter.camera_type ?? "待核验"}</strong>
              </div>
              <div>
                <span>画幅</span>
                <strong>{frontmatter.format ?? "待核验"}</strong>
              </div>
              <div>
                <span>对焦</span>
                <strong>{frontmatter.focus ?? "待核验"}</strong>
              </div>
              <div>
                <span>参考价格</span>
                <strong>{price}</strong>
              </div>
            </div>
          ) : (
            <div class="article-hero-meta">
              <span>面向：{frontmatter.target ?? "胶片摄影初学者"}</span>
              <span>更新：{frontmatter.last_updated ?? "2026-07-12"}</span>
              <span>预计阅读 6 分钟</span>
            </div>
          )}
        </div>

        <figure class={`editorial-hero-media ${heroImage ? "has-image" : "is-placeholder"}`}>
          {heroImage ? (
            <img src={heroImage} alt={frontmatter.image_alt ?? title} loading="eager" decoding="async" />
          ) : (
            <div class="camera-placeholder-art" aria-label={`${title}图片待完成授权核验`}>
              <span>{frontmatter.brand ?? "ANALOG"}</span>
              <strong>{title}</strong>
              <small>IMAGE VERIFICATION IN PROGRESS</small>
            </div>
          )}
          <figcaption>
            {frontmatter.image_credit ? `${frontmatter.image_credit} · ` : ""}
            {frontmatter.image_source ? (
              <a href={frontmatter.image_source}>查看图片来源</a>
            ) : (
              <span>图片待完成授权核验</span>
            )}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

export default (() => PageHero) satisfies QuartzComponentConstructor
// @ts-ignore
import menuScript from "./scripts/siteHeader.inline"
import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const navItems = [
  { label: "首页", slug: "index" },
  { label: "新手入门", slug: "learn" },
  { label: "帮我选相机", slug: "buying" },
  { label: "相机图鉴", slug: "cameras" },
  { label: "胶卷与成像", slug: "film" },
  { label: "视频精选", slug: "videos" },
  { label: "关于本站", slug: "about" },
]

const SiteHeader: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const current = fileData.slug ?? ("index" as FullSlug)
  const hrefFor = (slug: string) => resolveRelative(current, slug as FullSlug)

  return (
    <div class="site-header-shell">
      <a class="site-wordmark" href={hrefFor("index")} aria-label="胶片相机指南首页">
        <span class="site-wordmark-mark" aria-hidden="true">
          35
        </span>
        <span>
          <strong>胶片相机指南</strong>
          <small>ANALOG FIELD GUIDE</small>
        </span>
      </a>

      <button class="site-menu-button" type="button" aria-expanded="false" aria-controls="site-primary-nav">
        <span></span>
        <span></span>
        <span></span>
        <span class="sr-only">打开导航</span>
      </button>

      <nav id="site-primary-nav" class="site-primary-nav" aria-label="主导航">
        {navItems.map((item) => (
          <a href={hrefFor(item.slug)}>{item.label}</a>
        ))}
      </nav>
    </div>
  )
}

SiteHeader.afterDOMLoaded = menuScript

export default (() => SiteHeader) satisfies QuartzComponentConstructor
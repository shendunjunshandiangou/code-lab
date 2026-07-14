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
    <div class="site-header-shell home-shell-compat">
      <style id="mobile-navigation-scroll-fix">{`
        @media (max-width: 960px) {
          .page-header header {
            -webkit-backdrop-filter: none !important;
            backdrop-filter: none !important;
            background: rgba(13, 14, 13, 0.98) !important;
          }

          .site-primary-nav {
            position: fixed !important;
            z-index: 999 !important;
            top: var(--mobile-nav-top, 68px) !important;
            right: 0 !important;
            bottom: auto !important;
            left: 0 !important;
            width: 100% !important;
            height: var(--mobile-nav-height, calc(100dvh - 68px)) !important;
            min-height: 0 !important;
            max-height: var(--mobile-nav-height, calc(100dvh - 68px)) !important;
            padding: 1rem 1.25rem calc(5rem + env(safe-area-inset-bottom)) !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
            overscroll-behavior: contain;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y;
            scrollbar-gutter: stable;
            contain: layout paint;
          }

          .site-primary-nav.is-open {
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            justify-content: flex-start !important;
          }

          .site-primary-nav a {
            flex: 0 0 auto;
            width: 100%;
            min-height: 58px;
            display: flex;
            align-items: center;
          }

          body.menu-open {
            width: 100%;
            overflow: hidden !important;
            overscroll-behavior: none;
          }
        }
      `}</style>

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

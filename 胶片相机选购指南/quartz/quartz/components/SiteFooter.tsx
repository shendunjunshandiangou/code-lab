import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const SiteFooter: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const current = fileData.slug ?? ("index" as FullSlug)
  const hrefFor = (slug: string) => resolveRelative(current, slug as FullSlug)
  const year = new Date().getFullYear()

  return (
    <footer class="site-footer">
      <div class="site-footer-inner">
        <div class="site-footer-brand">
          <span class="site-footer-index">35MM / 120 / INSTANT</span>
          <h2>从第一卷胶片，走到真正适合你的相机。</h2>
          <p>面向普通读者的胶片摄影入门、选购、机型和视频资料整理。</p>
        </div>

        <div class="site-footer-links">
          <div>
            <strong>开始阅读</strong>
            <a href={hrefFor("learn")}>新手入门</a>
            <a href={hrefFor("encyclopedia")}>相机百科</a>
            <a href={hrefFor("buying")}>帮我选相机</a>
            <a href={hrefFor("cameras")}>相机图鉴</a>
          </div>
          <div>
            <strong>继续探索</strong>
            <a href={hrefFor("film")}>胶卷与成像</a>
            <a href={hrefFor("videos")}>视频精选</a>
            <a href={hrefFor("about")}>关于本站</a>
          </div>
          <div>
            <strong>项目</strong>
            <a href="https://github.com/shendunjunshandiangou/code-lab">GitHub 仓库</a>
            <a href="mailto:335566qwer@gmail.com">联系维护者</a>
          </div>
        </div>
      </div>

      <div class="site-footer-bottom">
        <span>© {year} 胶片相机指南</span>
        <span>内容来自公开视频与公开资料，保留原作者和图片授权说明。</span>
        <span>最近系统更新：2026-07-12</span>
      </div>
    </footer>
  )
}

export default (() => SiteFooter) satisfies QuartzComponentConstructor

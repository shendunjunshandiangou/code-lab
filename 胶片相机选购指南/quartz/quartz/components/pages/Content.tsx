import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { concatenateResources } from "../../util/resources"
import HomePageConstructor from "../HomePage"
import LearnPageConstructor from "../LearnPage"
import BuyingGuidePageConstructor from "../BuyingGuidePage"
import PortalPagesConstructor from "../PortalPages"
import CameraAtlasPageConstructor from "../CameraAtlasPage"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const HomePage = HomePageConstructor()
const LearnPage = LearnPageConstructor()
const BuyingGuidePage = BuyingGuidePageConstructor()
const PortalPages = PortalPagesConstructor()
const CameraAtlasPage = CameraAtlasPageConstructor()
const customPages = [HomePage, LearnPage, BuyingGuidePage, PortalPages, CameraAtlasPage]
const customPortalSlugs = new Set(["film", "videos", "about"])

const Content: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, tree } = props
  const slug = String(fileData.slug ?? "")

  if (slug === "index") {
    return (
      <article class="popover-hint home-page">
        <HomePage {...props} />
      </article>
    )
  }

  if (slug === "learn") {
    return <LearnPage {...props} />
  }

  if (slug === "buying") {
    return <BuyingGuidePage {...props} />
  }

  if (slug === "cameras") {
    return <CameraAtlasPage {...props} />
  }

  if (customPortalSlugs.has(slug)) {
    return <PortalPages {...props} />
  }

  const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const classString = ["popover-hint", ...classes].join(" ")
  return <article class={classString}>{content}</article>
}

// Quartz 只自动收集布局中顶层组件的资源。上述专题页嵌套在 Content 内，
// 因此需要在这里显式汇总 CSS 和交互脚本，否则页面只能渲染静态 HTML。
Content.css = concatenateResources(...customPages.map((component) => component.css))
Content.beforeDOMLoaded = concatenateResources(...customPages.map((component) => component.beforeDOMLoaded))
Content.afterDOMLoaded = concatenateResources(...customPages.map((component) => component.afterDOMLoaded))

export default (() => Content) satisfies QuartzComponentConstructor

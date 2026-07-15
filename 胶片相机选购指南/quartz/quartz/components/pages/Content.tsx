import { ComponentChildren } from "preact"
import { Element, Root } from "hast"
import { visit } from "unist-util-visit"
import { htmlToJsx } from "../../util/jsx"
import { FullSlug, resolveRelative } from "../../util/path"
import { concatenateResources } from "../../util/resources"
import HomePageConstructor from "../HomePage"
import LearnPageConstructor from "../LearnPage"
import KnowledgePageConstructor from "../KnowledgePage"
import BuyingGuidePageConstructor from "../BuyingGuidePage"
import PortalPagesConstructor from "../PortalPages"
import CameraAtlasPageConstructor from "../CameraAtlasPage"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const HomePage = HomePageConstructor()
const LearnPage = LearnPageConstructor()
const KnowledgePage = KnowledgePageConstructor()
const BuyingGuidePage = BuyingGuidePageConstructor()
const PortalPages = PortalPagesConstructor()
const CameraAtlasPage = CameraAtlasPageConstructor()
const customPages: QuartzComponent[] = [HomePage, LearnPage, KnowledgePage, BuyingGuidePage, PortalPages, CameraAtlasPage]
const customPortalSlugs = new Set(["film", "videos", "about"])

function canonicalizeInternalLinks(props: QuartzComponentProps) {
  const { allFiles, fileData, tree } = props
  if (!fileData.slug) return

  const canonicalByAlias = new Map<string, FullSlug>()
  for (const page of allFiles) {
    if (!page.slug) continue
    for (const alias of page.aliases ?? []) {
      canonicalByAlias.set(String(alias), page.slug)
    }
  }

  visit(tree as Root, "element", (node: Element) => {
    if (node.tagName !== "a" || !node.properties) return
    const targetSlug = node.properties["data-slug"]
    if (typeof targetSlug !== "string") return
    const canonicalSlug = canonicalByAlias.get(targetSlug)
    if (!canonicalSlug || canonicalSlug === targetSlug) return

    const href = typeof node.properties.href === "string" ? node.properties.href : ""
    const anchor = href.includes("#") ? `#${href.split("#").slice(1).join("#")}` : ""
    node.properties.href = `${resolveRelative(fileData.slug!, canonicalSlug)}${anchor}`
    node.properties["data-slug"] = canonicalSlug
  })
}

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

  if (slug === "encyclopedia") {
    return <KnowledgePage {...props} />
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

  canonicalizeInternalLinks(props)
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

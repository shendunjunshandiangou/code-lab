import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import HomePageConstructor from "../HomePage"
import LearnPageConstructor from "../LearnPage"
import PortalPagesConstructor from "../PortalPages"
import CameraAtlasPageConstructor from "../CameraAtlasPage"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const HomePage = HomePageConstructor()
const LearnPage = LearnPageConstructor()
const PortalPages = PortalPagesConstructor()
const CameraAtlasPage = CameraAtlasPageConstructor()
const customPortalSlugs = new Set(["buying", "film", "videos", "about"])

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

export default (() => Content) satisfies QuartzComponentConstructor

import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import HomePageConstructor from "../HomePage"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const HomePage = HomePageConstructor()

const Content: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, tree } = props

  if (fileData.slug === "index") {
    return (
      <article class="popover-hint home-page">
        <HomePage {...props} />
      </article>
    )
  }

  const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const classString = ["popover-hint", ...classes].join(" ")
  return <article class={classString}>{content}</article>
}

export default (() => Content) satisfies QuartzComponentConstructor

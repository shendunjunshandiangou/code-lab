import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

const homeLayoutCss = `
  body[data-slug=index] #quartz-root.page {
    width: 100%;
    max-width: none !important;
    margin: 0 !important;
  }

  body[data-slug=index] #quartz-root > #quartz-body {
    display: block !important;
    width: 100%;
    padding: 0 !important;
    margin: 0 !important;
  }

  body[data-slug=index] #quartz-root > #quartz-body > .sidebar,
  body[data-slug=index] #quartz-root > #quartz-body .sidebar.left,
  body[data-slug=index] #quartz-root > #quartz-body .sidebar.right,
  body[data-slug=index] #quartz-root > #quartz-body .page-header,
  body[data-slug=index] #quartz-root > #quartz-body footer {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    border: 0 !important;
    backdrop-filter: none !important;
  }

  body[data-slug=index] #quartz-root > #quartz-body > .center {
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
`

function HomeLayoutFix({ fileData }: QuartzComponentProps) {
  if (fileData.slug !== "index") return null
  return <style dangerouslySetInnerHTML={{ __html: homeLayoutCss }} />
}

export default (() => HomeLayoutFix) satisfies QuartzComponentConstructor

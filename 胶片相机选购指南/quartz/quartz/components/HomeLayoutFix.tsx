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

  body[data-slug=index] article.home-page {
    display: block !important;
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    filter: none !important;
    opacity: 1 !important;
  }

  body[data-slug=index] .home-hero > pre {
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    aspect-ratio: 4 / 5;
    min-height: 0;
    margin: 0;
    padding: 0.8rem 0.8rem 3rem;
    border: 0;
    border-radius: 2px;
    background: #fffaf2;
    box-shadow: 0 20px 55px rgba(54, 43, 32, 0.1);
    transform: rotate(2deg);
  }

  body[data-slug=index] .home-hero > pre::before {
    content: "";
    position: absolute;
    inset: 0.8rem 0.8rem 3rem;
    background:
      linear-gradient(145deg, rgba(154, 91, 50, 0.08), transparent 45%),
      url("https://commons.wikimedia.org/wiki/Special:Redirect/file/Nikon_FM2_et_Nikkor_50mm_f1.8.jpg?width=1600") center / cover no-repeat;
  }

  body[data-slug=index] .home-hero > pre::after {
    content: "Nikon FM2 · Patrick Dehais · Wikimedia Commons";
    position: absolute;
    left: 1.2rem;
    right: 1.2rem;
    bottom: 1rem;
    color: #6d665f;
    font-family: var(--codeFont);
    font-size: 0.68rem;
    letter-spacing: 0.04em;
  }

  body[data-slug=index] .home-hero > pre > code {
    display: none !important;
  }

  @media (max-width: 1100px) {
    body[data-slug=index] .home-hero > pre {
      width: min(520px, 90vw);
      margin: 0 auto;
    }
  }
`

function HomeLayoutFix({ fileData }: QuartzComponentProps) {
  if (fileData.slug !== "index") return null
  return <style dangerouslySetInnerHTML={{ __html: homeLayoutCss }} />
}

export default (() => HomeLayoutFix) satisfies QuartzComponentConstructor

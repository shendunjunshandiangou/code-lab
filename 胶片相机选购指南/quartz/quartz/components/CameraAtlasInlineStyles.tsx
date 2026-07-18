import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const cameraAtlasInlineStyles = `
/* 相机图鉴关键布局随 HTML 输出，避免 index.css 缓存导致桌面端仍显示 820px 窄栏 */
body[data-slug=cameras] #quartz-root.page,
body[data-slug=cameras] #quartz-body,
body[data-slug=cameras] .center {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
}

.center > article.camera-atlas-page {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  color: #242520 !important;
  background: #f4f1ea !important;
}

.camera-atlas-page {
  --atlas-content-width: min(calc(100vw - 3rem), 1920px);
}

.camera-atlas-header,
.camera-atlas-stats {
  width: var(--atlas-content-width) !important;
  max-width: none !important;
  margin-inline: auto !important;
}

.camera-atlas-browser {
  width: 100% !important;
  max-width: none !important;
  padding-inline: max(1.25rem, calc((100% - var(--atlas-content-width)) / 2)) !important;
}

@media (min-width: 1200px) {
  .camera-atlas-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  }
}

@media (min-width: 1680px) {
  .camera-atlas-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
  }
}
`

const CameraAtlasInlineStyles: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (fileData.slug !== "cameras") return null
  return <style id="camera-atlas-inline-styles">{cameraAtlasInlineStyles}</style>
}

export default (() => CameraAtlasInlineStyles) satisfies QuartzComponentConstructor

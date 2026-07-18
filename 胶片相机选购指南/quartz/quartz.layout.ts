import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// 全站共享组件：保留 Quartz 的内容与搜索能力，替换默认知识库外壳
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.CameraStructuredData(),
    Component.Readability(),
    Component.ContentLayout(),
    Component.IconTuning(),
    Component.BuyingGuideInlineStyles(),
    Component.CameraAtlasInlineStyles(),
    Component.SiteHeader(),
    Component.Search({ enablePreview: true }),
  ],
  afterBody: [Component.SourceVideos()],
  footer: Component.SiteFooter(),
}

// 普通文章沿用紧凑页头；detail_version: 2 的机型由统一组件展示价格、摘要和章节导航。
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [Component.PageHero(), Component.CameraDetailGuide(), Component.CameraPricePanel()],
  left: [],
  right: [],
}

// 标签页和文件夹页也不再展示 Explorer、Backlinks 或技术面包屑
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.PageHero()],
  left: [],
  right: [],
}

import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// 全站共享组件：保留 Quartz 的内容与搜索能力，替换默认知识库外壳
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.Readability(),
    Component.ContentLayout(),
    Component.IconTuning(),
    Component.SiteHeader(),
    Component.Search({ enablePreview: true }),
  ],
  afterBody: [Component.SourceVideos()],
  footer: Component.SiteFooter(),
}

// 文章、机型与栏目入口统一使用内容型布局
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [Component.PageHero()],
  left: [],
  right: [],
}

// 标签页和文件夹页也不再展示 Explorer、Backlinks 或技术面包屑
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.PageHero()],
  left: [],
  right: [],
}

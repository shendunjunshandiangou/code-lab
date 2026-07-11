import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

const isNotHomepage = (page: any) => page.fileData.slug !== "index"

// 所有页面共享的组件
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "开始选购": "/code-lab/04_knowledge/选购决策/README",
      "GitHub 仓库": "https://github.com/shendunjunshandiangou/code-lab",
    },
  }),
}

// 单页布局（文章/笔记页面）
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: isNotHomepage,
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: isNotHomepage,
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: isNotHomepage,
    }),
    Component.ConditionalRender({
      component: Component.TagList(),
      condition: isNotHomepage,
    }),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      title: "浏览目录",
      folderDefaultState: "collapsed",
      folderClickBehavior: "collapse",
      useSavedState: true,
      filterFn: (node) => !["tags", "03_outline", "index"].includes(node.slugSegment),
      mapFn: (node) => {
        const displayNames: Record<string, string> = {
          "02_atoms": "资料索引",
          "04_knowledge": "阅读指南",
          models: "机型卡片",
          concepts: "概念词典",
          comparisons: "选购对比",
        }
        if (displayNames[node.slugSegment]) {
          node.displayName = displayNames[node.slugSegment]
        }
      },
    }),
  ],
  right: [
    Component.ConditionalRender({
      component: Component.DesktopOnly(Component.TableOfContents()),
      condition: isNotHomepage,
    }),
    Component.ConditionalRender({
      component: Component.Backlinks(),
      condition: isNotHomepage,
    }),
  ],
}

// 列表页布局（标签页、文件夹页）
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      title: "浏览目录",
      folderDefaultState: "collapsed",
      folderClickBehavior: "collapse",
      useSavedState: true,
      filterFn: (node) => !["tags", "03_outline", "index"].includes(node.slugSegment),
      mapFn: (node) => {
        const displayNames: Record<string, string> = {
          "02_atoms": "资料索引",
          "04_knowledge": "阅读指南",
          models: "机型卡片",
          concepts: "概念词典",
          comparisons: "选购对比",
        }
        if (displayNames[node.slugSegment]) {
          node.displayName = displayNames[node.slugSegment]
        }
      },
    }),
  ],
  right: [],
}

import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponentProps } from "./quartz/components/types"

const notHome = (page: QuartzComponentProps) => page.fileData.slug !== "index"

// 所有页面共享的组件
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "GitHub 仓库": "https://github.com/shendunjunshandiangou/code-lab",
    },
  }),
}

// 面向读者的目录：保留后台目录结构，但不再把 atoms、outline 等内部命名直接暴露给访客
const readerExplorer = Component.Explorer({
  title: "浏览指南",
  folderDefaultState: "collapsed",
  folderClickBehavior: "link",
  filterFn: (node) => {
    const hidden = new Set(["tags", "00_raw", "01_articles", "03_outline", "quartz"])
    return !hidden.has(node.slugSegment)
  },
  mapFn: (node) => {
    const names: Record<string, string> = {
      "02_atoms": "相机与知识卡片",
      "04_knowledge": "主题指南",
      concepts: "摄影术语与知识",
      models: "相机图鉴",
      comparisons: "选购对比",
      科普入门: "新手入门",
      知识百科: "系统学习",
      选购决策: "帮我选相机",
    }

    if (names[node.slugSegment]) {
      node.displayName = names[node.slugSegment]
    }
  },
})

// 单页布局（文章/笔记页面）
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: notHome,
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: notHome,
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: notHome,
    }),
    Component.ConditionalRender({
      component: Component.TagList(),
      condition: notHome,
    }),
  ],
  left: [
    Component.ConditionalRender({
      component: Component.PageTitle(),
      condition: notHome,
    }),
    Component.MobileOnly(Component.Spacer()),
    Component.ConditionalRender({
      condition: notHome,
      component: Component.Flex({
        components: [
          {
            Component: Component.Search(),
            grow: true,
          },
          { Component: Component.Darkmode() },
          { Component: Component.ReaderMode() },
        ],
      }),
    }),
    Component.ConditionalRender({
      component: readerExplorer,
      condition: notHome,
    }),
  ],
  right: [
    Component.ConditionalRender({
      condition: notHome,
      component: Component.DesktopOnly(Component.TableOfContents()),
    }),
    Component.ConditionalRender({
      component: Component.Backlinks(),
      condition: notHome,
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
    readerExplorer,
  ],
  right: [],
}

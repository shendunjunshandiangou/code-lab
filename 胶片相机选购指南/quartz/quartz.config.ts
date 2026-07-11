import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * 胶片相机选购指南 - Quartz 配置
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "胶片相机指南",
    pageTitleSuffix: "｜新手入门与选购",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "zh-CN",
    baseUrl: "shendunjunshandiangou.github.io/code-lab",
    ignorePatterns: [
      // Quartz 引擎自身（避免把自己当内容构建）
      "quartz",
      "quartz/**",
      // 项目脚本和资源
      "scripts",
      "scripts/**",
      "assets",
      "assets/**",
      // 不发布的 Obsidian 元数据
      ".obsidian",
      ".obsidian/**",
      ".claude",
      ".claude/**",
      // 后台内容生产层：保留在仓库中，但不直接暴露给访客
      "00_raw",
      "00_raw/**",
      "01_articles",
      "01_articles/**",
      "03_outline",
      "03_outline/**",
      "_pipeline_tasks.md",
      // 非知识库的教程文章（根目录）
      "胶片摄影零基础入门*.md",
      "用 AI 搭建专属知识库*.md",
    ],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Noto Serif SC",
        body: "Noto Sans SC",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#f4f0e8",
          lightgray: "#e7dfd3",
          gray: "#aaa097",
          darkgray: "#625c56",
          dark: "#24211f",
          secondary: "#9a5b32",
          tertiary: "#68705a",
          highlight: "rgba(154, 91, 50, 0.10)",
          textHighlight: "#e3a72f55",
        },
        darkMode: {
          light: "#191715",
          lightgray: "#2a2723",
          gray: "#756d65",
          darkgray: "#d0c7bd",
          dark: "#f2eadf",
          secondary: "#d08a58",
          tertiary: "#9aa387",
          highlight: "rgba(208, 138, 88, 0.15)",
          textHighlight: "#8f2e2e66",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: true }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: false,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config

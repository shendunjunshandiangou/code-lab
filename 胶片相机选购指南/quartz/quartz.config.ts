import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * 胶片相机选购指南 - Quartz 配置
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "📷 胶片相机选购指南",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "zh-CN",
    baseUrl: "shendunjunshandiangou.github.io/code-lab",
    ignorePatterns: [
      // 不发布的目录和文件
      "private",
      "templates",
      ".obsidian",
      ".obsidian/**",
      ".claude",
      ".claude/**",
      "00_raw",
      "00_raw/**",
      "01_articles",
      "01_articles/**",
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
        // 西文用 Inter（干净现代），中文自动回退系统字体
        header: "Inter",
        body: "Inter",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f5",
          lightgray: "#e8e4e0",
          gray: "#b0a89e",
          darkgray: "#5c5550",
          dark: "#2b2520",
          secondary: "#8b4513",
          tertiary: "#5a7d5a",
          highlight: "rgba(139, 69, 19, 0.1)",
          textHighlight: "#f5e6d388",
        },
        darkMode: {
          light: "#1a1816",
          lightgray: "#2d2a26",
          gray: "#6b645c",
          darkgray: "#c4bcb2",
          dark: "#e8e4e0",
          secondary: "#c9956b",
          tertiary: "#7a9d7a",
          highlight: "rgba(201, 149, 107, 0.15)",
          textHighlight: "#8b691488",
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
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
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
      // CustomOgImages 在 CI 中可能很慢，暂时禁用
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config

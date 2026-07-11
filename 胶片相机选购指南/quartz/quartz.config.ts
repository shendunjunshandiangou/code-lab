import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * 胶片相机选购指南 - Quartz 配置
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "胶片相机指南",
    pageTitleSuffix: "｜从零基础到第一台相机",
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
      // 不发布的内容层
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
        // 西文标题保留杂志感，中文回退到系统宋体；正文优先使用清晰的无衬线字体
        header: "Source Serif 4",
        body: "Inter",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#f7f3eb",
          lightgray: "#e5ddd1",
          gray: "#9c9184",
          darkgray: "#554d44",
          dark: "#211c18",
          secondary: "#964322",
          tertiary: "#3f6b59",
          highlight: "rgba(150, 67, 34, 0.10)",
          textHighlight: "#e7c9a788",
        },
        darkMode: {
          light: "#191714",
          lightgray: "#2c2823",
          gray: "#81776c",
          darkgray: "#cec5b9",
          dark: "#f1eae0",
          secondary: "#e29a72",
          tertiary: "#87b49f",
          highlight: "rgba(226, 154, 114, 0.14)",
          textHighlight: "#81543388",
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
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
      // CustomOgImages 在 CI 中构建较慢，暂不启用
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config

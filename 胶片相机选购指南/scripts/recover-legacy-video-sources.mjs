import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { csvObjects, scalar, writeCsv } from "./csv-utils.mjs"

const root = path.resolve(import.meta.dirname, "..")
const repoRoot = path.resolve(root, "..")
const modelsDir = path.join(root, "02_atoms", "models")
const subtitleIndexFile = path.join(root, "data", "subtitle-video-index.csv")
const recoveryFile = path.join(root, "data", "legacy-video-sources.csv")
const articleVideosFile = path.join(root, "data", "article-videos.csv")
const legacyRef = process.env.LEGACY_SOURCE_REF || "73aafa3bdc7970f89e94ef48bdc230f85e4414fc"

if (!fs.existsSync(subtitleIndexFile)) throw new Error("缺少 data/subtitle-video-index.csv")

function normalizeTitle(value) {
  return String(value ?? "")
    .replace(/\.md$/i, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replace(/[｜|_—–\-：:·•【】\[\]（）()《》“”"'’‘!?！？,，。]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase()
}

function oldFile(relativePath) {
  const repoPath = path.relative(repoRoot, relativePath).replaceAll(path.sep, "/")
  try {
    return execFileSync("git", ["show", `${legacyRef}:${repoPath}`], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
  } catch {
    return ""
  }
}

function sourceArticles(frontmatter) {
  const lines = frontmatter.split("\n")
  const start = lines.findIndex((line) => /^source:\s*$/.test(line))
  if (start < 0) return []
  const result = []
  for (let index = start + 1; index < lines.length; index += 1) {
    const match = lines[index].match(/^\s{2}-\s+["']?\[\[(.+?)\]\]["']?\s*$/)
    if (!match) break
    result.push(match[1])
  }
  return result
}

const subtitleRows = csvObjects(fs.readFileSync(subtitleIndexFile, "utf8"))
const subtitleByTitle = new Map()
for (const row of subtitleRows) {
  const key = normalizeTitle(row.article_title)
  if (!key) continue
  const current = subtitleByTitle.get(key)
  // 优先使用经过整理的 01_articles，避免重复采用带日期前缀的原始稿。
  if (!current || (row.source_group === "01_articles" && current.source_group !== "01_articles")) {
    subtitleByTitle.set(key, row)
  }
}

const recoveryRows = []
const mappedRows = []
const mappedKeys = new Set()

for (const filename of fs.readdirSync(modelsDir).filter((name) => name.endsWith(".md")).sort((a, b) => a.localeCompare(b, "zh-CN"))) {
  const currentPath = path.join(modelsDir, filename)
  const current = fs.readFileSync(currentPath, "utf8")
  const currentMatch = current.match(/^---\n([\s\S]*?)\n---/)
  if (!currentMatch) continue

  const permalink = scalar(currentMatch[1], "permalink")
  const cameraTitle = scalar(currentMatch[1], "title") || filename.replace(/\.md$/, "")
  const legacy = oldFile(currentPath)
  const legacyMatch = legacy.match(/^---\n([\s\S]*?)\n---/)
  if (!legacyMatch) continue

  for (const articleRef of sourceArticles(legacyMatch[1])) {
    const articleTitle = path.basename(articleRef).replace(/\.md$/i, "")
    const subtitle = subtitleByTitle.get(normalizeTitle(articleTitle))
    const matched = Boolean(subtitle?.bvid || subtitle?.video_url)

    recoveryRows.push({
      slug: permalink.replace(/^cameras\//, ""),
      机型: cameraTitle,
      原始字幕文章: articleTitle,
      旧版引用: articleRef,
      字幕索引路径: subtitle?.archive_path ?? "",
      B站链接: subtitle?.video_url ?? "",
      BV号: subtitle?.bvid ?? "",
      创作者: subtitle?.creator ?? "",
      状态: matched ? "已恢复" : "字幕索引未匹配",
    })

    if (!matched) continue
    const key = `${path.relative(root, currentPath).replaceAll(path.sep, "/")}::${subtitle.bvid || subtitle.video_url}`
    if (mappedKeys.has(key)) continue
    mappedKeys.add(key)
    mappedRows.push({
      article_path: path.relative(root, currentPath).replaceAll(path.sep, "/"),
      article_title: cameraTitle,
      bvid: subtitle.bvid ?? "",
      video_title: subtitle.article_title,
      creator: subtitle.creator || "原视频创作者",
      url: subtitle.video_url || `https://www.bilibili.com/video/${subtitle.bvid}`,
      cover: "",
      duration: "",
      role: "原始字幕来源",
      search_keyword: articleTitle,
      status: "有效",
      notes: `该机型内容由旧知识库引用的字幕文章《${articleTitle}》整理而来。`,
    })
  }
}

// 保留没有被旧来源恢复覆盖的人工映射；同一文章恢复出真实视频后，删除该文章的待核验占位。
const recoveredPaths = new Set(mappedRows.map((row) => row.article_path))
if (fs.existsSync(articleVideosFile)) {
  for (const row of csvObjects(fs.readFileSync(articleVideosFile, "utf8"))) {
    if (recoveredPaths.has(row.article_path) && row.status === "待核验") continue
    const key = `${row.article_path}::${row.bvid || row.url || row.video_title}`
    if (mappedKeys.has(key)) continue
    mappedKeys.add(key)
    mappedRows.push({
      article_path: row.article_path,
      article_title: row.article_title,
      bvid: row.bvid,
      video_title: row.video_title,
      creator: row.creator,
      url: row.url,
      cover: row.cover,
      duration: row.duration,
      role: row.role,
      search_keyword: row.search_keyword,
      status: row.status,
      notes: row.notes,
    })
  }
}

mappedRows.sort((a, b) => a.article_path.localeCompare(b.article_path, "zh-CN") || a.video_title.localeCompare(b.video_title, "zh-CN"))
recoveryRows.sort((a, b) => a.机型.localeCompare(b.机型, "zh-CN") || a.原始字幕文章.localeCompare(b.原始字幕文章, "zh-CN"))

writeCsv(recoveryFile, ["slug", "机型", "原始字幕文章", "旧版引用", "字幕索引路径", "B站链接", "BV号", "创作者", "状态"], recoveryRows)
writeCsv(articleVideosFile, ["article_path", "article_title", "bvid", "video_title", "creator", "url", "cover", "duration", "role", "search_keyword", "status", "notes"], mappedRows)

const matchedCount = recoveryRows.filter((row) => row.状态 === "已恢复").length
const mappedArticleCount = new Set(mappedRows.filter((row) => row.status === "有效").map((row) => row.article_path)).size
console.log(`旧版来源恢复完成：${recoveryRows.length} 条机型—字幕关系，匹配 ${matchedCount} 条；生成 ${mappedRows.filter((row) => row.status === "有效").length} 条有效视频，覆盖 ${mappedArticleCount} 篇机型页。`)

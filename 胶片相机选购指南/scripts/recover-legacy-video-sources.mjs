import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { scalar, writeCsv } from "./csv-utils.mjs"

const root = path.resolve(import.meta.dirname, "..")
const repoRoot = path.resolve(root, "..")
const modelsDir = path.join(root, "02_atoms", "models")
const output = path.join(root, "data", "legacy-video-sources.csv")
const legacyRef = process.env.LEGACY_SOURCE_REF || "73aafa3bdc7970f89e94ef48bdc230f85e4414fc"

function oldFile(relativePath) {
  const repoPath = path.relative(repoRoot, relativePath).replaceAll(path.sep, "/")
  try {
    return execFileSync("git", ["show", `${legacyRef}:${repoPath}`], { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
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

function findArticleFile(articleRef) {
  const basename = path.basename(articleRef).replace(/\.md$/i, "")
  const candidates = [
    path.join(root, "00_raw"),
    path.join(root, "01_articles"),
    path.join(root, "02_atoms", "01_articles"),
  ]
  for (const base of candidates) {
    if (!fs.existsSync(base)) continue
    const stack = [base]
    while (stack.length) {
      const current = stack.pop()
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const full = path.join(current, entry.name)
        if (entry.isDirectory()) stack.push(full)
        else if (entry.isFile() && entry.name.replace(/\.md$/i, "") === basename) return full
      }
    }
  }
  return ""
}

function bilibiliInfo(file) {
  if (!file) return { url: "", bvid: "" }
  const content = fs.readFileSync(file, "utf8")
  const url = content.match(/https?:\/\/(?:www\.)?bilibili\.com\/video\/(BV[0-9A-Za-z]{10})[^\s)\]"']*/i)?.[0]
    || content.match(/https?:\/\/b23\.tv\/[0-9A-Za-z]+/i)?.[0]
    || ""
  const bvid = content.match(/\bBV[0-9A-Za-z]{10}\b/)?.[0] || ""
  return { url, bvid }
}

const rows = []
for (const filename of fs.readdirSync(modelsDir).filter((name) => name.endsWith(".md")).sort((a, b) => a.localeCompare(b, "zh-CN"))) {
  const currentPath = path.join(modelsDir, filename)
  const current = fs.readFileSync(currentPath, "utf8")
  const currentMatch = current.match(/^---\n([\s\S]*?)\n---/)
  if (!currentMatch) continue
  const permalink = scalar(currentMatch[1], "permalink")
  const title = scalar(currentMatch[1], "title") || filename.replace(/\.md$/, "")
  const legacy = oldFile(currentPath)
  const legacyMatch = legacy.match(/^---\n([\s\S]*?)\n---/)
  if (!legacyMatch) continue

  for (const articleRef of sourceArticles(legacyMatch[1])) {
    const articleFile = findArticleFile(articleRef)
    const video = bilibiliInfo(articleFile)
    rows.push({
      slug: permalink.replace(/^cameras\//, ""),
      机型: title,
      原始字幕文章: path.basename(articleRef).replace(/\.md$/i, ""),
      旧版引用: articleRef,
      当前字幕文件: articleFile ? path.relative(root, articleFile).replaceAll(path.sep, "/") : "",
      B站链接: video.url,
      BV号: video.bvid,
      状态: articleFile ? (video.url || video.bvid ? "已找到视频" : "字幕中未识别到链接") : "缺少字幕文件",
    })
  }
}

writeCsv(output, ["slug", "机型", "原始字幕文章", "旧版引用", "当前字幕文件", "B站链接", "BV号", "状态"], rows)
console.log(`旧版来源恢复完成：${rows.length} 条机型—字幕文章关系；${rows.filter((row) => row.当前字幕文件).length} 条找到字幕文件；${rows.filter((row) => row.B站链接 || row.BV号).length} 条找到视频。`)

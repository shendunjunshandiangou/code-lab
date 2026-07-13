import fs from "node:fs"
import path from "node:path"
import { csvObjects, upsertScalar } from "./csv-utils.mjs"

const root = path.resolve(import.meta.dirname, "..")
const csvFile = path.join(root, "data", "article-videos.csv")
if (!fs.existsSync(csvFile)) throw new Error("缺少 data/article-videos.csv")

const validStatuses = new Set(["有效", "待核验", "停用"])
const grouped = new Map()
for (const row of csvObjects(fs.readFileSync(csvFile, "utf8"))) {
  if (!row.article_path) throw new Error(`第 ${row.__row} 行 article_path 不能为空`)
  if (!validStatuses.has(row.status)) throw new Error(`第 ${row.__row} 行 status 只能是：有效、待核验、停用`)
  if (row.status === "有效") {
    if (!row.bvid && !row.url) throw new Error(`第 ${row.__row} 行有效视频必须填写 bvid 或 url`)
    if (row.bvid && !/^BV[0-9A-Za-z]{10}$/.test(row.bvid)) throw new Error(`第 ${row.__row} 行 BV 号格式不正确`)
    if (!row.video_title || !row.creator) throw new Error(`第 ${row.__row} 行有效视频必须填写标题和创作者`)
  }
  const list = grouped.get(row.article_path) ?? []
  list.push(row)
  grouped.set(row.article_path, list)
}

let changed = 0
for (const [articlePath, rows] of grouped) {
  const fullPath = path.join(root, articlePath)
  if (!fs.existsSync(fullPath)) throw new Error(`视频映射找不到文章：${articlePath}`)
  const original = fs.readFileSync(fullPath, "utf8")
  const match = original.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error(`${articlePath} 缺少 frontmatter`)
  let [, fm, body] = match

  const active = rows.filter((row) => row.status === "有效").map((row) => ({
    platform: "bilibili",
    ...(row.bvid ? { bvid: row.bvid } : {}),
    title: row.video_title,
    creator: row.creator,
    url: row.url || `https://www.bilibili.com/video/${row.bvid}`,
    ...(row.cover ? { cover: row.cover } : {}),
    ...(row.duration ? { duration: row.duration } : {}),
    ...(row.role ? { role: row.role } : {}),
  }))

  fm = upsertScalar(fm, "video_mapping_status", active.length > 0 ? "已映射" : "待核验")
  const sourceLine = `source_videos: ${JSON.stringify(active)}`
  fm = /^source_videos:/m.test(fm)
    ? fm.replace(/^source_videos:.*$/m, sourceLine)
    : `${fm.trimEnd()}\n${sourceLine}`

  const note = active.length > 0
    ? rows.find((row) => row.notes)?.notes || "视频映射由 data/article-videos.csv 维护；仅展示已核验的具体视频。"
    : null
  fm = upsertScalar(fm, "source_note", note)

  const next = `---\n${fm}\n---\n${body}`
  if (next !== original) {
    fs.writeFileSync(fullPath, next, "utf8")
    changed += 1
  }
}

console.log(`视频映射同步完成：${grouped.size} 篇文章，更新 ${changed} 篇，已启用 ${[...grouped.values()].flat().filter((row) => row.status === "有效").length} 条视频。`)

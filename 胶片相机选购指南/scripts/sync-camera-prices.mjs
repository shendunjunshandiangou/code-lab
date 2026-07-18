import fs from "node:fs"
import path from "node:path"
import { csvObjects, scalar, upsertScalar } from "./csv-utils.mjs"

const root = path.resolve(import.meta.dirname, "..")
const modelsDir = path.join(root, "02_atoms", "models")
const csvFile = path.join(root, "data", "camera-prices.csv")

if (!fs.existsSync(csvFile)) throw new Error("缺少 data/camera-prices.csv，请先运行 export-camera-prices.mjs")

function parsePrice(value, label, row) {
  if (value === "") return null
  if (!/^[1-9]\d*$/.test(value)) throw new Error(`第 ${row} 行 ${label} 必须是正整数或留空`)
  return Number(value)
}

function validateMonth(value, row) {
  if (!/^\d{4}-\d{2}$/.test(value)) throw new Error(`第 ${row} 行核价月份必须是 YYYY-MM`)
}

const records = csvObjects(fs.readFileSync(csvFile, "utf8"))
const bySlug = new Map()
for (const record of records) {
  const row = record.__row
  const slug = record.slug
  if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw new Error(`第 ${row} 行 slug 为空或格式不正确`)
  if (bySlug.has(slug)) throw new Error(`价格表 slug 重复：${slug}`)

  const min = parsePrice(record.最低价, "最低价", row)
  const typical = parsePrice(record.典型价, "典型价", row)
  const max = parsePrice(record.最高价, "最高价", row)
  if (min !== null && max !== null && min > max) throw new Error(`第 ${row} 行最低价不能高于最高价`)
  if (typical !== null && min !== null && typical < min) throw new Error(`第 ${row} 行典型价不能低于最低价`)
  if (typical !== null && max !== null && typical > max) throw new Error(`第 ${row} 行典型价不能高于最高价`)
  validateMonth(record.核价月份, row)
  if (!record.市场) throw new Error(`第 ${row} 行市场不能为空`)
  if (!record.成色口径) throw new Error(`第 ${row} 行成色口径不能为空`)
  if (!new Set(["有效", "待核价", "暂停推荐"]).has(record.状态)) throw new Error(`第 ${row} 行状态只能是：有效、待核价、暂停推荐`)

  bySlug.set(slug, { ...record, min, typical, max })
}

const seen = new Set()
let changed = 0
for (const file of fs.readdirSync(modelsDir).filter((name) => name.endsWith(".md")).sort()) {
  const fullPath = path.join(modelsDir, file)
  const original = fs.readFileSync(fullPath, "utf8")
  const match = original.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) continue
  let [, fm, body] = match
  if (scalar(fm, "entity") !== "camera") continue

  const slug = scalar(fm, "permalink").replace(/^\/?cameras\//, "")
  const record = bySlug.get(slug)
  if (!record) throw new Error(`${file} 在价格表中没有对应 slug：${slug}`)
  seen.add(slug)

  fm = upsertScalar(fm, "price_min", record.min)
  fm = upsertScalar(fm, "price_typical", record.typical)
  fm = upsertScalar(fm, "price_max", record.max)
  fm = upsertScalar(fm, "price_currency", "CNY")
  fm = upsertScalar(fm, "price_region", record.市场)
  fm = upsertScalar(fm, "price_checked_at", record.核价月份)
  fm = upsertScalar(fm, "price_condition", record.成色口径)
  fm = upsertScalar(fm, "price_note", record.价格备注)
  fm = upsertScalar(fm, "price_status", record.状态)

  // 详情页价格只由 frontmatter 渲染，删除正文里容易过期的手写价格卡片。
  body = body.replace(/\n?\s*<div><strong>参考价格<\/strong><span>[\s\S]*?<\/span><\/div>\s*/g, "\n")

  const next = `---\n${fm}\n---\n${body}`
  if (next !== original) {
    fs.writeFileSync(fullPath, next, "utf8")
    changed += 1
  }
}

const extras = [...bySlug.keys()].filter((slug) => !seen.has(slug))
if (extras.length > 0) throw new Error(`价格表存在找不到机型页面的 slug：${extras.join("、")}`)
if (seen.size !== records.length) throw new Error(`价格同步数量异常：页面 ${seen.size}，价格表 ${records.length}`)

console.log(`价格同步完成：校验 ${records.length} 行，更新 ${changed} 个机型页面。`)

import fs from "node:fs"
import path from "node:path"
import { scalar, writeCsv } from "./csv-utils.mjs"

const root = path.resolve(import.meta.dirname, "..")
const modelsDir = path.join(root, "02_atoms", "models")
const output = path.join(root, "data", "camera-prices.csv")
const force = process.argv.includes("--force")

if (fs.existsSync(output) && !force) {
  console.log("价格表已存在，跳过初始化。需要从 Markdown 重新导出时使用 --force。")
  process.exit(0)
}

const headers = [
  "slug",
  "机型",
  "最低价",
  "典型价",
  "最高价",
  "价格备注",
  "成色口径",
  "市场",
  "核价月份",
  "状态",
]

const rows = []
for (const file of fs.readdirSync(modelsDir).filter((name) => name.endsWith(".md")).sort((a, b) => a.localeCompare(b, "zh-CN"))) {
  const content = fs.readFileSync(path.join(modelsDir, file), "utf8")
  const match = content.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) continue
  const fm = match[1]
  if (scalar(fm, "entity") !== "camera") continue

  const permalink = scalar(fm, "permalink")
  const slug = permalink.replace(/^\/?cameras\//, "")
  if (!slug) throw new Error(`${file} 缺少 cameras/<slug> permalink`)

  const min = scalar(fm, "price_min")
  const max = scalar(fm, "price_max")
  const minNumber = Number(min)
  const maxNumber = Number(max)
  const typical = Number.isFinite(minNumber) && Number.isFinite(maxNumber)
    ? Math.round((minNumber + maxNumber) / 2)
    : Number.isFinite(minNumber)
      ? minNumber
      : Number.isFinite(maxNumber)
        ? maxNumber
        : ""

  rows.push({
    slug,
    机型: scalar(fm, "title") || scalar(fm, "model") || file.replace(/\.md$/, ""),
    最低价: min === "null" ? "" : min,
    典型价: typical,
    最高价: max === "null" ? "" : max,
    价格备注: scalar(fm, "price_note"),
    成色口径: scalar(fm, "price_condition") || "仅机身，功能正常，普通使用成色；不含镜头、包装、收藏溢价和待修机",
    市场: scalar(fm, "price_region") || "中国大陆二手市场",
    核价月份: scalar(fm, "price_checked_at") || "2026-07",
    状态: Number.isFinite(minNumber) || Number.isFinite(maxNumber) ? "有效" : "待核价",
  })
}

writeCsv(output, headers, rows)
console.log(`已生成 ${rows.length} 台机型的价格维护表：${path.relative(root, output)}`)

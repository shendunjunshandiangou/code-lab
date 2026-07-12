import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const modelsDir = path.join(root, "02_atoms", "models")
const reportDir = path.join(root, "reports")
const reportFile = path.join(reportDir, "camera-content-audit.md")

const priceGroups = [
  { label: "500 元以内", min: 0, max: 500 },
  { label: "500～1000 元", min: 500, max: 1000 },
  { label: "1000～2000 元", min: 1000, max: 2000 },
  { label: "2000 元以上", min: 2000, max: Number.POSITIVE_INFINITY },
]

function unquote(value) {
  const text = String(value ?? "").trim()
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) return text.slice(1, -1)
  return text
}

function scalar(frontmatter, key) {
  return unquote(frontmatter.match(new RegExp(`^${key}:\\s*(.*)$`, "m"))?.[1] ?? "")
}

function list(frontmatter, key) {
  const lines = frontmatter.split("\n")
  const start = lines.findIndex((line) => line.startsWith(`${key}:`))
  if (start < 0) return []
  const values = []
  for (let index = start + 1; index < lines.length; index += 1) {
    const match = lines[index].match(/^\s{2}-\s+(.*)$/)
    if (!match) break
    values.push(unquote(match[1]))
  }
  return values.filter(Boolean)
}

function numeric(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : Number.NaN
}

function average(min, max) {
  if (Number.isFinite(min) && Number.isFinite(max)) return (min + max) / 2
  if (Number.isFinite(min)) return min
  if (Number.isFinite(max)) return max
  return Number.POSITIVE_INFINITY
}

function beginnerRank(value) {
  if (/强烈推荐/.test(value)) return 0
  if (/推荐/.test(value)) return 1
  if (/可以|适合/.test(value)) return 2
  if (/进阶|谨慎/.test(value)) return 3
  return 4
}

const files = fs.readdirSync(modelsDir).filter((file) => file.endsWith(".md")).sort((a, b) => a.localeCompare(b, "zh-CN"))
const cameras = []

for (const file of files) {
  const content = fs.readFileSync(path.join(modelsDir, file), "utf8")
  const match = content.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) continue
  const fm = match[1]
  if (scalar(fm, "entity") !== "camera") continue

  const title = scalar(fm, "title") || file.replace(/\.md$/, "")
  const priceMin = numeric(scalar(fm, "price_min"))
  const priceMax = numeric(scalar(fm, "price_max"))
  const heroImage = scalar(fm, "hero_image")
  const imageCredit = scalar(fm, "image_credit")
  const imageSource = scalar(fm, "image_source")
  const imageLicense = scalar(fm, "image_license")
  const sources = list(fm, "sources")
  const pendingFields = ["metering", "weight_g", "reliability", "battery", "mount", "focus", "camera_type", "format"]
    .filter((key) => {
      const value = scalar(fm, key)
      return !value || value === "null" || /待核验/.test(value)
    })

  cameras.push({
    file,
    title,
    permalink: scalar(fm, "permalink"),
    beginner: scalar(fm, "beginner_level"),
    priceMin,
    priceMax,
    priceReference: average(priceMin, priceMax),
    heroImage,
    imageComplete: Boolean(heroImage && imageCredit && imageSource && imageLicense),
    hasSources: sources.length > 0,
    pendingFields,
  })
}

const recommendedRows = []
const recommendedMissingImages = []
for (const group of priceGroups) {
  const selected = cameras
    .filter((camera) => camera.priceReference >= group.min && camera.priceReference < group.max)
    .sort((a, b) => beginnerRank(a.beginner) - beginnerRank(b.beginner) || Number(Boolean(b.heroImage)) - Number(Boolean(a.heroImage)) || a.priceReference - b.priceReference || a.title.localeCompare(b.title, "zh-CN"))
    .slice(0, 4)

  for (const camera of selected) {
    recommendedRows.push(`| ${group.label} | ${camera.title} | ${camera.beginner || "待判断"} | ${camera.heroImage ? "有" : "缺"} | ${camera.hasSources ? "有" : "缺"} | ${camera.pendingFields.join("、") || "无"} |`)
    if (!camera.heroImage) recommendedMissingImages.push(camera.title)
  }
}

const missingImage = cameras.filter((camera) => !camera.heroImage)
const incompleteImageMeta = cameras.filter((camera) => camera.heroImage && !camera.imageComplete)
const missingSources = cameras.filter((camera) => !camera.hasSources)
const pending = cameras.filter((camera) => camera.pendingFields.length > 0)

fs.mkdirSync(reportDir, { recursive: true })
const report = `# 机型内容审计\n\n> 自动生成于 2026-07-12。用于安排图片、来源和事实核验优先级。\n\n## 总览\n\n- 机型总数：${cameras.length}\n- 已有主图：${cameras.length - missingImage.length}\n- 图片署名、来源和许可完整：${cameras.filter((camera) => camera.imageComplete).length}\n- 已有资料来源：${cameras.length - missingSources.length}\n- 含待核验关键字段：${pending.length}\n\n## 当前价格选机页推荐\n\n| 价位 | 机型 | 新手定位 | 图片 | 来源 | 待核验字段 |\n|---|---|---|---|---|---|\n${recommendedRows.join("\n")}\n\n## 最高优先级：推荐卡片缺图\n\n${recommendedMissingImages.length ? recommendedMissingImages.map((title) => `- ${title}`).join("\n") : "- 当前推荐卡片均已有图片。"}\n\n## 全量缺口\n\n### 缺少主图（${missingImage.length}）\n\n${missingImage.map((camera) => `- ${camera.title}`).join("\n") || "- 无"}\n\n### 已有图片但版权字段不完整（${incompleteImageMeta.length}）\n\n${incompleteImageMeta.map((camera) => `- ${camera.title}`).join("\n") || "- 无"}\n\n### 缺少资料来源（${missingSources.length}）\n\n${missingSources.map((camera) => `- ${camera.title}`).join("\n") || "- 无"}\n\n### 含待核验关键字段（${pending.length}）\n\n${pending.map((camera) => `- ${camera.title}：${camera.pendingFields.join("、")}`).join("\n") || "- 无"}\n`

fs.writeFileSync(reportFile, report, "utf8")
console.log(`机型内容审计完成：${cameras.length} 台，缺图 ${missingImage.length} 台，缺来源 ${missingSources.length} 台，待核验 ${pending.length} 台。`)

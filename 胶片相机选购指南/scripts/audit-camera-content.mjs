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
  if (!value || value === "null") return Number.NaN
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : Number.NaN
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

function tableValue(body, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return body.match(new RegExp(`^\\|\\s*${escaped}\\s*\\|\\s*(.*?)\\s*\\|$`, "m"))?.[1]?.trim() ?? ""
}

function focusKind(value) {
  if (/自动/.test(value)) return "auto"
  if (/手动|黄斑|估焦|分区/.test(value)) return "manual"
  return ""
}

function exposureKind(value) {
  const kinds = []
  if (/全自动|程序|\bP\b/.test(value)) kinds.push("P")
  if (/光圈优先|\bA\b|\bAv\b/i.test(value)) kinds.push("A")
  if (/快门优先|\bS\b|\bTv\b/i.test(value)) kinds.push("S")
  if (/手动|\bM\b/.test(value)) kinds.push("M")
  return [...new Set(kinds)].sort().join("")
}

const files = fs.readdirSync(modelsDir).filter((file) => file.endsWith(".md")).sort((a, b) => a.localeCompare(b, "zh-CN"))
const cameras = []

for (const file of files) {
  const content = fs.readFileSync(path.join(modelsDir, file), "utf8")
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) continue
  const fm = match[1]
  const body = match[2]
  if (scalar(fm, "entity") !== "camera") continue

  const title = scalar(fm, "title") || file.replace(/\.md$/, "")
  const rawPriceMin = scalar(fm, "price_min")
  const rawPriceMax = scalar(fm, "price_max")
  const priceMin = numeric(rawPriceMin)
  const priceMax = numeric(rawPriceMax)
  const heroImage = scalar(fm, "hero_image")
  const imageCredit = scalar(fm, "image_credit")
  const imageSource = scalar(fm, "image_source")
  const imageLicense = scalar(fm, "image_license")
  const sources = list(fm, "sources")
  const cameraType = scalar(fm, "camera_type")
  const mount = scalar(fm, "mount")
  const focus = scalar(fm, "focus")
  const exposure = list(fm, "exposure_modes").join(" / ")
  const weight = scalar(fm, "weight_g")
  const pendingFields = ["metering", "weight_g", "reliability", "battery", "mount", "focus", "camera_type", "format"]
    .filter((key) => {
      const value = scalar(fm, key)
      return !value || value === "null" || /待核验/.test(value)
    })

  const conflicts = []
  const refillHints = []
  const bodyFocus = tableValue(body, "对焦方式")
  const bodyExposure = tableValue(body, "曝光模式")
  const bodyWeight = tableValue(body, "重量")

  if (rawPriceMin && rawPriceMin !== "null" && !Number.isFinite(priceMin)) conflicts.push("price_min 必须是正数或 null")
  if (rawPriceMax && rawPriceMax !== "null" && !Number.isFinite(priceMax)) conflicts.push("price_max 必须是正数或 null")
  if (Number.isFinite(priceMin) && Number.isFinite(priceMax) && priceMin > priceMax) conflicts.push("price_min 不能高于 price_max")
  if (/单反/.test(cameraType) && /固定镜头/.test(mount)) conflicts.push("单反机型却标记为固定镜头")
  if (focusKind(focus) && focusKind(bodyFocus) && focusKind(focus) !== focusKind(bodyFocus)) {
    conflicts.push(`对焦字段为“${focus}”，参数表为“${bodyFocus}”`)
  }
  if (exposureKind(exposure) && exposureKind(bodyExposure) && exposureKind(exposure) !== exposureKind(bodyExposure)) {
    conflicts.push(`曝光字段为“${exposure}”，参数表为“${bodyExposure}”`)
  }
  if ((!weight || weight === "null") && /\d+\s*g/i.test(bodyWeight)) refillHints.push(`正文重量“${bodyWeight}”可回填 weight_g`)
  if ((!focus || /待核验/.test(focus)) && bodyFocus && !/待核验/.test(bodyFocus)) refillHints.push(`正文对焦“${bodyFocus}”可回填 focus`)
  if (list(fm, "exposure_modes").length === 0 && bodyExposure && !/待核验/.test(bodyExposure)) refillHints.push(`正文曝光“${bodyExposure}”可回填 exposure_modes`)

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
    conflicts,
    refillHints,
    placeholderCount: (body.match(/待补充。/g) ?? []).length,
  })
}

const recommendedRows = []
const recommendedMissingImages = []
for (const group of priceGroups) {
  const candidates = cameras
    .filter((camera) => camera.priceReference >= group.min && camera.priceReference < group.max)
    .sort((a, b) => Number(Boolean(b.heroImage)) - Number(Boolean(a.heroImage)) || beginnerRank(a.beginner) - beginnerRank(b.beginner) || a.priceReference - b.priceReference || a.title.localeCompare(b.title, "zh-CN"))
  const withImages = candidates.filter((camera) => Boolean(camera.heroImage))
  const selected = (withImages.length >= 2 ? withImages : candidates).slice(0, 4)

  for (const camera of selected) {
    recommendedRows.push(`| ${group.label} | ${camera.title} | ${camera.beginner || "待判断"} | ${camera.heroImage ? "有" : "缺"} | ${camera.hasSources ? "有" : "缺"} | ${camera.pendingFields.join("、") || "无"} |`)
    if (!camera.heroImage) recommendedMissingImages.push(camera.title)
  }
}

const missingImage = cameras.filter((camera) => !camera.heroImage)
const incompleteImageMeta = cameras.filter((camera) => camera.heroImage && !camera.imageComplete)
const missingSources = cameras.filter((camera) => !camera.hasSources)
const pending = cameras.filter((camera) => camera.pendingFields.length > 0)
const conflicts = cameras.filter((camera) => camera.conflicts.length > 0)
const refill = cameras.filter((camera) => camera.refillHints.length > 0)
const placeholders = cameras.filter((camera) => camera.placeholderCount > 0)

fs.mkdirSync(reportDir, { recursive: true })
const report = `# 机型内容审计\n\n> 自动生成于 2026-07-12。用于安排图片、来源和事实核验优先级。\n\n## 总览\n\n- 机型总数：${cameras.length}\n- 已有主图：${cameras.length - missingImage.length}\n- 图片署名、来源和许可完整：${cameras.filter((camera) => camera.imageComplete).length}\n- 已有资料来源：${cameras.length - missingSources.length}\n- 含待核验关键字段：${pending.length}\n- 高风险字段冲突：${conflicts.length}\n- 可从正文回填结构化字段：${refill.length}\n- 正文仍含“待补充”：${placeholders.length}\n\n## 当前价格选机页推荐\n\n| 价位 | 机型 | 新手定位 | 图片 | 来源 | 待核验字段 |\n|---|---|---|---|---|---|\n${recommendedRows.join("\n")}\n\n## 最高优先级：推荐卡片缺图\n\n${recommendedMissingImages.length ? recommendedMissingImages.map((title) => `- ${title}`).join("\n") : "- 当前推荐卡片均已有图片。"}\n\n## 内容异常雷达\n\n### 高风险字段冲突（${conflicts.length}）\n\n${conflicts.map((camera) => `- ${camera.title}：${camera.conflicts.join("；")}`).join("\n") || "- 无"}\n\n### 可从正文回填 Frontmatter（${refill.length}）\n\n${refill.map((camera) => `- ${camera.title}：${camera.refillHints.join("；")}`).join("\n") || "- 无"}\n\n### 正文仍含待补充（${placeholders.length}）\n\n${placeholders.map((camera) => `- ${camera.title}：${camera.placeholderCount} 处`).join("\n") || "- 无"}\n\n## 全量缺口\n\n### 缺少主图（${missingImage.length}）\n\n${missingImage.map((camera) => `- ${camera.title}`).join("\n") || "- 无"}\n\n### 已有图片但版权字段不完整（${incompleteImageMeta.length}）\n\n${incompleteImageMeta.map((camera) => `- ${camera.title}`).join("\n") || "- 无"}\n\n### 缺少资料来源（${missingSources.length}）\n\n${missingSources.map((camera) => `- ${camera.title}`).join("\n") || "- 无"}\n\n### 含待核验关键字段（${pending.length}）\n\n${pending.map((camera) => `- ${camera.title}：${camera.pendingFields.join("、")}`).join("\n") || "- 无"}\n`

fs.writeFileSync(reportFile, report, "utf8")
console.log(`机型内容审计完成：${cameras.length} 台，缺图 ${missingImage.length} 台，缺来源 ${missingSources.length} 台，待核验 ${pending.length} 台，冲突 ${conflicts.length} 台。`)

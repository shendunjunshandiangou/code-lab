import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"

const root = path.resolve(import.meta.dirname, "..")
const repoRoot = path.resolve(root, "..")
const modelsDir = path.join(root, "02_atoms", "models")

const brandNames = {
  canon: "Canon",
  bronica: "Bronica",
  contax: "Contax",
  fuji: "Fujifilm",
  fujifilm: "Fujifilm",
  hasselblad: "Hasselblad",
  konica: "Konica",
  leica: "Leica",
  mamiya: "Mamiya",
  minolta: "Minolta",
  nikon: "Nikon",
  olympus: "Olympus",
  pentax: "Pentax",
  praktica: "Praktica",
  ricoh: "Ricoh",
  rollei: "Rollei",
  seagull: "Seagull",
  yashica: "Yashica",
  zenit: "Zenit",
  zhujiang: "珠江",
}

const typeNames = {
  "slr-mechanical": "机械单反",
  "slr-electronic": "电子单反",
  "slr-autofocus": "自动对焦单反",
  rangefinder: "旁轴相机",
  ps: "便携自动相机",
  compact: "便携相机",
  medium: "中画幅相机",
  "medium-format": "中画幅相机",
  "half-frame": "半格相机",
  tlr: "双镜头反光相机",
  instant: "即时成像相机",
  disposable: "一次性相机",
}

const skillNames = {
  zero: "推荐",
  easy: "推荐",
  moderate: "有一定门槛",
  advanced: "进阶",
  expert: "进阶",
}

function section(body, name) {
  const chunks = body.split(/^## /m)
  const chunk = chunks.find((value) => value.startsWith(`${name}\n`))
  return chunk ? chunk.slice(name.length + 1).trim() : ""
}

function firstText(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("|"))
    ?.replace(/^[-*>]+\s*/, "") ?? "待补充"
}

function plain(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/^[-*>]+\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim()
}

function frontmatterValue(frontmatter, key) {
  return frontmatter.match(new RegExp(`^${key}:\\s*(.*)$`, "m"))?.[1]?.trim() ?? ""
}

function frontmatterList(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*\\n((?:  - .*\\n?)*)`, "m"))
  return match
    ? match[1]
        .split("\n")
        .map((line) => line.replace(/^\s*-\s*/, "").replace(/^['"]|['"]$/g, "").trim())
        .filter(Boolean)
    : []
}

function tableValues(markdown) {
  const values = {}
  for (const line of markdown.split("\n")) {
    const cells = line.split("|").map((cell) => cell.trim())
    if (cells.length >= 4 && cells[1] && cells[2] && !/^[-:]+$/.test(cells[1])) {
      values[cells[1]] = cells[2]
    }
  }
  return values
}

function yamlString(value) {
  return JSON.stringify(value ?? "")
}

function yamlList(values) {
  if (!values.length) return "[]"
  return `\n${values.map((value) => `  - ${yamlString(value)}`).join("\n")}`
}

function parsePrice(priceText) {
  const normalized = priceText.replaceAll(",", "")
  const range = normalized.match(/(\d+)\s*[-–—~～至]\s*(\d+)\s*元/)
  if (range) return { min: range[1], max: range[2] }
  const plus = normalized.match(/(\d+)\s*\+\s*元|约\s*(\d+)\s*元/)
  if (plus) return { min: plus[1] ?? plus[2], max: "" }
  return { min: "", max: "" }
}

function normalizeFocus(value, oldType) {
  if (/自动/.test(value) || oldType.includes("autofocus") || oldType === "ps") return "自动对焦"
  if (/手动/.test(value)) return "手动对焦"
  if (/固定|免对焦|泛焦/.test(value)) return "固定焦点"
  return value || "待核验"
}

function normalizeFile(file) {
  if (file === "尼康 FE.md") return false

  const fullPath = path.join(modelsDir, file)
  const relativePath = path.relative(repoRoot, fullPath).split(path.sep).join("/")
  const original = execFileSync("git", ["show", `HEAD:${relativePath}`], {
    cwd: repoRoot,
    encoding: "utf8",
  })
  const match = original.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error(`${file}: 缺少 frontmatter`)

  const [, oldFrontmatter, body] = match
  if (/^entity:\s*camera$/m.test(oldFrontmatter)) return false
  const title = body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? file.replace(/\.md$/, "")
  const oldType = frontmatterValue(oldFrontmatter, "type")
  const oldBrand = frontmatterValue(oldFrontmatter, "brand")
  const oldSkill = frontmatterValue(oldFrontmatter, "skill")
  const aliases = frontmatterList(oldFrontmatter, "aliases")
  const basic = section(body, "基本参数") || section(body, "关键参数")
  const params = tableValues(basic)
  const positioning = firstText(section(body, "一句话定位"))
  const benefits = section(body, "优点") || section(body, "为什么值得买") || "- 待补充。"
  const cautions = section(body, "缺点") || section(body, "需要注意什么") || "- 待补充。"
  const suitable = section(body, "适合谁") || "- 待补充。"
  const unsuitable = section(body, "不适合谁") || "- 待补充。"
  const priceSection = section(body, "价格参考（2026）") || section(body, "价格参考")
  const priceText = firstText(priceSection)
  const price = parsePrice(priceText)
  const alternatives = [section(body, "替代选择"), section(body, "相关机型")]
    .filter(Boolean)
    .join("\n") || "- 暂未整理。"

  const cameraType = typeNames[oldType] ?? (oldType || "待核验")
  const focus = normalizeFocus(params["对焦方式"], oldType)
  const exposure = params["曝光模式"] ?? "待核验"
  const releaseYear = params["发布时间"]?.match(/\d{4}/)?.[0] ?? ""
  const tags = [...new Set([cameraType, focus, skillNames[oldSkill]].filter(Boolean))]

  const frontmatter = `---
title: ${yamlString(title)}
description: ${yamlString(`${title}的参数、优缺点、二手价格和购买建议。`)}
entity: camera
cssclasses:
  - camera-detail
brand: ${yamlString(brandNames[oldBrand] ?? (oldBrand || "待核验"))}
model: ${yamlString(title)}
camera_type: ${yamlString(cameraType)}
format: ${yamlString(frontmatterValue(oldFrontmatter, "format") || "待核验")}
focus: ${yamlString(focus)}
exposure_modes:${yamlList(exposure.split(/\s*[+、/]\s*/).filter(Boolean))}
mount: ${yamlString(params["卡口"] ?? (params["镜头"] ? "固定镜头" : "待核验"))}
shutter: ${yamlString(params["快门类型"] ?? "待核验")}
metering: ${yamlString(params["测光"] ?? params["测光方式"] ?? "待核验")}
battery: ${yamlString(params["电池"] ?? "待核验")}
release_year: ${releaseYear || "null"}
weight_g: null
price_min: ${price.min || "null"}
price_max: ${price.max || "null"}
price_currency: CNY
price_region: 中国大陆二手市场
price_checked_at: 2026-07
beginner_level: ${yamlString(skillNames[oldSkill] ?? "待核验")}
reliability: 待核验
recommended_scenes: []
hero_image: ""
image_alt: ${yamlString(`${title}胶片相机，图片待完成授权核验后补充`)}
image_credit: ""
image_source: ""
image_license: ""
tags:${yamlList(tags)}
aliases:${yamlList(aliases)}
sources: []
last_updated: 2026-07-12
---`

  const parameterTable = basic || `| 参数 | 信息 |
|---|---|
| 相机类型 | ${cameraType} |
| 画幅 | ${frontmatterValue(oldFrontmatter, "format") || "待核验"} |
| 对焦方式 | ${focus} |
| 曝光模式 | ${exposure} |`

  const next = `${frontmatter}

# ${title}

> ${positioning}

<div class="camera-image-placeholder" role="img" aria-label="${title}图片待补充">
  <strong>${title}</strong>
  <span>真实机型图片待完成授权核验后补充</span>
</div>

## 快速判断

<div class="camera-verdict-grid">
  <div><strong>适合</strong><span>${plain(suitable)}</span></div>
  <div><strong>不适合</strong><span>${plain(unsuitable)}</span></div>
  <div><strong>参考价格</strong><span>${plain(priceText)}；价格口径为 2026 年现有资料</span></div>
</div>

## 关键参数

${parameterTable.replace("| 参数 | 值 |", "| 参数 | 信息 |")}

## 为什么值得买

${benefits}

## 需要注意什么

${cautions}

## 适合谁

${suitable}

## 不适合谁

${unsuitable}

## 购买检查

1. 检查快门、测光、过片、回卷和计数器是否正常。
2. 检查取景器、镜头和机身内部是否存在霉、雾、划痕或腐蚀。
3. 检查电池仓是否漏液，电子功能是否稳定。
4. 检查后盖密封海绵和反光镜缓冲材料是否老化。
5. 优先选择能够提供实拍测试、维修记录或退换保障的卖家。

## 同价位替代

${alternatives}

## 图片与资料来源

- 图片：待完成授权核验后补充。
- 本页保留原有机型资料并统一为标准结构；缺失参数已标记为“待核验”。
- 二手价格会随地区、成色、镜头搭配和维修状态变化，当前区间不是成交保证。
`

  fs.writeFileSync(fullPath, next, "utf8")
  return true
}

const files = fs.readdirSync(modelsDir).filter((file) => file.endsWith(".md")).sort()
let changed = 0

for (const file of files) {
  if (normalizeFile(file)) changed += 1
}

console.log(`已统一 ${changed} 个机型文件；尼康 FE 保留已核验图片版本。`)

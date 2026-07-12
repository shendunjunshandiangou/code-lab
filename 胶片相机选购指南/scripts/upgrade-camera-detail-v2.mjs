import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const modelsDir = path.join(root, "02_atoms", "models")

const chineseBrands = new Map([
  ["尼康", "nikon"],
  ["佳能", "canon"],
  ["美能达", "minolta"],
  ["奥林巴斯", "olympus"],
  ["宾得", "pentax"],
  ["康泰时", "contax"],
  ["徕卡", "leica"],
  ["富士", "fujifilm"],
  ["理光", "ricoh"],
  ["雅西卡", "yashica"],
  ["玛米亚", "mamiya"],
  ["哈苏", "hasselblad"],
  ["柯达", "kodak"],
  ["柯尼卡", "konica"],
  ["禄来", "rollei"],
  ["福伦达", "voigtlander"],
  ["松下", "panasonic"],
  ["卡西欧", "casio"],
  ["珠江", "pearl-river"],
  ["海鸥", "seagull"],
  ["上海", "shanghai"],
  ["爱克发", "agfa"],
  ["宝丽来", "polaroid"],
])

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function unquote(value) {
  const text = String(value ?? "").trim()
  if (text.startsWith('"') && text.endsWith('"')) {
    try {
      return JSON.parse(text)
    } catch {
      return text.slice(1, -1)
    }
  }
  if (text.startsWith("'") && text.endsWith("'")) return text.slice(1, -1).replace(/''/g, "'")
  return text
}

function yamlScalar(frontmatter, key) {
  return unquote(frontmatter.match(new RegExp(`^${escapeRegExp(key)}:\\s*(.*)$`, "m"))?.[1] ?? "")
}

function yamlList(frontmatter, key) {
  const block = frontmatter.match(new RegExp(`^${escapeRegExp(key)}:\\s*\\n((?:[ \\t]+-.*(?:\\n|$))*)`, "m"))?.[1] ?? ""
  return block
    .split("\n")
    .map((line) => line.replace(/^\s*-\s*/, "").trim())
    .filter(Boolean)
    .map(unquote)
}

function upsertYamlScalar(frontmatter, key, value) {
  const line = `${key}: ${JSON.stringify(value)}`
  const pattern = new RegExp(`^${escapeRegExp(key)}:.*$`, "m")
  if (pattern.test(frontmatter)) return frontmatter.replace(pattern, line)
  return `${frontmatter.trimEnd()}\n${line}`
}

function extractTagline(body) {
  const lines = body.split("\n")
  const collected = []
  let started = false

  for (const line of lines) {
    if (/^>\s?/.test(line)) {
      started = true
      collected.push(line.replace(/^>\s?/, "").trim())
      continue
    }
    if (started) break
    if (line.trim()) break
  }

  return collected.join(" ").trim()
}

function cleanTagline(value) {
  return String(value ?? "").trim().replace(/\\+(?=["*])/g, "")
}

function asciiSlug(value) {
  const tokens = String(value ?? "")
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .replace(/&/g, " and ")
    .match(/[A-Za-z0-9]+/g)
  return tokens?.join("-").toLowerCase() ?? ""
}

function detectedChineseBrand(...values) {
  const text = values.join(" ")
  for (const [label, slug] of chineseBrands) {
    if (text.includes(label)) return slug
  }
  return ""
}

function withoutBrandPrefix(value, brand) {
  if (!value) return ""
  if (value === brand) return ""
  return value.startsWith(`${brand}-`) ? value.slice(brand.length + 1) : value
}

function shortHash(value) {
  return crypto.createHash("sha1").update(value).digest("hex").slice(0, 7)
}

function parseCamera(file) {
  const fullPath = path.join(modelsDir, file)
  const original = fs.readFileSync(fullPath, "utf8")
  const match = original.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error(`${file}: 缺少 frontmatter`)

  const [, frontmatter, body] = match
  if (yamlScalar(frontmatter, "entity") !== "camera") return null
  return { file, fullPath, original, frontmatter, body }
}

function publicRoute(camera, usedRoutes) {
  const { file, frontmatter } = camera
  const existing = yamlScalar(frontmatter, "permalink").replace(/^\/+|\/+$/g, "")
  if (existing.startsWith("cameras/")) {
    if (!usedRoutes.has(existing)) {
      usedRoutes.set(existing, file)
      return existing
    }
  }

  const title = yamlScalar(frontmatter, "title") || path.basename(file, ".md")
  const brandRaw = yamlScalar(frontmatter, "brand")
  const modelRaw = yamlScalar(frontmatter, "model")
  const aliases = yamlList(frontmatter, "aliases")
  const brand = asciiSlug(brandRaw) || detectedChineseBrand(title, modelRaw, file) || "camera"

  const candidates = [modelRaw, ...aliases, title, path.basename(file, ".md")]
  let model = ""
  for (const candidate of candidates) {
    const normalized = withoutBrandPrefix(asciiSlug(candidate), brand)
    if (normalized && normalized !== "camera") {
      model = normalized
      break
    }
  }
  if (!model) model = `model-${shortHash(file)}`

  let route = `cameras/${brand}-${model}`.replace(/-+/g, "-")
  if (usedRoutes.has(route)) {
    const year = yamlScalar(frontmatter, "release_year")
    route = `${route}-${asciiSlug(year) || shortHash(file)}`
  }
  if (usedRoutes.has(route)) route = `${route}-${shortHash(file)}`

  usedRoutes.set(route, file)
  return route
}

function upgradeFile(camera, permalink) {
  const { fullPath, original } = camera
  let { frontmatter, body } = camera

  const existingTagline = yamlScalar(frontmatter, "tagline")
  const description = yamlScalar(frontmatter, "description")
  const tagline = cleanTagline(extractTagline(body) || existingTagline || description)

  frontmatter = upsertYamlScalar(frontmatter, "detail_version", 2)
  frontmatter = upsertYamlScalar(frontmatter, "permalink", permalink)
  if (tagline) frontmatter = upsertYamlScalar(frontmatter, "tagline", tagline)
  frontmatter = upsertYamlScalar(frontmatter, "last_updated", "2026-07-12")

  body = body.replace(/^\s*(?:>\s?.*(?:\n|$))+\s*/m, "")
  body = body.replace(/\n?<figure class="camera-hero">[\s\S]*?<\/figure>\s*/m, "\n")
  body = body.replace(/\n?<div class="camera-image-placeholder[^"]*"[\s\S]*?<\/div>\s*/m, "\n")

  const next = `---\n${frontmatter}\n---\n\n${body.trim()}\n`
  if (next === original) return false
  fs.writeFileSync(fullPath, next, "utf8")
  return true
}

const files = fs.readdirSync(modelsDir).filter((file) => file.endsWith(".md")).sort()
const cameras = files.map(parseCamera).filter(Boolean)
const usedRoutes = new Map()
let changed = 0

for (const camera of cameras) {
  const permalink = publicRoute(camera, usedRoutes)
  if (upgradeFile(camera, permalink)) changed += 1
}

console.log(`全量详情页与公开路由完成：识别 ${cameras.length} 台机型，本次更新 ${changed} 个文件，生成 ${usedRoutes.size} 个 /cameras/ 路由。`)

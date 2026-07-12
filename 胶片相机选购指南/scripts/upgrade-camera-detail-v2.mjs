import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const modelsDir = path.join(root, "02_atoms", "models")

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
  // 清理旧脚本多次运行后堆叠在引号和星号前的反斜杠。
  return String(value ?? "").trim().replace(/\\+(?=["*])/g, "")
}

function upgradeFile(file) {
  const fullPath = path.join(modelsDir, file)
  const original = fs.readFileSync(fullPath, "utf8")
  const match = original.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error(`${file}: 缺少 frontmatter`)

  let [, frontmatter, body] = match
  if (yamlScalar(frontmatter, "entity") !== "camera") return { changed: false, camera: false }

  const existingTagline = yamlScalar(frontmatter, "tagline")
  const description = yamlScalar(frontmatter, "description")
  const tagline = cleanTagline(extractTagline(body) || existingTagline || description)

  frontmatter = upsertYamlScalar(frontmatter, "detail_version", 2)
  if (tagline) frontmatter = upsertYamlScalar(frontmatter, "tagline", tagline)
  frontmatter = upsertYamlScalar(frontmatter, "last_updated", "2026-07-12")

  // 一句话定位只在 PageHero 展示；正文直接进入购买判断。
  body = body.replace(/^\s*(?:>\s?.*(?:\n|$))+\s*/m, "")
  // PageHero 已经展示真实主图或统一占位，正文中不再重复。
  body = body.replace(/\n?<figure class="camera-hero">[\s\S]*?<\/figure>\s*/m, "\n")
  body = body.replace(/\n?<div class="camera-image-placeholder[^\"]*"[\s\S]*?<\/div>\s*/m, "\n")

  const next = `---\n${frontmatter}\n---\n\n${body.trim()}\n`
  if (next === original) return { changed: false, camera: true }
  fs.writeFileSync(fullPath, next, "utf8")
  return { changed: true, camera: true }
}

// 机型目录中的所有 camera 实体都使用同一套详情页 v2 结构；脚本必须可重复运行且不产生额外改动。
const files = fs.readdirSync(modelsDir).filter((file) => file.endsWith(".md")).sort()
let cameras = 0
let changed = 0

for (const file of files) {
  const result = upgradeFile(file)
  if (result.camera) cameras += 1
  if (result.changed) changed += 1
}

console.log(`全量详情页 v2 升级完成：识别 ${cameras} 台机型，本次更新 ${changed} 个文件。`)

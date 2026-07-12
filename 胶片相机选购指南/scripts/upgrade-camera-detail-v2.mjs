import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const modelsDir = path.join(root, "02_atoms", "models")

const detailV2Files = new Set([
  "尼康 FE.md",
  "尼康 FM2.md",
  "尼康 F2.md",
  "尼康 F3.md",
  "尼康 FE2.md",
  "尼康 FG.md",
  "尼康 F-601.md",
  "宾得 K1000.md",
  "宾得 MX.md",
])

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
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

function upgradeFile(file) {
  const fullPath = path.join(modelsDir, file)
  const original = fs.readFileSync(fullPath, "utf8")
  const match = original.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error(`${file}: 缺少 frontmatter`)

  let [, frontmatter, body] = match
  const tagline = extractTagline(body)

  frontmatter = upsertYamlScalar(frontmatter, "detail_version", 2)
  if (tagline) frontmatter = upsertYamlScalar(frontmatter, "tagline", tagline)
  frontmatter = upsertYamlScalar(frontmatter, "last_updated", "2026-07-12")

  // PageHero 已经展示主图和版权说明，正文中不再重复同一张图片。
  body = body.replace(/\n?<figure class="camera-hero">[\s\S]*?<\/figure>\s*/m, "\n")

  const next = `---\n${frontmatter}\n---\n\n${body.trim()}\n`
  if (next === original) return false
  fs.writeFileSync(fullPath, next, "utf8")
  return true
}

let changed = 0
for (const file of detailV2Files) {
  if (!fs.existsSync(path.join(modelsDir, file))) throw new Error(`找不到机型文件：${file}`)
  if (upgradeFile(file)) changed += 1
}

console.log(`首批详情页升级完成：${changed} 个文件发生更新，目标共 ${detailV2Files.size} 个。`)

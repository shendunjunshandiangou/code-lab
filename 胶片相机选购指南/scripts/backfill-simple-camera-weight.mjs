import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const modelsDir = path.join(root, "02_atoms", "models")

function tableValue(body, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return body.match(new RegExp(`^\\|\\s*${escaped}\\s*\\|\\s*(.*?)\\s*\\|$`, "m"))?.[1]?.trim() ?? ""
}

function safeWeight(value) {
  const normalized = value.replace(/，/g, ",").trim()
  // 只接受“约 270g”或“270 g”这种单一机身重量。
  // 套机重量、多版本重量、区间、括号说明和多个数字会被排除。
  const match = normalized.match(/^约?\s*(\d{2,4})\s*g$/i)
  if (!match) return null
  const weight = Number(match[1])
  return weight >= 100 && weight <= 5000 ? weight : null
}

function updateFile(file) {
  const fullPath = path.join(modelsDir, file)
  const original = fs.readFileSync(fullPath, "utf8")
  const match = original.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return null

  let [, frontmatter, body] = match
  if (!/^entity:\s*["']?camera["']?\s*$/m.test(frontmatter)) return null

  const current = frontmatter.match(/^weight_g:\s*(.*)$/m)?.[1]?.trim() ?? ""
  if (current && current !== "null" && !/待核验/.test(current)) return null

  const bodyWeight = tableValue(body, "重量")
  const weight = safeWeight(bodyWeight)
  if (weight === null) return null

  if (/^weight_g:/m.test(frontmatter)) {
    frontmatter = frontmatter.replace(/^weight_g:.*$/m, `weight_g: ${weight}`)
  } else {
    frontmatter = `${frontmatter.trimEnd()}\nweight_g: ${weight}`
  }

  const next = `---\n${frontmatter}\n---\n${body}`
  if (next === original) return null
  fs.writeFileSync(fullPath, next, "utf8")
  return { file, weight }
}

const updated = []
for (const file of fs.readdirSync(modelsDir).filter((name) => name.endsWith(".md")).sort()) {
  const result = updateFile(file)
  if (result) updated.push(result)
}

if (updated.length === 0) {
  console.log("没有发现可安全回填的单一机身重量。")
} else {
  console.log(`已安全回填 ${updated.length} 台机型的 weight_g：`)
  for (const item of updated) console.log(`- ${item.file}: ${item.weight}g`)
}

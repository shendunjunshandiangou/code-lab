import fs from "node:fs"
import path from "node:path"

export function parseCsv(text) {
  const source = String(text ?? "").replace(/^\uFEFF/, "")
  const rows = []
  let row = []
  let cell = ""
  let quoted = false

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]
    const next = source[index + 1]

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"'
        index += 1
      } else if (char === '"') {
        quoted = false
      } else {
        cell += char
      }
      continue
    }

    if (char === '"') {
      quoted = true
    } else if (char === ",") {
      row.push(cell)
      cell = ""
    } else if (char === "\n") {
      row.push(cell.replace(/\r$/, ""))
      if (row.some((value) => value.trim() !== "")) rows.push(row)
      row = []
      cell = ""
    } else {
      cell += char
    }
  }

  row.push(cell.replace(/\r$/, ""))
  if (row.some((value) => value.trim() !== "")) rows.push(row)
  if (quoted) throw new Error("CSV 存在未闭合的双引号")
  return rows
}

export function csvObjects(text) {
  const rows = parseCsv(text)
  if (rows.length === 0) return []
  const headers = rows[0].map((value) => value.trim())
  return rows.slice(1).map((row, rowIndex) => {
    const item = { __row: rowIndex + 2 }
    headers.forEach((header, index) => {
      item[header] = String(row[index] ?? "").trim()
    })
    return item
  })
}

export function escapeCsv(value) {
  const text = String(value ?? "")
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

export function writeCsv(file, headers, rows) {
  const lines = [headers.map(escapeCsv).join(",")]
  for (const row of rows) lines.push(headers.map((header) => escapeCsv(row[header])).join(","))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `\uFEFF${lines.join("\n")}\n`, "utf8")
}

export function scalar(frontmatter, key) {
  const raw = frontmatter.match(new RegExp(`^${key}:\\s*(.*)$`, "m"))?.[1]?.trim() ?? ""
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) return raw.slice(1, -1)
  return raw
}

export function yamlScalar(value) {
  if (value === null || value === undefined || value === "") return "null"
  if (typeof value === "number" && Number.isFinite(value)) return String(value)
  return JSON.stringify(String(value))
}

export function upsertScalar(frontmatter, key, value) {
  const line = `${key}: ${yamlScalar(value)}`
  const pattern = new RegExp(`^${key}:.*$`, "m")
  return pattern.test(frontmatter) ? frontmatter.replace(pattern, line) : `${frontmatter.trimEnd()}\n${line}`
}

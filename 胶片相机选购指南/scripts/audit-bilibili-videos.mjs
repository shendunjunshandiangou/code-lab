import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const modelDir = path.join(root, "02_atoms", "models")
const videosFile = path.join(root, "videos.md")

function normalize(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "")
}

function collectModelVideos() {
  return fs.readdirSync(modelDir)
    .filter((file) => file.endsWith(".md"))
    .flatMap((file) => {
      const content = fs.readFileSync(path.join(modelDir, file), "utf8")
      const sourceLine = content.match(/^source_videos:\s*(\[[^\n]*\])/m)?.[1]
      if (!sourceLine) return []
      return JSON.parse(sourceLine).map((video) => ({ ...video, source: `02_atoms/models/${file}` }))
    })
}

function collectFeaturedVideos() {
  const content = fs.readFileSync(videosFile, "utf8")
  const block = content.match(/^featured_videos:\n([\s\S]*?)^last_updated:/m)?.[1] ?? ""
  return block.split(/(?=^  - bvid:)/m).flatMap((item) => {
    const bvid = item.match(/^  - bvid:\s*(\S+)/m)?.[1]
    const title = item.match(/^    title:\s*(.+)$/m)?.[1]
    const creator = item.match(/^    creator:\s*(.+)$/m)?.[1]
    return bvid && title && creator ? [{ bvid, title, creator, source: "videos.md" }] : []
  })
}

const entries = [...collectModelVideos(), ...collectFeaturedVideos()]
const grouped = new Map()
for (const entry of entries) {
  if (!entry.bvid) continue
  const current = grouped.get(entry.bvid) ?? []
  current.push(entry)
  grouped.set(entry.bvid, current)
}

const failures = []
const checks = []

for (const [bvid, uses] of grouped) {
  let payload
  try {
    const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${encodeURIComponent(bvid)}`, {
      headers: { accept: "application/json", "user-agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(15000),
    })
    payload = await response.json()
  } catch (error) {
    failures.push(`${bvid} 核验请求失败：${String(error)}`)
    continue
  }

  if (payload.code !== 0 || !payload.data) {
    failures.push(`${bvid} 不可播放：${payload.message ?? `code ${payload.code}`}`)
    continue
  }

  const actualTitle = payload.data.title ?? ""
  const actualCreator = payload.data.owner?.name ?? ""
  const mismatches = uses.filter((use) => {
    const expectedTitle = normalize(use.title)
    const realTitle = normalize(actualTitle)
    const titleMatches = expectedTitle.includes(realTitle) || realTitle.includes(expectedTitle)
    return !titleMatches || normalize(use.creator) !== normalize(actualCreator)
  })

  if (mismatches.length > 0) {
    failures.push(
      `${bvid} 元数据错配：B 站实际为《${actualTitle}》 / ${actualCreator}；影响 ${mismatches.map((item) => item.source).join("、")}`,
    )
  } else {
    checks.push(`${bvid} 《${actualTitle}》 / ${actualCreator} / ${uses.length} 处引用`)
  }

  await new Promise((resolve) => setTimeout(resolve, 500))
}

console.log(`B 站视频核验：${grouped.size} 个唯一 BV 号，${entries.length} 处页面引用。`)
for (const check of checks) console.log(`- 通过：${check}`)

if (failures.length > 0) {
  console.error(`\n发现 ${failures.length} 个问题：`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log("所有展示中的 B 站视频均可见，且标题、UP 主与页面数据一致。")

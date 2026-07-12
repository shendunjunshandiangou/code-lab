import { createHash } from "node:crypto"
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(SCRIPT_DIR, "..")
const STATIC_DIR = path.join(ROOT, "quartz", "quartz", "static", "images", "library")
const SOURCE_EXTENSIONS = new Set([".md", ".tsx"])
const EXCLUDED_DIRS = new Set([".git", "node_modules", "public", "static"])
const WIKIMEDIA_IMAGE_RE = /https:\/\/commons\.wikimedia\.org\/wiki\/Special:Redirect\/file\/[^\s"'<>]+/g

function canonicalRemote(url) {
  const parsed = new URL(url)
  parsed.search = ""
  return parsed.toString()
}

function safeFilename(remote) {
  const parsed = new URL(remote)
  const raw = decodeURIComponent(parsed.pathname.split("/").pop() ?? "image.jpg")
  const extension = path.extname(raw).toLowerCase() || ".jpg"
  const stem = path
    .basename(raw, extension)
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 72) || "image"
  const hash = createHash("sha1").update(remote).digest("hex").slice(0, 8)
  return `${stem}-${hash}${extension === ".jpeg" ? ".jpg" : extension}`
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (EXCLUDED_DIRS.has(entry.name)) continue
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(target))
    else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) files.push(target)
  }
  return files
}

function localAssetPath(filename) {
  return `./static/images/library/${filename}`
}

function relativeAssetPath(file, filename) {
  const relative = path.relative(ROOT, file).replaceAll(path.sep, "/")
  const slug = relative.replace(/\.md$/, "")
  const depth = Math.max(0, slug.split("/").length - 1)
  return `${depth === 0 ? "./" : "../".repeat(depth)}static/images/library/${filename}`
}

function replaceMarkdown(content, file, mappings) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/)
  let frontmatterEnd = 0
  let updated = content

  if (frontmatterMatch) {
    frontmatterEnd = frontmatterMatch[0].length
    let frontmatter = frontmatterMatch[0]
    for (const [remote, filename] of mappings) {
      const variants = [...frontmatter.matchAll(WIKIMEDIA_IMAGE_RE)].map((match) => match[0])
      for (const variant of variants) {
        if (canonicalRemote(variant) !== remote) continue
        frontmatter = frontmatter.replaceAll(variant, localAssetPath(filename))
      }
    }
    updated = frontmatter + content.slice(frontmatterEnd)
  }

  const head = updated.slice(0, frontmatterEnd)
  let body = updated.slice(frontmatterEnd)
  for (const [remote, filename] of mappings) {
    const variants = [...body.matchAll(WIKIMEDIA_IMAGE_RE)].map((match) => match[0])
    for (const variant of variants) {
      if (canonicalRemote(variant) !== remote) continue
      body = body.replaceAll(variant, relativeAssetPath(file, filename))
    }
  }
  return head + body
}

function replaceTsx(content, mappings) {
  let updated = content
  for (const [remote, filename] of mappings) {
    const variants = [...updated.matchAll(WIKIMEDIA_IMAGE_RE)].map((match) => match[0])
    for (const variant of variants) {
      if (canonicalRemote(variant) !== remote) continue
      updated = updated.replaceAll(variant, `./static/images/library/${filename}`)
    }
  }
  return updated
}

async function download(remote, filename) {
  const target = path.join(STATIC_DIR, filename)
  try {
    const info = await stat(target)
    if (info.size > 0) return false
  } catch {
    // 文件尚不存在，继续下载。
  }

  const downloadUrl = `${remote}?width=1800`
  const response = await fetch(downloadUrl, {
    redirect: "follow",
    headers: {
      "user-agent": "film-camera-guide-image-cache/1.0 (https://github.com/shendunjunshandiangou/code-lab)",
      accept: "image/avif,image/webp,image/png,image/jpeg,*/*",
    },
  })
  if (!response.ok) throw new Error(`下载失败 ${response.status}: ${downloadUrl}`)

  const bytes = Buffer.from(await response.arrayBuffer())
  if (bytes.length < 1024) throw new Error(`下载结果过小，可能不是有效图片: ${downloadUrl}`)
  await writeFile(target, bytes)
  console.log(`已缓存 ${remote} -> ${path.relative(ROOT, target)}`)
  return true
}

async function main() {
  await mkdir(STATIC_DIR, { recursive: true })
  const files = await walk(ROOT)
  const contents = new Map()
  const remotes = new Set()

  for (const file of files) {
    const content = await readFile(file, "utf8")
    contents.set(file, content)
    for (const match of content.matchAll(WIKIMEDIA_IMAGE_RE)) remotes.add(canonicalRemote(match[0]))
  }

  const mappings = new Map([...remotes].sort().map((remote) => [remote, safeFilename(remote)]))
  let downloaded = 0
  for (const [remote, filename] of mappings) {
    if (await download(remote, filename)) downloaded += 1
    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  let changed = 0
  for (const [file, content] of contents) {
    const updated = path.extname(file) === ".md"
      ? replaceMarkdown(content, file, mappings)
      : replaceTsx(content, mappings)
    if (updated === content) continue
    await writeFile(file, updated, "utf8")
    changed += 1
  }

  console.log(`图片本地化完成：发现 ${mappings.size} 张，新增下载 ${downloaded} 张，更新 ${changed} 个内容文件。`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

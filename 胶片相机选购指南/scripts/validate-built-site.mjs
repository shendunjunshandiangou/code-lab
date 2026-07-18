import fs from "node:fs"
import path from "node:path"

const publicDir = path.resolve(process.argv[2] ?? path.join(import.meta.dirname, "..", "quartz", "public"))
const errors = []
const checks = []

function fail(message) {
  errors.push(message)
}

function pass(message) {
  checks.push(message)
}

function read(relativePath) {
  const file = path.join(publicDir, relativePath)
  if (!fs.existsSync(file)) {
    fail(`缺少构建文件：${relativePath}`)
    return ""
  }
  return fs.readFileSync(file, "utf8")
}

function requireText(html, pattern, label) {
  if (!pattern.test(html)) fail(label)
}

function walkFiles(directory, suffix) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return walkFiles(fullPath, suffix)
    return entry.isFile() && entry.name.endsWith(suffix) ? [fullPath] : []
  })
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
}

function publicUrlForHtml(relativePath) {
  const withoutExtension = relativePath === "index.html" ? "" : relativePath.replace(/\.html$/, "")
  return `https://shendunjunshandiangou.github.io/code-lab/${withoutExtension}`
}

function targetFileForUrl(url) {
  const basePath = "/code-lab"
  if (url.origin !== "https://shendunjunshandiangou.github.io") return null
  if (url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) return false

  let relativePath
  try {
    relativePath = decodeURIComponent(url.pathname.slice(basePath.length)).replace(/^\/+/, "")
  } catch {
    return false
  }

  const candidates = relativePath === ""
    ? ["index.html"]
    : relativePath.endsWith("/")
      ? [`${relativePath}index.html`]
      : [relativePath, `${relativePath}.html`, `${relativePath}/index.html`]

  return candidates.find((candidate) => fs.existsSync(path.join(publicDir, candidate))) ?? false
}

function pageAnchorIds(html) {
  return new Set(
    [...html.matchAll(/\s(?:id|name)=(?:"([^"]+)"|'([^']+)')/gi)]
      .map((match) => decodeHtml(match[1] ?? match[2])),
  )
}

function isRedirectPage(html) {
  return /http-equiv=["']refresh["']/i.test(html) || /window\.location\.(?:replace|href)/.test(html)
}

function normalizeRoutePath(pathname) {
  let decoded = pathname
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    // 保留原始路径，后续仍可比较。
  }
  return decoded
    .replace(/\.html$/, "")
    .replace(/\/index$/, "/")
    .replace(/\/$/, "")
}

function visibleMainText(html) {
  const main = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1]
    ?? html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]
    ?? ""
  return decodeHtml(
    main
      .replace(/<(?:script|style|svg|template)\b[\s\S]*?<\/(?:script|style|svg|template)>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  ).replace(/\s+/g, " ").trim()
}

const corePages = [
  "index.html",
  "learn.html",
  "encyclopedia.html",
  "buying.html",
  "cameras.html",
  "film.html",
  "videos.html",
  "about.html",
]

for (const page of corePages) {
  const html = read(page)
  if (!html) continue
  requireText(html, /<title>[^<]+<\/title>/, `${page} 缺少页面标题`)
  requireText(html, /<meta name="description" content="[^"]+"/, `${page} 缺少 meta description`)
  requireText(html, /<link rel="canonical" href="https:\/\/shendunjunshandiangou\.github\.io\/code-lab/, `${page} 缺少正式 canonical`)
}
pass(`核心入口页面检查：${corePages.length} 个`)

const home = read("index.html")
if (home) {
  requireText(home, /class="featured-video-grid home-featured-video-grid" data-video-count="3"/, "首页没有展示 3 条精选视频")
  requireText(home, /id="featured-video-layout-inline"/, "首页视频网格缺少防缓存关键布局样式")
  if ((home.match(/class="bilibili-play"/g) ?? []).length < 3) fail("首页可播放视频少于 3 条")
  requireText(home, /data-bvid="BV1LF4m1M7ca"/, "首页缺少已核验新手选购视频")
  if ((home.match(/class="finder-card-image has-image"/g) ?? []).length !== 6) fail("首页快速选机卡片没有全部显示图片")
  if (home.includes('class="finder-card-image is-placeholder"')) fail("首页快速选机仍包含缺图占位卡")
  requireText(home, /static\/images\/library\/olympus-mju-i\.jpg/, "首页缺少奥林巴斯 mju-1 图片")
  requireText(home, /static\/images\/library\/canon-ae-1-with-50mm-f1-8-s-c-ii-cb3614c9\.jpg/, "首页缺少佳能 AE-1 图片")
  requireText(home, /static\/images\/library\/olympus-om-1-6c0b68be\.jpg/, "首页缺少奥林巴斯 OM-1 图片")
}
pass("首页精选视频、快速选机图片与数据检查")

const videos = read("videos.html")
if (videos) {
  requireText(videos, /class="featured-video-grid videos-library-grid" data-video-count="6"/, "视频精选页没有展示 6 条已核验视频")
  requireText(videos, /class="portal-rich-page videos-page"/, "视频精选页没有使用全宽专题页外壳")
  requireText(videos, /portal-rich-page\.videos-page\{width:100%;max-width:none;margin:0;padding:0\}/, "视频精选页缺少防缓存全宽布局规则")
  if ((videos.match(/class="bilibili-play"/g) ?? []).length !== 6) fail("视频精选页可播放视频不是 6 条")
  if ((videos.match(/B 站打开原视频/g) ?? []).length !== 6) fail("视频精选页原视频链接不是 6 条")
  requireText(videos, /data-bvid="BV1qqwLzcE81"/, "视频精选页缺少已核验平价机型视频")
  for (const invalidBvid of ["BV1HL411h7JW", "BV1Uj411Z7E9", "BV1k7411q7YL", "BV1o4411c7A5"]) {
    if (videos.includes(invalidBvid)) fail(`视频精选页仍包含已失效或错配 BV 号：${invalidBvid}`)
  }
}
pass("视频精选页数量、播放按钮与原链接检查")

const encyclopedia = read("encyclopedia.html")
if (encyclopedia) {
  requireText(encyclopedia, /class="knowledge-hub"/, "相机百科没有使用正式聚合页组件")
  if ((encyclopedia.match(/<h1\b/g) ?? []).length !== 1) fail("相机百科页面存在重复一级标题")
  requireText(encyclopedia, /覆盖 68 个基础知识点/, "相机百科缺少知识库范围说明")
  if ((encyclopedia.match(/class="knowledge-card"/g) ?? []).length !== 9) fail("相机百科专题卡片不是 9 张")
  requireText(encyclopedia, /04_knowledge\/知识百科\/01-相机类型详解/, "相机百科缺少相机类型入口")
  requireText(encyclopedia, /04_knowledge\/知识百科\/09-继续学习/, "相机百科缺少继续学习入口")
}
pass("相机百科聚合入口、专题数量与首尾链接检查")

const buying = read("buying.html")
if (buying) {
  requireText(buying, /class="buying-guide-page"/, "价格选机页没有使用新版组件")
  requireText(buying, /id="buying-guide-inline-styles"/, "价格选机页缺少随 HTML 输出的关键布局样式")
  requireText(buying, /grid-template-columns:\s*repeat\(4/, "价格选机页缺少桌面四列网格规则")
  requireText(buying, /@media\s*\(max-width:\s*760px\)/, "价格选机页缺少手机端响应式规则")
  requireText(buying, /class="buying-product-grid"/, "价格选机页没有商品网格")
  if ((buying.match(/class="buying-product-card"/g) ?? []).length < 8) fail("价格选机页推荐卡片少于 8 张")
  if (buying.includes("图片待完成授权核验")) fail("价格选机页仍混入缺图占位卡片")
}
pass("价格选机页网格、缓存兜底和图片完成度检查")

const detailDir = path.join(publicDir, "cameras")
const detailFiles = fs.existsSync(detailDir)
  ? fs.readdirSync(detailDir).filter((file) => file.endsWith(".html"))
  : []
if (detailFiles.length < 83) fail(`干净机型路由不足 83 个，当前 ${detailFiles.length} 个`)
else pass(`干净机型路由：${detailFiles.length} 个`)

const aliasDir = path.join(publicDir, "02_atoms", "models")
const aliasFiles = fs.existsSync(aliasDir)
  ? fs.readdirSync(aliasDir).filter((file) => file.endsWith(".html"))
  : []
if (aliasFiles.length < 83) fail(`旧机型兼容地址不足 83 个，当前 ${aliasFiles.length} 个`)
else pass(`旧地址兼容页：${aliasFiles.length} 个`)

const keyCameraPages = [
  "cameras/nikon-fm2.html",
  "cameras/nikon-fe.html",
  "cameras/canon-ae-1.html",
  "cameras/olympus-om-10.html",
  "cameras/pentax-me.html",
  "cameras/olympus-om-2.html",
  "cameras/olympus-om-2n.html",
  "cameras/olympus-xa.html",
]

for (const page of keyCameraPages) {
  const html = read(page)
  if (!html) continue
  requireText(html, /camera-detail-guide/, `${page} 未启用详情页 v2`)
  requireText(html, /<link rel="canonical" href="[^"]*\/cameras\//, `${page} canonical 未指向干净路由`)
  requireText(html, /"@type":"Product"/, `${page} 缺少 Product 结构化数据`)
  requireText(html, /"@type":"BreadcrumbList"/, `${page} 缺少 BreadcrumbList 结构化数据`)
  if (/src="https:\/\/commons\.wikimedia\.org/.test(html)) fail(`${page} 仍直接加载 Wikimedia 图片`)
}
pass(`代表机型详情、canonical 与结构化数据检查：${keyCameraPages.length} 个`)

const oldFm2 = read("02_atoms/models/尼康-FM2.html")
if (oldFm2 && !oldFm2.includes("cameras/nikon-fm2")) fail("尼康 FM2 旧地址没有跳转到新路由")
else pass("旧机型地址重定向检查")

const pearlRiver = read("cameras/pearl-river-s-201.html")
if (pearlRiver) {
  requireText(pearlRiver, /class="source-video-grid is-single" data-video-count="1"/, "单条来源视频没有使用单卡布局")
  requireText(pearlRiver, /id="source-video-layout-inline"/, "来源视频缺少防缓存关键布局样式")
  requireText(pearlRiver, /class="bilibili-card"/, "珠江 S-201 详情页缺少来源视频卡片")
}
pass("单条来源视频桌面布局契约检查")

const pagesToCheckImages = [...corePages, ...keyCameraPages]
const localImagePattern = /src="([^"]*static\/images\/library\/[^"?#]+)[^\"]*"/g
for (const page of pagesToCheckImages) {
  const html = read(page)
  if (!html) continue
  for (const match of html.matchAll(localImagePattern)) {
    const filename = decodeURIComponent(match[1].split("/").pop())
    const localFile = path.join(publicDir, "static", "images", "library", filename)
    if (!fs.existsSync(localFile)) fail(`${page} 引用的本地图片不存在：${filename}`)
  }
}
pass("核心页面本地图片文件存在性检查")

const htmlFiles = walkFiles(publicDir, ".html")
const blockedBvids = ["BV1HL411h7JW", "BV1Uj411Z7E9", "BV1k7411q7YL", "BV1o4411c7A5"]
const blockedBvidHits = []
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8")
  const relativePath = path.relative(publicDir, file)
  for (const bvid of blockedBvids) {
    if (html.includes(bvid)) blockedBvidHits.push(`${relativePath} 仍包含 ${bvid}`)
  }
}
if (blockedBvidHits.length > 0) {
  fail(`全站仍包含已失效或错配的 B 站视频：\n${blockedBvidHits.map((item) => `- ${item}`).join("\n")}`)
} else {
  pass("全站不含已失效或错配的 B 站视频")
}

const invalidPriceDisplays = []
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8")
  const relativePath = path.relative(publicDir, file)
  if (/¥[\d,]+(?:～|~|—|–)0\b/.test(html)) invalidPriceDisplays.push(`${relativePath} 显示价格上限为 0`)
  if (/"(?:lowPrice|highPrice|price)":0\b/.test(html)) invalidPriceDisplays.push(`${relativePath} 的结构化价格包含 0`)
}
if (invalidPriceDisplays.length > 0) fail(`价格显示检查发现 ${invalidPriceDisplays.length} 个问题：\n${invalidPriceDisplays.map((item) => `- ${item}`).join("\n")}`)
else pass("全站价格显示与结构化数据不含 0 元价格")

const linkedHtmlFiles = new Set()
const linkIssues = new Map()
const visitedHtmlFiles = new Set()
const pendingHtmlFiles = [...corePages]
let internalLinkCount = 0

function recordLinkIssue(message, sourcePage, href) {
  const key = `${message}\n${sourcePage}\n${href}`
  linkIssues.set(key, `- ${sourcePage} → ${href}：${message}`)
}

while (pendingHtmlFiles.length > 0) {
  const sourcePage = pendingHtmlFiles.shift()
  if (visitedHtmlFiles.has(sourcePage)) continue
  visitedHtmlFiles.add(sourcePage)
  const sourceFile = path.join(publicDir, sourcePage)
  if (!fs.existsSync(sourceFile)) continue
  const sourceHtml = fs.readFileSync(sourceFile, "utf8")
  const sourceUrl = publicUrlForHtml(sourcePage)

  for (const match of sourceHtml.matchAll(/<a\b[^>]*\shref=(?:"([^"]*)"|'([^']*)')[^>]*>/gi)) {
    const href = decodeHtml(match[1] ?? match[2]).trim()
    if (!href) {
      recordLinkIssue("链接地址为空", sourcePage, "(空地址)")
      continue
    }
    if (/^(?:mailto:|tel:|javascript:|data:)/i.test(href)) continue

    let url
    try {
      url = new URL(href, sourceUrl)
    } catch {
      recordLinkIssue("链接地址无法解析", sourcePage, href)
      continue
    }

    const target = targetFileForUrl(url)
    if (target === null) continue
    internalLinkCount += 1
    if (target === false) {
      recordLinkIssue("目标文件不存在", sourcePage, href)
      continue
    }

    if (!target.endsWith(".html")) continue
    linkedHtmlFiles.add(target)
    if (!visitedHtmlFiles.has(target)) pendingHtmlFiles.push(target)
    const targetHtml = fs.readFileSync(path.join(publicDir, target), "utf8")
    const canonicalHref = targetHtml.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
    if (canonicalHref) {
      const canonicalUrl = new URL(decodeHtml(canonicalHref), url)
      if (
        canonicalUrl.origin === url.origin
        && normalizeRoutePath(canonicalUrl.pathname) !== normalizeRoutePath(url.pathname)
      ) {
        recordLinkIssue(`链接未使用页面 canonical 地址 ${canonicalUrl.pathname}`, sourcePage, href)
      }
    }
    if (url.hash && url.hash !== "#") {
      let anchor
      try {
        anchor = decodeURIComponent(url.hash.slice(1))
      } catch {
        anchor = url.hash.slice(1)
      }
      if (!pageAnchorIds(targetHtml).has(anchor)) {
        recordLinkIssue(`页面内不存在 #${anchor} 锚点`, sourcePage, href)
      }
    } else if (url.hash === "#") {
      recordLinkIssue("链接只有空锚点", sourcePage, href)
    }
  }
}

for (const target of linkedHtmlFiles) {
  const html = fs.readFileSync(path.join(publicDir, target), "utf8")
  if (!isRedirectPage(html) && visibleMainText(html).length < 12) {
    recordLinkIssue("目标页面没有可读正文", target, "(页面内容检查)")
  }
}

if (linkIssues.size > 0) {
  fail(`全站站内链接检查发现 ${linkIssues.size} 个问题：\n${[...linkIssues.values()].join("\n")}`)
} else {
  pass(`全站站内链接检查：${visitedHtmlFiles.size}/${htmlFiles.length} 个可达 HTML、${internalLinkCount} 次链接、${linkedHtmlFiles.size} 个被链接页面`)
}

if (errors.length > 0) {
  console.error("\n最终站点验收失败：")
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log("\n最终站点验收通过：")
for (const check of checks) console.log(`- ${check}`)

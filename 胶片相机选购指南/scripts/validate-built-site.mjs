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

const corePages = [
  "index.html",
  "learn.html",
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
]

for (const page of keyCameraPages) {
  const html = read(page)
  if (!html) continue
  requireText(html, /camera-detail-guide/, `${page} 未启用详情页 v2`)
  requireText(html, /<link rel="canonical" href="[^"]*\/cameras\//, `${page} canonical 未指向干净路由`)
  if (/src="https:\/\/commons\.wikimedia\.org/.test(html)) fail(`${page} 仍直接加载 Wikimedia 图片`)
}
pass(`代表机型详情检查：${keyCameraPages.length} 个`)

const oldFm2 = read("02_atoms/models/尼康-FM2.html")
if (oldFm2 && !oldFm2.includes("cameras/nikon-fm2")) fail("尼康 FM2 旧地址没有跳转到新路由")
else pass("旧机型地址重定向检查")

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

if (errors.length > 0) {
  console.error("\n最终站点验收失败：")
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log("\n最终站点验收通过：")
for (const check of checks) console.log(`- ${check}`)

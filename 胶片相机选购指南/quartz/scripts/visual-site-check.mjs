import { spawn } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import WebSocket from "ws"

const baseUrl = String(process.argv[2] ?? "http://127.0.0.1:4173/code-lab").replace(/\/$/, "")
const chromeBin = process.env.CHROME_BIN
const reportDir = path.resolve("visual-report")
const screenshotDir = path.join(reportDir, "screenshots")
const debugPort = 9222 + Math.floor(Math.random() * 500)

if (!chromeBin) {
  console.error("缺少 CHROME_BIN，无法执行真实浏览器验收。")
  process.exit(1)
}

fs.rmSync(reportDir, { recursive: true, force: true })
fs.mkdirSync(screenshotDir, { recursive: true })

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForJson(url, attempts = 60) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url)
      if (response.ok) return response.json()
    } catch (error) {
      lastError = error
    }
    await delay(250)
  }
  throw lastError ?? new Error(`无法访问 ${url}`)
}

class CdpClient {
  constructor(url) {
    this.nextId = 1
    this.pending = new Map()
    this.events = new Map()
    this.socket = new WebSocket(url)
    this.ready = new Promise((resolve, reject) => {
      this.socket.once("open", resolve)
      this.socket.once("error", reject)
    })
    this.socket.on("message", (raw) => {
      const message = JSON.parse(String(raw))
      if (message.id) {
        const pending = this.pending.get(message.id)
        if (!pending) return
        this.pending.delete(message.id)
        if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`))
        else pending.resolve(message.result ?? {})
        return
      }
      const listeners = this.events.get(message.method) ?? []
      for (const listener of listeners) listener(message.params ?? {})
    })
  }

  async send(method, params = {}) {
    await this.ready
    const id = this.nextId++
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, method })
      this.socket.send(JSON.stringify({ id, method, params }))
    })
  }

  on(method, listener) {
    const listeners = this.events.get(method) ?? []
    listeners.push(listener)
    this.events.set(method, listeners)
  }

  waitFor(method, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`等待 ${method} 超时`)), timeoutMs)
      this.on(method, (params) => {
        clearTimeout(timeout)
        resolve(params)
      })
    })
  }

  close() {
    this.socket.close()
  }
}

async function newPage(url, viewport) {
  const response = await fetch(`http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent("about:blank")}`, {
    method: "PUT",
  })
  if (!response.ok) throw new Error(`创建浏览器页面失败：${response.status}`)
  const target = await response.json()
  const client = new CdpClient(target.webSocketDebuggerUrl)
  const exceptions = []
  client.on("Runtime.exceptionThrown", (event) => {
    exceptions.push(event.exceptionDetails?.text ?? "未知脚本异常")
  })
  await client.send("Page.enable")
  await client.send("Runtime.enable")
  await client.send("Log.enable")
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.width <= 480,
  })
  const loaded = client.waitFor("Page.loadEventFired")
  await client.send("Page.navigate", { url })
  await loaded
  await delay(1600)
  return { client, exceptions }
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text ?? "页面脚本执行失败")
  return result.result?.value
}

async function capture(client, file, fullPage = false) {
  let params = { format: "png", fromSurface: true, captureBeyondViewport: false }
  if (fullPage) {
    const metrics = await client.send("Page.getLayoutMetrics")
    const width = Math.min(Math.ceil(metrics.cssContentSize?.width ?? metrics.contentSize?.width ?? 1440), 1800)
    const height = Math.min(Math.ceil(metrics.cssContentSize?.height ?? metrics.contentSize?.height ?? 1000), 12000)
    params = {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: true,
      clip: { x: 0, y: 0, width, height, scale: 1 },
    }
  }
  const screenshot = await client.send("Page.captureScreenshot", params)
  fs.writeFileSync(file, Buffer.from(screenshot.data, "base64"))
}

const commonAuditExpression = `(() => {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const visible = (element) => {
    const style = getComputedStyle(element)
    const rect = element.getBoundingClientRect()
    return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0
  }
  const selectorOf = (element) => {
    if (element.id) return "#" + element.id
    const classes = [...element.classList].slice(0, 3).join(".")
    return element.tagName.toLowerCase() + (classes ? "." + classes : "")
  }
  const overflowing = [...document.querySelectorAll("body *")]
    .filter(visible)
    .map((element) => ({ element, rect: element.getBoundingClientRect() }))
    .filter(({ rect }) => rect.left < -4 || rect.right > viewportWidth + 4)
    .slice(0, 12)
    .map(({ element, rect }) => ({ selector: selectorOf(element), left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) }))
  const brokenImages = [...document.images]
    .filter(visible)
    .filter((image) => image.complete && image.naturalWidth === 0)
    .map((image) => image.currentSrc || image.src || image.alt)
  const imageRects = [...document.images]
    .filter(visible)
    .filter((image) => !image.matches(".commercial-hero-image"))
    .map((image) => {
      const rect = image.getBoundingClientRect()
      return { selector: selectorOf(image), width: Math.round(rect.width), height: Math.round(rect.height) }
    })
  const hugeImages = imageRects.filter((image) => image.width > viewportWidth + 4 || image.height > Math.max(900, viewportHeight * 1.8))
  return {
    title: document.title,
    viewportWidth,
    viewportHeight,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    overflowing,
    brokenImages,
    hugeImages,
    headerVisible: Boolean(document.querySelector(".site-header-shell")),
    mainTextLength: (document.querySelector("main")?.innerText ?? document.body.innerText ?? "").trim().length,
  }
})()`

const viewports = {
  desktop: { width: 1440, height: 1000 },
  tablet: { width: 900, height: 900 },
  mobile: { width: 390, height: 844 },
}

const pages = [
  { name: "home", path: "/index.html", viewports: ["desktop", "tablet", "mobile"], required: [".commercial-home"] },
  { name: "encyclopedia", path: "/encyclopedia.html", viewports: ["desktop", "tablet", "mobile"], required: [".knowledge-hub", ".knowledge-card-grid"] },
  { name: "buying", path: "/buying.html", viewports: ["desktop", "tablet", "mobile"], required: [".buying-guide-page", ".buying-product-grid"] },
  { name: "cameras", path: "/cameras.html", viewports: ["desktop", "tablet", "mobile"], required: [".camera-atlas-page", "[data-camera-grid]"] },
  { name: "fm2", path: "/cameras/nikon-fm2.html", viewports: ["desktop", "mobile"], required: [".camera-detail-guide"] },
  { name: "penf", path: "/cameras/olympus-pen-f.html", viewports: ["desktop", "mobile"], required: [".camera-detail-guide"] },
  { name: "lx", path: "/cameras/pentax-lx.html", viewports: ["desktop", "mobile"], required: [".camera-detail-guide"] },
  { name: "g1", path: "/cameras/contax-g1.html", viewports: ["desktop", "mobile"], required: [".camera-detail-guide"] },
  { name: "pearl-river", path: "/cameras/pearl-river-s-201.html", viewports: ["desktop", "mobile"], required: [".camera-detail-guide", ".source-video-grid.is-single"] },
]

const failures = []
const results = []

function fail(page, viewport, message, details = null) {
  failures.push({ page, viewport, message, details })
}

const chrome = spawn(chromeBin, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=/tmp/quartz-visual-${process.pid}`,
  "--remote-allow-origins=*",
  "about:blank",
], { stdio: "ignore" })

try {
  await waitForJson(`http://127.0.0.1:${debugPort}/json/version`)

  for (const page of pages) {
    for (const viewportName of page.viewports) {
      const viewport = viewports[viewportName]
      const url = `${baseUrl}${page.path}`
      const { client, exceptions } = await newPage(url, viewport)
      try {
        const common = await evaluate(client, commonAuditExpression)
        const required = await evaluate(client, `(${JSON.stringify(page.required)}).map((selector) => ({ selector, found: Boolean(document.querySelector(selector)) }))`)
        const screenshotPath = path.join(screenshotDir, `${page.name}-${viewportName}.png`)
        await capture(client, screenshotPath, false)
        if (["buying", "cameras", "fm2"].includes(page.name) && viewportName !== "tablet") {
          await capture(client, path.join(screenshotDir, `${page.name}-${viewportName}-full.png`), true)
        }

        if (!common.headerVisible) fail(page.name, viewportName, "缺少可见站点导航")
        if (common.mainTextLength < 120) fail(page.name, viewportName, "主内容文本异常短", common.mainTextLength)
        if (common.documentWidth > viewport.width + 4 || common.bodyWidth > viewport.width + 4) {
          fail(page.name, viewportName, "页面存在横向滚动", common.overflowing)
        }
        if (common.brokenImages.length > 0) fail(page.name, viewportName, "可见图片加载失败", common.brokenImages)
        if (common.hugeImages.length > 0) fail(page.name, viewportName, "存在异常放大的图片", common.hugeImages)
        if (exceptions.length > 0) fail(page.name, viewportName, "页面出现 JavaScript 异常", exceptions)
        for (const item of required) {
          if (!item.found) fail(page.name, viewportName, `缺少关键区域 ${item.selector}`)
        }

        if (page.name === "buying") {
          const grid = await evaluate(client, `(() => {
            const cards = [...document.querySelectorAll(".buying-product-card")].filter((card) => getComputedStyle(card).display !== "none")
            const tops = cards.map((card) => Math.round(card.getBoundingClientRect().top))
            const firstTop = Math.min(...tops)
            const firstRow = tops.filter((top) => Math.abs(top - firstTop) <= 3).length
            const maxImageHeight = Math.max(0, ...cards.map((card) => Math.round(card.querySelector("img")?.getBoundingClientRect().height ?? 0)))
            return { count: cards.length, firstRow, maxImageHeight }
          })()`)
          if (grid.count < 8) fail(page.name, viewportName, "预算选机卡片少于 8 张", grid)
          const expectedColumns = viewportName === "desktop" ? 4 : viewportName === "tablet" ? 2 : 1
          if (grid.firstRow !== expectedColumns) fail(page.name, viewportName, `预算选机应为 ${expectedColumns} 列`, grid)
          if (grid.maxImageHeight > 340) fail(page.name, viewportName, "商品图片高度异常", grid)
        }

        if (page.name === "cameras") {
          const atlas = await evaluate(client, `(() => {
            const root = document.querySelector("[data-camera-atlas]")
            const cards = [...document.querySelectorAll("[data-camera-card]")]
            const input = document.querySelector('[data-camera-filter="query"]')
            input.value = "尼康 FM2"
            input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: "尼康 FM2" }))
            return new Promise((resolve) => setTimeout(() => {
              const visibleCards = cards.filter((card) => !card.hidden)
              const countText = document.querySelector("[data-camera-count]")?.textContent ?? ""
              input.value = ""
              input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "deleteContentBackward" }))
              resolve({ total: cards.length, filtered: visibleCards.length, countText, ready: root?.dataset.cameraAtlasReady ?? "" })
            }, 450))
          })()`)
          if (atlas.total < 83) fail(page.name, viewportName, "图鉴卡片不足 83 台", atlas)
          if (atlas.ready !== "true") fail(page.name, viewportName, "图鉴交互脚本没有初始化", atlas)
          if (atlas.filtered < 1 || atlas.filtered > 3) fail(page.name, viewportName, "图鉴关键词筛选结果异常", atlas)
        }

        if (["fm2", "penf", "lx", "g1"].includes(page.name)) {
          const detail = await evaluate(client, `(() => ({
            navLinks: document.querySelectorAll(".camera-detail-guide a").length,
            tables: document.querySelectorAll("table").length,
            title: document.querySelector("h1")?.textContent?.trim() ?? "",
          }))()`)
          if (detail.navLinks < 5) fail(page.name, viewportName, "详情页章节导航不完整", detail)
          if (detail.tables < 1) fail(page.name, viewportName, "详情页缺少参数表", detail)
          if (!detail.title) fail(page.name, viewportName, "详情页缺少主标题", detail)
        }

        if (page.name === "home") {
          const finder = await evaluate(client, `(() => {
            const cards = [...document.querySelectorAll(".finder-result-card")]
            const button = document.querySelector('.finder-option[data-group="budget"][data-value="low"]')
            button?.click()
            return new Promise((resolve) => setTimeout(() => resolve({
              total: cards.length,
              visible: cards.filter((card) => !card.hidden).length,
              pressed: button?.getAttribute("aria-pressed") ?? "false",
              countText: document.querySelector(".finder-result-count")?.textContent ?? "",
            }), 250))
          })()`)
          if (finder.total < 4) fail(page.name, viewportName, "首页快速选机卡片不足", finder)
          if (finder.pressed !== "true" || finder.visible >= finder.total) fail(page.name, viewportName, "首页快速选机筛选没有生效", finder)

          const search = await evaluate(client, `(() => {
            document.querySelector(".search-button")?.click()
            return new Promise((resolve) => setTimeout(() => {
              const container = document.querySelector(".search-container")
              const input = document.querySelector(".search-bar")
              if (input) {
                input.value = "尼康 FM2"
                input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: "尼康 FM2" }))
              }
              setTimeout(() => resolve({
                active: container?.classList.contains("active") ?? false,
                results: document.querySelectorAll(".result-card").length,
              }), 700)
            }, 150))
          })()`)
          if (!search.active) fail(page.name, viewportName, "全站搜索无法打开", search)
          if (search.results < 1) fail(page.name, viewportName, "全站搜索没有返回机型结果", search)
        }

        results.push({ page: page.name, viewport: viewportName, url, common })
      } finally {
        client.close()
      }
    }
  }
} catch (error) {
  failures.push({ page: "runner", viewport: "all", message: error.message, stack: error.stack })
} finally {
  chrome.kill("SIGTERM")
}

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  checkedPages: results.length,
  failures,
  results,
}
fs.writeFileSync(path.join(reportDir, "report.json"), JSON.stringify(report, null, 2))
fs.writeFileSync(path.join(reportDir, "summary.txt"), failures.length === 0
  ? `浏览器视觉验收通过：${results.length} 个页面/视口组合。\n`
  : `浏览器视觉验收失败：${failures.length} 项。\n${failures.map((item) => `- ${item.page}/${item.viewport}: ${item.message}`).join("\n")}\n`)

if (failures.length > 0) {
  console.error("浏览器视觉验收失败：")
  for (const item of failures) console.error(`- ${item.page}/${item.viewport}: ${item.message}`, item.details ?? "")
  process.exit(1)
}

console.log(`浏览器视觉验收通过：${results.length} 个页面/视口组合。`)

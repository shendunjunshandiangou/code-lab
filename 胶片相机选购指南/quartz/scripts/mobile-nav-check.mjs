import { spawn } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import WebSocket from "ws"

const baseUrl = String(process.argv[2] ?? "http://127.0.0.1:4173/code-lab").replace(/\/$/, "")
const chromeBin = process.env.CHROME_BIN
const debugPort = 9750 + Math.floor(Math.random() * 180)
const reportDir = path.resolve("visual-report")

if (!chromeBin) throw new Error("缺少 CHROME_BIN")
fs.mkdirSync(reportDir, { recursive: true })

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForJson(url) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(url)
      if (response.ok) return response.json()
    } catch {}
    await delay(200)
  }
  throw new Error(`无法连接 Chrome：${url}`)
}

class Client {
  constructor(url) {
    this.id = 0
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
        message.error ? pending.reject(new Error(message.error.message)) : pending.resolve(message.result ?? {})
        return
      }
      for (const listener of this.events.get(message.method) ?? []) listener(message.params ?? {})
    })
  }

  async send(method, params = {}) {
    await this.ready
    const id = ++this.id
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.socket.send(JSON.stringify({ id, method, params }))
    })
  }

  waitFor(method) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`等待 ${method} 超时`)), 15000)
      const listeners = this.events.get(method) ?? []
      listeners.push((params) => {
        clearTimeout(timeout)
        resolve(params)
      })
      this.events.set(method, listeners)
    })
  }

  close() {
    this.socket.close()
  }
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text ?? "页面脚本执行失败")
  return result.result?.value
}

const chrome = spawn(chromeBin, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=/tmp/quartz-mobile-nav-${process.pid}`,
  "--remote-allow-origins=*",
  "about:blank",
], { stdio: "ignore" })

let client
try {
  await waitForJson(`http://127.0.0.1:${debugPort}/json/version`)
  const response = await fetch(`http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" })
  const target = await response.json()
  client = new Client(target.webSocketDebuggerUrl)
  await client.send("Page.enable")
  await client.send("Runtime.enable")
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 560,
    deviceScaleFactor: 1,
    mobile: true,
  })
  const loaded = client.waitFor("Page.loadEventFired")
  await client.send("Page.navigate", { url: `${baseUrl}/index.html` })
  await loaded
  await delay(1400)

  const result = await evaluate(client, `(() => {
    const button = document.querySelector('.site-menu-button')
    const nav = document.querySelector('.site-primary-nav')
    if (!button || !nav) return { error: '缺少导航按钮或抽屉' }
    button.click()
    return new Promise((resolve) => setTimeout(() => {
      const links = [...nav.querySelectorAll('a')]
      const last = links.at(-1)
      const before = {
        expanded: button.getAttribute('aria-expanded'),
        clientHeight: nav.clientHeight,
        scrollHeight: nav.scrollHeight,
        overflowY: getComputedStyle(nav).overflowY,
        bodyLocked: document.body.classList.contains('menu-open'),
      }
      nav.scrollTop = nav.scrollHeight
      setTimeout(() => {
        const rect = last?.getBoundingClientRect()
        resolve({
          ...before,
          scrollTop: nav.scrollTop,
          lastText: last?.textContent?.trim() ?? '',
          lastVisible: Boolean(rect && rect.top >= 0 && rect.bottom <= window.innerHeight + 1),
          viewportHeight: window.innerHeight,
          navBottom: Math.round(nav.getBoundingClientRect().bottom),
        })
      }, 180)
    }, 220))
  })()`)

  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true })
  fs.writeFileSync(path.join(reportDir, "mobile-navigation-open.png"), Buffer.from(screenshot.data, "base64"))
  fs.writeFileSync(path.join(reportDir, "mobile-navigation.json"), JSON.stringify(result, null, 2))

  const failures = []
  if (result.error) failures.push(result.error)
  if (result.expanded !== "true") failures.push("菜单未成功展开")
  if (!result.bodyLocked) failures.push("菜单展开后背景页面未锁定")
  if (!/auto|scroll/.test(result.overflowY ?? "")) failures.push("菜单没有纵向滚动能力")
  if (result.scrollHeight <= result.clientHeight) failures.push("短屏下菜单内容没有形成可滚动区域")
  if (result.scrollTop <= 0) failures.push("菜单无法向下滚动")
  if (result.lastText !== "关于本站" || !result.lastVisible) failures.push("最后一个导航项无法滚动到可见区域")
  if (result.navBottom > result.viewportHeight + 2) failures.push("菜单底部超出当前可视区域")

  if (failures.length) throw new Error(`${failures.join("；")}\n${JSON.stringify(result)}`)
  console.log(`短屏手机导航验收通过：${result.clientHeight}px 可视高度，菜单可滚动至“关于本站”。`)
} finally {
  client?.close()
  chrome.kill("SIGTERM")
}

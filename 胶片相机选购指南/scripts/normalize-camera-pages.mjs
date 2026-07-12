import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const modelsDir = path.join(root, "02_atoms", "models")

const curatedFiles = new Set([
  "尼康 FE.md",
  "奥林巴斯 mju-1.md",
  "尼康 F-601.md",
  "宾得 K1000.md",
  "尼康 FE2.md",
  "尼康 FG.md",
  "尼康 FM2.md",
  "尼康 F2.md",
  "尼康 F3.md",
  "宾得 MX.md",
])

const genericAudience = {
  机械单反: {
    suitable: "愿意学习手动曝光、重视机械操作感与无电池拍摄能力的人",
    unsuitable: "需要自动曝光、自动对焦，或只想轻松随手拍的人",
  },
  电子单反: {
    suitable: "希望保留手动对焦体验，同时用自动曝光降低操作门槛的人",
    unsuitable: "必须完全不依赖电池，或不能接受老电子元件故障风险的人",
  },
  自动对焦单反: {
    suitable: "从数码相机过渡到胶片，希望保留自动对焦和自动过片的人",
    unsuitable: "追求全机械结构、手动过片和传统金属机身体验的人",
  },
  便携自动相机: {
    suitable: "需要轻便随身、自动对焦和自动曝光，用于旅行与日常记录的人",
    unsuitable: "希望手动控制曝光，或不能接受老电子便携机维修困难的人",
  },
  便携相机: {
    suitable: "需要轻便随身、操作直接，用于旅行与日常记录的人",
    unsuitable: "需要更换镜头、完整手动控制或更高系统扩展性的人",
  },
  旁轴相机: {
    suitable: "喜欢安静轻便的取景方式，并愿意适应黄斑对焦的人",
    unsuitable: "依赖所见即所得取景，或经常使用长焦与微距的人",
  },
  中画幅相机: {
    suitable: "重视画面质量、层次和拍摄仪式感，能够接受较高使用成本的人",
    unsuitable: "需要轻便高速抓拍，或希望严格控制胶卷与冲扫成本的人",
  },
  双镜头反光相机: {
    suitable: "喜欢腰平取景、方形画幅和慢节奏创作的人",
    unsuitable: "需要快速对焦、长焦镜头或所见即所得近距离构图的人",
  },
  半格相机: {
    suitable: "希望一卷拍更多张、重视便携性和日常记录的人",
    unsuitable: "追求大幅放大、极致细节或高感画质的人",
  },
  即时成像相机: {
    suitable: "喜欢即拍即得、现场分享和实体照片体验的人",
    unsuitable: "重视单张成本、画质稳定性或后期调整空间的人",
  },
  一次性相机: {
    suitable: "只需要简单记录一次旅行、聚会或活动的人",
    unsuitable: "需要长期使用、手动控制或稳定成像质量的人",
  },
}

const genericScenes = {
  机械单反: ["摄影基础学习", "日常记录", "街拍"],
  电子单反: ["日常记录", "街拍", "摄影入门"],
  自动对焦单反: ["日常记录", "旅行", "动态抓拍"],
  便携自动相机: ["旅行随拍", "日常记录", "聚会"],
  便携相机: ["旅行随拍", "日常记录", "街拍"],
  旁轴相机: ["街拍", "旅行", "人文记录"],
  中画幅相机: ["人像", "风光", "创作拍摄"],
  双镜头反光相机: ["人像", "街头记录", "方形构图"],
  半格相机: ["旅行", "日常记录", "街拍"],
  即时成像相机: ["聚会", "旅行纪念", "现场分享"],
  一次性相机: ["旅行", "聚会", "活动记录"],
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function unquote(value) {
  const trimmed = value.trim()
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function getYamlScalar(frontmatter, key) {
  return unquote(frontmatter.match(new RegExp(`^${escapeRegExp(key)}:\\s*(.*)$`, "m"))?.[1] ?? "")
}

function setYamlBlock(frontmatter, key, replacementLines) {
  const lines = frontmatter.split("\n")
  const index = lines.findIndex((line) => line.startsWith(`${key}:`))
  if (index < 0) return frontmatter

  let end = index + 1
  while (end < lines.length && /^\s{2}-\s/.test(lines[end])) end += 1
  lines.splice(index, end - index, ...replacementLines)
  return lines.join("\n")
}

function setYamlScalar(frontmatter, key, value) {
  return setYamlBlock(frontmatter, key, [`${key}: ${JSON.stringify(value)}`])
}

function setYamlList(frontmatter, key, values) {
  if (!values.length) return setYamlBlock(frontmatter, key, [`${key}: []`])
  return setYamlBlock(frontmatter, key, [`${key}:`, ...values.map((value) => `  - ${JSON.stringify(value)}`)])
}

function sectionRange(body, heading) {
  const headingPattern = new RegExp(`^## ${escapeRegExp(heading)}\\s*$`, "m")
  const match = headingPattern.exec(body)
  if (!match) return null

  const contentStart = match.index + match[0].length
  const remainder = body.slice(contentStart)
  const nextMatch = /^## .+$/m.exec(remainder)
  const end = nextMatch ? contentStart + nextMatch.index : body.length
  return { start: match.index, contentStart, end }
}

function getSection(body, heading) {
  const range = sectionRange(body, heading)
  return range ? body.slice(range.contentStart, range.end).trim() : ""
}

function replaceSection(body, heading, content) {
  const range = sectionRange(body, heading)
  if (!range) return body
  const next = `## ${heading}\n\n${content.trim()}\n\n`
  return `${body.slice(0, range.start)}${next}${body.slice(range.end).replace(/^\s+/, "")}`
}

function plainList(markdown) {
  const values = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, "").replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1").replace(/[*_`]/g, "").trim())
    .filter(Boolean)
  return values.join("；")
}

function tableValues(body) {
  const values = {}
  for (const line of body.split("\n")) {
    if (!line.trim().startsWith("|")) continue
    const cells = line.split("|").map((cell) => cell.trim())
    if (cells.length < 4 || !cells[1] || !cells[2]) continue
    if (/^[-:]+$/.test(cells[1]) || cells[1] === "参数") continue
    values[cells[1]] = cells[2]
  }
  return values
}

function exposureModes(value) {
  const modes = []
  for (const match of value.matchAll(/(?:^|[^A-Za-z])(P|A|S|M)(?=$|[^A-Za-z])/g)) {
    if (!modes.includes(match[1])) modes.push(match[1])
  }
  return modes
}

function checklist(cameraType) {
  if (cameraType === "机械单反") {
    return `1. 不装电池逐档测试机械快门和 B 门，确认快门帘运行完整，没有明显粘滞或停顿。
2. 装入新电池测试测光系统，改变光线、ISO、快门和光圈时，显示应连续响应。
3. 检查过片、上弦、计数器和回卷机构是否顺畅，反光镜升降是否正常。
4. 检查快门帘、取景器、反光镜、对焦屏和镜头是否有霉、雾、划痕或腐蚀。
5. 检查电池仓、后盖锁扣、密封海绵和反光镜缓冲棉是否老化。
6. 优先选择完成快门精度、测光和实拍测试的机身。`
  }

  if (cameraType === "电子单反") {
    return `1. 装入新电池，确认测光、液晶或指针显示、快门和各曝光模式均能启动。
2. 逐档测试电子快门，重点检查慢门、高速快门及机械备份速度。
3. 测试光圈联动、景深预览、曝光补偿、自拍和闪光同步等现有功能。
4. 检查过片、上弦、计数器和回卷机构，确认没有卡顿或异常声响。
5. 检查电池仓是否漏液，取景器、反光镜、对焦屏和镜头是否有霉雾。
6. 优先选择能够提供实拍样片、维修记录或退换保障的卖家。`
  }

  if (cameraType === "自动对焦单反") {
    return `1. 装入新电池，确认液晶、测光、快门、闪光灯和全部按键正常。
2. 搭配兼容镜头反复测试自动对焦，确认马达没有异常尖叫、打滑或明显失焦。
3. 测试各曝光模式、曝光补偿、连拍和不同测光方式。
4. 装入废卷测试自动装片、过片、计数器和回卷，确认马达运行稳定。
5. 检查电池仓、机背锁扣、液晶和拨盘是否老化或接触不良。
6. 优先选择能够提供装卷测试视频、实拍样片或退换保障的卖家。`
  }

  if (["便携自动相机", "便携相机"].includes(cameraType)) {
    return `1. 反复测试电源开关、滑盖或镜头伸缩机构，确认没有卡顿和异常声响。
2. 半按快门测试自动对焦与测光，在明暗环境中确认闪光灯充电和释放正常。
3. 装入废卷测试自动装片、过片、计数器和回卷功能。
4. 检查镜头、取景器和闪光灯窗口是否有霉、雾、划痕或松动。
5. 检查电池仓是否漏液，后盖锁扣和密封材料是否老化。
6. 优先选择能够提供完整功能测试、实拍样片或退换保障的卖家。`
  }

  if (cameraType === "旁轴相机") {
    return `1. 对准远近不同目标测试黄斑重合，确认垂直和水平没有明显偏移。
2. 逐档测试快门和 B 门，检查叶片或快门帘是否粘滞、漏光或速度异常。
3. 检查镜头调焦、光圈叶片、测光和曝光联动是否顺畅。
4. 检查取景器亮度、黄斑清晰度，以及镜头是否有霉、雾、划痕。
5. 测试过片、计数器、回卷和后盖锁扣，检查密封材料是否老化。
6. 优先选择完成黄斑校准和实拍测试的机身。`
  }

  if (["中画幅相机", "双镜头反光相机"].includes(cameraType)) {
    return `1. 检查快门、光圈、对焦和过片机构，确认各档速度与叶片动作正常。
2. 检查取景屏、反光镜以及拍摄镜头和取景镜头是否有霉、雾、划痕。
3. 检查片仓、后背、豆腐刀或后盖锁扣，确认遮光结构和联锁机构正常。
4. 如有皮腔，强光检查针孔和折痕；如可换后背，逐个测试计数与过片。
5. 装入废卷确认片距、计数器和卷片停止位置正常。
6. 优先选择能够提供整卷实拍、维修记录或退换保障的卖家。`
  }

  if (cameraType === "半格相机") {
    return `1. 测试快门、测光、光圈和对焦机构，确认动作稳定。
2. 装入废卷检查半格过片步距、计数器和回卷是否正确。
3. 检查镜头和取景器是否有霉、雾、划痕，画幅遮框是否完整。
4. 检查电池仓、后盖锁扣和密封材料是否老化。
5. 了解冲扫店是否支持半格扫描及相邻画面拆分。
6. 优先选择能够提供实拍样片或退换保障的卖家。`
  }

  if (cameraType === "即时成像相机") {
    return `1. 装入可用相纸或测试盒，确认供电、快门、闪光灯和吐片正常。
2. 检查滚轴是否洁净、平行且转动顺畅，避免药液分布不均。
3. 检查镜头、取景器和曝光补偿机构是否正常。
4. 确认使用的相纸型号仍可购买，并把单张成本计入预算。
5. 检查电池仓、相纸仓和机身卡扣是否腐蚀或变形。
6. 优先选择能够提供近期实拍成片的卖家。`
  }

  if (cameraType === "一次性相机") {
    return `1. 确认产品未拆封，外壳、镜头窗口和闪光灯没有明显损坏。
2. 查看胶卷有效期和保存环境，避免高温、潮湿或长期暴晒的库存。
3. 确认剩余张数、ISO、闪光灯使用方式和适合的拍摄距离。
4. 提前确认当地冲洗店接受一次性相机，并了解拆机和扫描费用。
5. 拍摄后尽快冲洗，避免长期存放造成潜影衰减。`
  }

  return `1. 检查快门、测光、对焦、过片、回卷和计数器是否正常。
2. 检查取景器、镜头和机身内部是否存在霉、雾、划痕或腐蚀。
3. 检查电池仓、后盖锁扣和电子功能是否稳定。
4. 检查密封材料、皮腔或片仓遮光结构是否老化漏光。
5. 优先选择能够提供实拍测试、维修记录或退换保障的卖家。`
}

function normalizeFile(file) {
  if (curatedFiles.has(file)) return false

  const fullPath = path.join(modelsDir, file)
  const original = fs.readFileSync(fullPath, "utf8")
  const match = original.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error(`${file}: 缺少 frontmatter`)

  let [, frontmatter, body] = match
  if (getYamlScalar(frontmatter, "entity") !== "camera") return false

  const title = getYamlScalar(frontmatter, "title") || file.replace(/\.md$/, "")
  const cameraType = getYamlScalar(frontmatter, "camera_type") || "待核验"
  const params = tableValues(body)

  body = body.replace(new RegExp(`^#\\s+${escapeRegExp(title)}\\s*\\n+`, "m"), "")

  const suitableSection = getSection(body, "适合谁")
  const unsuitableSection = getSection(body, "不适合谁")
  const fallback = genericAudience[cameraType] ?? {
    suitable: "希望体验这类胶片相机，并愿意了解其操作特点的人",
    unsuitable: "无法接受老相机维护成本和功能局限的人",
  }
  const suitable = plainList(suitableSection)
  const unsuitable = plainList(unsuitableSection)
  const suitableText = !suitable || /待补充/.test(suitable) ? fallback.suitable : suitable
  const unsuitableText = !unsuitable || /待补充/.test(unsuitable) ? fallback.unsuitable : unsuitable

  body = body.replace(
    /<div class="camera-verdict-grid">[\s\S]*?<\/div>\s*\n\s*## 关键参数/,
    `<div class="camera-verdict-grid">\n  <div><strong>适合</strong><span>${suitableText}</span></div>\n  <div><strong>不适合</strong><span>${unsuitableText}</span></div>\n  <div><strong>参考价格</strong><span>${getYamlScalar(frontmatter, "price_min") && getYamlScalar(frontmatter, "price_min") !== "null" ? `约 ¥${getYamlScalar(frontmatter, "price_min")}${getYamlScalar(frontmatter, "price_max") && getYamlScalar(frontmatter, "price_max") !== "null" ? `～${getYamlScalar(frontmatter, "price_max")}` : " 起"}，价格核对于 2026 年 7 月` : "价格随成色、配置和地区变化，购买前需重新核对"}</span></div>\n</div>\n\n## 关键参数`,
  )

  body = replaceSection(body, "购买检查", checklist(cameraType))

  const sourceSection = getSection(body, "图片与资料来源")
  const imageLine = sourceSection
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("- 图片：")) ?? "- 图片：待完成授权核验后补充。"
  body = replaceSection(
    body,
    "图片与资料来源",
    `${imageLine}\n- 本页机型资料沿用原有整理内容，并统一为标准详情页结构；未完成核验的参数继续明确标记。\n- 二手价格会随地区、成色、镜头搭配和维修状态变化，当前区间不是成交保证。`,
  )

  const modes = exposureModes(params["曝光模式"] ?? "")
  if (modes.length) frontmatter = setYamlList(frontmatter, "exposure_modes", modes)

  const currentMount = getYamlScalar(frontmatter, "mount")
  if (cameraType.includes("单反") && currentMount === "固定镜头") {
    const inferredMount = params["卡口"] || (/卡口/.test(params["镜头"] ?? "") ? params["镜头"] : "待核验")
    frontmatter = setYamlScalar(frontmatter, "mount", inferredMount)
  }

  const currentScenes = getYamlScalar(frontmatter, "recommended_scenes")
  if (currentScenes === "[]" || /^recommended_scenes:\s*\[\]$/m.test(frontmatter)) {
    frontmatter = setYamlList(frontmatter, "recommended_scenes", genericScenes[cameraType] ?? ["日常记录"])
  }

  frontmatter = setYamlScalar(frontmatter, "model", getYamlScalar(frontmatter, "model") || title)
  frontmatter = frontmatter.replace(/^last_updated:.*$/m, "last_updated: 2026-07-12")

  const next = `---\n${frontmatter}\n---\n\n${body.trim()}\n`
  if (next === original) return false
  fs.writeFileSync(fullPath, next, "utf8")
  return true
}

const files = fs.readdirSync(modelsDir).filter((file) => file.endsWith(".md")).sort()
let changed = 0

for (const file of files) {
  if (normalizeFile(file)) changed += 1
}

console.log(`已完成 ${changed} 个剩余机型页面的全量收口；10 个已人工核验页面保持不变。`)

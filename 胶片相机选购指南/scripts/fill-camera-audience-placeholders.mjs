import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const modelsDir = path.join(root, "02_atoms", "models")

const audienceByType = {
  "机械单反": {
    suitable: ["愿意学习手动曝光，并重视机械操作与镜头系统的人。"],
    unsuitable: ["需要自动曝光、自动对焦，或只想轻松随手拍的人。"],
  },
  "专业全机械单反": {
    suitable: ["理解手动曝光，并愿意接受专业机身重量与系统复杂度的人。"],
    unsuitable: ["需要轻便机身、自动曝光或自动对焦的人。"],
  },
  "电子单反": {
    suitable: ["希望保留手动对焦，同时利用自动曝光降低操作负担的人。"],
    unsuitable: ["必须完全不依赖电池，或不能接受老电子元件故障风险的人。"],
  },
  "自动对焦单反": {
    suitable: ["希望保留自动对焦、自动过片和现代操作方式的胶片用户。"],
    unsuitable: ["追求全机械结构、手动过片和传统金属机身体验的人。"],
  },
  "便携自动相机": {
    suitable: ["需要轻便随身、自动对焦和自动曝光，用于旅行与日常记录的人。"],
    unsuitable: ["需要完整手动控制，或不能接受老电子便携机维修困难的人。"],
  },
  "便携相机": {
    suitable: ["需要轻便随身、操作直接，用于旅行和日常记录的人。"],
    unsuitable: ["需要更换镜头、完整手动控制或更高系统扩展性的人。"],
  },
  "旁轴相机": {
    suitable: ["喜欢安静轻便的取景方式，并愿意适应黄斑或手动对焦的人。"],
    unsuitable: ["依赖所见即所得取景，或经常使用长焦与微距的人。"],
  },
  "中画幅相机": {
    suitable: ["重视画面层次和拍摄仪式感，能够接受较高胶卷与冲扫成本的人。"],
    unsuitable: ["需要轻便高速抓拍，或希望严格控制单张拍摄成本的人。"],
  },
  "双镜头反光相机": {
    suitable: ["喜欢腰平取景、方形画幅和慢节奏创作的人。"],
    unsuitable: ["需要快速对焦、长焦镜头或精确近距离构图的人。"],
  },
  "半格相机": {
    suitable: ["希望一卷拍更多张、重视便携性和日常记录的人。"],
    unsuitable: ["追求大幅放大、极致细节或高感画质的人。"],
  },
  "即时成像相机": {
    suitable: ["喜欢即拍即得、现场分享和实体照片体验的人。"],
    unsuitable: ["重视单张成本、画质稳定性或后期调整空间的人。"],
  },
}

function frontmatterValue(frontmatter, key) {
  const raw = frontmatter.match(new RegExp(`^${key}:\\s*(.*)$`, "m"))?.[1]?.trim() ?? ""
  return raw.replace(/^["']|["']$/g, "")
}

function replacePlaceholder(body, heading, values) {
  if (!values?.length) return body
  const pattern = new RegExp(`(^## ${heading}\\s*\\n+)- 待补充。(?=\\s*(?:\\n## |$))`, "m")
  if (!pattern.test(body)) return body
  return body.replace(pattern, `$1${values.map((value) => `- ${value}`).join("\n")}`)
}

const updated = []
for (const file of fs.readdirSync(modelsDir).filter((name) => name.endsWith(".md")).sort()) {
  const fullPath = path.join(modelsDir, file)
  const original = fs.readFileSync(fullPath, "utf8")
  const match = original.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) continue
  const [, frontmatter] = match
  let body = match[2]
  if (frontmatterValue(frontmatter, "entity") !== "camera") continue

  const cameraType = frontmatterValue(frontmatter, "camera_type")
  const audience = audienceByType[cameraType]
  if (!audience) continue

  body = replacePlaceholder(body, "适合谁", audience.suitable)
  body = replacePlaceholder(body, "不适合谁", audience.unsuitable)

  const next = `---\n${frontmatter}\n---\n${body}`
  if (next === original) continue
  fs.writeFileSync(fullPath, next, "utf8")
  updated.push(file)
}

if (updated.length === 0) {
  console.log("没有发现可安全填充的适用人群空白。")
} else {
  console.log(`已填充 ${updated.length} 个机型页面的适用人群空白：`)
  for (const file of updated) console.log(`- ${file}`)
}

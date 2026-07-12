// @ts-ignore
import cameraAtlasScript from "./scripts/cameraAtlas.inline"
import { resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/cameraAtlas.scss"

type Frontmatter = Record<string, any>

type CameraRecord = {
  page: QuartzPluginData
  title: string
  brand: string
  brandLabel: string
  model: string
  type: string
  control: string
  format: string
  focus: string
  budget: string
  price: number
  priceText: string
  year: number
  beginner: string
  rank: number
  scenes: string[]
  sceneText: string
  description: string
  image: string
  search: string
}

const brandLabels: Record<string, string> = {
  Nikon: "尼康",
  Canon: "佳能",
  Minolta: "美能达",
  Olympus: "奥林巴斯",
  Pentax: "宾得",
  Contax: "康泰时",
  Leica: "徕卡",
  Fujifilm: "富士",
  Fuji: "富士",
  Ricoh: "理光",
  Yashica: "雅西卡",
  Mamiya: "玛米亚",
  Hasselblad: "哈苏",
  Kodak: "柯达",
  Konica: "柯尼卡",
  Rollei: "禄来",
  Voigtlander: "福伦达",
  Panasonic: "松下",
  Casio: "卡西欧",
  PearlRiver: "珠江",
}

function list(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  if (value === null || value === undefined || value === "") return []
  return [String(value)]
}

function normalizedBrand(frontmatter: Frontmatter, title: string) {
  const brand = String(frontmatter.brand ?? "").trim()
  if (brand) return { value: brand, label: brandLabels[brand] ?? brand }

  const known = Object.entries(brandLabels).find(([, label]) => title.includes(label))
  return known ? { value: known[0], label: known[1] } : { value: "Other", label: "其他品牌" }
}

function normalizedType(frontmatter: Frontmatter) {
  const raw = `${frontmatter.camera_type ?? ""} ${frontmatter.format ?? ""}`
  if (/中画幅|120|6×|6x/i.test(raw)) return "中画幅"
  if (/半格/i.test(raw)) return "半格"
  if (/旁轴/i.test(raw)) return "旁轴"
  if (/一次性/i.test(raw)) return "一次性相机"
  if (/便携|PS|傻瓜|口袋|固定镜头/i.test(raw)) return "便携相机"
  if (/单反|SLR/i.test(raw)) return "单反"
  return "其他"
}

function normalizedControl(frontmatter: Frontmatter) {
  const type = String(frontmatter.camera_type ?? "")
  const focus = String(frontmatter.focus ?? "")
  const shutter = String(frontmatter.shutter ?? "")
  const modes = list(frontmatter.exposure_modes).join(" ")

  if (/自动对焦|全自动|程序自动|PS|便携自动/i.test(`${type} ${focus}`)) return "自动对焦/全自动"
  if (/全机械|纯机械/i.test(`${type} ${shutter}`) || (/手动|M/i.test(modes) && !/[APS]|光圈优先|快门优先|程序/i.test(modes))) return "全手动"
  if (/[APS]|光圈优先|快门优先|程序|电子/i.test(`${modes} ${type}`)) return "自动曝光"
  return "手动操作"
}

function normalizedFormat(frontmatter: Frontmatter) {
  const raw = String(frontmatter.format ?? "待核验")
  if (/135|35mm/i.test(raw)) return "135"
  if (/120|中画幅|6×|6x/i.test(raw)) return "120/中画幅"
  if (/半格/i.test(raw)) return "135 半格"
  return raw || "待核验"
}

function normalizedBudget(min: number, max: number) {
  if (!Number.isFinite(min) && !Number.isFinite(max)) return "价格待核验"
  const reference = Number.isFinite(min) && Number.isFinite(max) ? (min + max) / 2 : Number.isFinite(min) ? min : max
  if (reference < 500) return "500 元以下"
  if (reference < 1500) return "500～1500 元"
  if (reference < 4000) return "1500～4000 元"
  if (reference < 8000) return "4000～8000 元"
  return "8000 元以上"
}

function normalizedScenes(frontmatter: Frontmatter) {
  const source = list(frontmatter.recommended_scenes)
  const text = source.join(" ")
  const scenes: string[] = []
  if (/日常|生活|记录/i.test(text)) scenes.push("日常记录")
  if (/旅行|随拍/i.test(text)) scenes.push("旅行")
  if (/街拍|街头|人文/i.test(text)) scenes.push("街拍")
  if (/人像/i.test(text)) scenes.push("人像")
  if (/摄影|入门|学习|练习/i.test(text)) scenes.push("摄影学习")
  if (/收藏/i.test(text)) scenes.push("收藏")
  return scenes.length > 0 ? Array.from(new Set(scenes)) : ["通用"]
}

function beginnerRank(value: string) {
  if (/强烈推荐|推荐/i.test(value)) return 0
  if (/可以|适合/i.test(value)) return 1
  if (/进阶|谨慎/i.test(value)) return 2
  return 3
}

function priceText(min: number, max: number) {
  if (Number.isFinite(min) && Number.isFinite(max)) return `约 ¥${min}～${max}`
  if (Number.isFinite(min)) return `约 ¥${min} 起`
  if (Number.isFinite(max)) return `约 ¥${max} 以内`
  return "价格待核验"
}

function cameraFromPage(page: QuartzPluginData): CameraRecord | null {
  const frontmatter = (page.frontmatter ?? {}) as Frontmatter
  const slug = String(page.slug ?? "")
  const filePath = String(page.filePath ?? "")
  if (frontmatter.entity !== "camera" && !slug.startsWith("02_atoms/models/") && !filePath.includes("02_atoms/models/")) return null

  const title = String(frontmatter.title ?? slug.split("/").pop()?.replaceAll("-", " ") ?? "未命名机型")
  const brand = normalizedBrand(frontmatter, title)
  const min = Number(frontmatter.price_min)
  const max = Number(frontmatter.price_max)
  const price = Number.isFinite(min) ? min : Number.isFinite(max) ? max : 999999
  const scenes = normalizedScenes(frontmatter)
  const beginner = String(frontmatter.beginner_level ?? "待判断")
  const type = normalizedType(frontmatter)
  const control = normalizedControl(frontmatter)
  const format = normalizedFormat(frontmatter)
  const focus = String(frontmatter.focus ?? "待核验")
  const model = String(frontmatter.model ?? title.replace(brand.label, "").trim())
  const aliases = list(frontmatter.aliases)
  const image = String(frontmatter.hero_image ?? "").trim()
  const description = scenes[0] === "通用"
    ? String(frontmatter.description ?? `${type}机型，参数和二手状态需要进入详情页查看。`)
    : `适合${scenes.slice(0, 3).join("、")}；${beginner === "待判断" ? "入门难度需结合具体状态判断" : `新手定位：${beginner}`}。`

  return {
    page,
    title,
    brand: brand.value,
    brandLabel: brand.label,
    model,
    type,
    control,
    format,
    focus,
    budget: normalizedBudget(min, max),
    price,
    priceText: priceText(min, max),
    year: Number(frontmatter.release_year) || 9999,
    beginner,
    rank: beginnerRank(beginner),
    scenes,
    sceneText: scenes.join("、"),
    description,
    image,
    search: [title, brand.value, brand.label, model, type, control, format, focus, scenes.join(" "), aliases.join(" ")].join(" "),
  }
}

function options(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, "zh-CN"))
}

const CameraAtlasPage: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const cameras = allFiles
    .map(cameraFromPage)
    .filter((camera): camera is CameraRecord => camera !== null)
    .sort((a, b) => a.rank - b.rank || a.price - b.price || a.title.localeCompare(b.title, "zh-CN"))

  const brands = options(cameras.map((camera) => camera.brandLabel))
  const types = options(cameras.map((camera) => camera.type))
  const controls = options(cameras.map((camera) => camera.control))
  const formats = options(cameras.map((camera) => camera.format))
  const scenes = options(cameras.flatMap((camera) => camera.scenes))
  const imageCount = cameras.filter((camera) => camera.image).length

  return (
    <article class="camera-atlas-page" data-camera-atlas>
      <header class="camera-atlas-header">
        <div>
          <p>你正在浏览：相机图鉴</p>
          <h1>从全部机型中，筛选适合你的胶片相机。</h1>
          <span>按照品牌、预算、相机类型、操作方式、画幅和拍摄场景缩小范围。卡片数据直接来自每台机型的 Markdown 页面，后续修改资料时图鉴会自动同步。</span>
        </div>
        <figure>
          <img
            src="./static/images/library/nikon-fe-workshop-cologne-06-cropped-fee376ba.jpg"
            alt="尼康 FE 胶片相机"
            loading="eager"
          />
          <figcaption>尼康 FE · Tobias Wolter · Wikimedia Commons · CC BY-SA 3.0</figcaption>
        </figure>
      </header>

      <section class="camera-atlas-stats" aria-label="图鉴收录情况">
        <div><strong>{cameras.length}</strong><span>台机型页面</span></div>
        <div><strong>{brands.length}</strong><span>个品牌分类</span></div>
        <div><strong>{imageCount}</strong><span>台已有核验图片</span></div>
      </section>

      <section class="camera-atlas-browser">
        <div class="camera-atlas-intro">
          <div><p>完整机型库</p><h2>先筛选方向，再进入详情页比较状态与缺点。</h2></div>
          <span>二手价格会随地区、成色、镜头搭配和维修状态变化。价格区间只用于初步筛选，不代表实际成交价。</span>
        </div>

        <div class="camera-filter-panel" aria-label="机型筛选">
          <label class="camera-search-field">
            <span>搜索型号或关键词</span>
            <input type="search" placeholder="例如：尼康、自动对焦、街拍" data-camera-filter="query" />
          </label>
          <label><span>品牌</span><select data-camera-filter="brand"><option value="">全部品牌</option>{brands.map((brand) => <option value={brand}>{brand}</option>)}</select></label>
          <label><span>预算</span><select data-camera-filter="budget"><option value="">全部预算</option><option>500 元以下</option><option>500～1500 元</option><option>1500～4000 元</option><option>4000～8000 元</option><option>8000 元以上</option><option>价格待核验</option></select></label>
          <label><span>类型</span><select data-camera-filter="type"><option value="">全部类型</option>{types.map((type) => <option value={type}>{type}</option>)}</select></label>
          <label><span>操作方式</span><select data-camera-filter="control"><option value="">全部方式</option>{controls.map((control) => <option value={control}>{control}</option>)}</select></label>
          <label><span>画幅</span><select data-camera-filter="format"><option value="">全部画幅</option>{formats.map((format) => <option value={format}>{format}</option>)}</select></label>
          <label><span>场景</span><select data-camera-filter="scene"><option value="">全部场景</option>{scenes.map((scene) => <option value={scene}>{scene}</option>)}</select></label>
          <label><span>排序</span><select data-camera-filter="sort"><option value="recommended">新手推荐优先</option><option value="price">价格从低到高</option><option value="year">发布年份从早到晚</option><option value="name">型号名称</option></select></label>
        </div>

        <div class="camera-result-bar">
          <strong data-camera-count>{cameras.length} 台符合当前条件</strong>
          <button type="button" data-camera-reset>清除筛选</button>
        </div>

        <div class="camera-atlas-grid" data-camera-grid>
          {cameras.map((camera) => (
            <a
              class="camera-atlas-card"
              href={resolveRelative(fileData.slug!, camera.page.slug!)}
              data-camera-card
              data-name={camera.title}
              data-search={camera.search}
              data-brand={camera.brandLabel}
              data-type={camera.type}
              data-control={camera.control}
              data-format={camera.format}
              data-budget={camera.budget}
              data-scenes={camera.scenes.join("|")}
              data-price={camera.price}
              data-year={camera.year}
              data-rank={camera.rank}
            >
              <div class={`camera-atlas-card-media ${camera.image ? "has-image" : "is-placeholder"}`}>
                {camera.image ? (
                  <img src={camera.image} alt={camera.title} loading="lazy" decoding="async" />
                ) : (
                  <div><span>{camera.brandLabel}</span><strong>{camera.model || camera.title}</strong><small>图片待完成授权核验</small></div>
                )}
                <em>{camera.beginner}</em>
              </div>
              <div class="camera-atlas-card-body">
                <p>{camera.brandLabel} · {camera.type}</p>
                <h3>{camera.title}</h3>
                <div class="camera-atlas-card-facts"><span>{camera.control}</span><span>{camera.format}</span><span>{camera.focus}</span></div>
                <strong>{camera.priceText}</strong>
                <span>{camera.description}</span>
                <small>查看机型详情 →</small>
              </div>
            </a>
          ))}
        </div>

        <div class="camera-atlas-empty" data-camera-empty hidden>
          <strong>没有找到符合全部条件的机型</strong>
          <p>可以减少一个筛选条件，或者直接搜索品牌和型号。</p>
        </div>
        <button class="camera-atlas-more" type="button" data-camera-more>显示更多机型</button>
      </section>
    </article>
  )
}

CameraAtlasPage.css = style
CameraAtlasPage.afterDOMLoaded = cameraAtlasScript

export default (() => CameraAtlasPage) satisfies QuartzComponentConstructor

import { resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/buyingGuidePage.scss"

type CameraFrontmatter = Record<string, any>

type BuyingCamera = {
  page: QuartzPluginData
  title: string
  brand: string
  type: string
  focus: string
  format: string
  year: string
  beginner: string
  priceMin: number
  priceMax: number
  priceReference: number
  priceText: string
  image: string
  summary: string
  rank: number
}

type PriceGroup = {
  id: string
  label: string
  title: string
  description: string
  min: number
  max: number
}

const priceGroups: PriceGroup[] = [
  {
    id: "under-500",
    label: "500 元以内",
    title: "低成本体验胶片",
    description: "优先考虑 90 年代自动单反、普通便携机和非热门型号，把更多预算留给胶卷、冲扫和可能的小修。",
    min: 0,
    max: 500,
  },
  {
    id: "500-1000",
    label: "500～1000 元",
    title: "新手最容易找到平衡",
    description: "这个价位通常能买到功能完整的电子单反、入门机械单反和状态较好的自动便携机。",
    min: 500,
    max: 1000,
  },
  {
    id: "1000-2000",
    label: "1000～2000 元",
    title: "经典机型与更完整的系统",
    description: "可以开始考虑做工、镜头系统、体积和长期使用体验，但仍应把机况放在型号热度之前。",
    min: 1000,
    max: 2000,
  },
  {
    id: "over-2000",
    label: "2000 元以上",
    title: "为便携、系统或收藏属性付费",
    description: "高价不等于更适合新手。这个区间更需要确认镜头、维修能力、电子元件状态和市场溢价。",
    min: 2000,
    max: Number.POSITIVE_INFINITY,
  },
]

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
  PearlRiver: "珠江",
}

function beginnerRank(value: string) {
  if (/强烈推荐/.test(value)) return 0
  if (/推荐/.test(value)) return 1
  if (/可以|适合/.test(value)) return 2
  if (/进阶|谨慎/.test(value)) return 3
  return 4
}

function numeric(value: unknown) {
  const number = Number(value)
  return Number.isFinite(number) ? number : Number.NaN
}

function priceText(min: number, max: number) {
  if (Number.isFinite(min) && Number.isFinite(max)) return `约 ¥${min}～${max}`
  if (Number.isFinite(min)) return `约 ¥${min} 起`
  if (Number.isFinite(max)) return `约 ¥${max} 以内`
  return "价格待核验"
}

function averagePrice(min: number, max: number) {
  if (Number.isFinite(min) && Number.isFinite(max)) return (min + max) / 2
  if (Number.isFinite(min)) return min
  if (Number.isFinite(max)) return max
  return Number.POSITIVE_INFINITY
}

function cameraFromPage(page: QuartzPluginData): BuyingCamera | null {
  const frontmatter = (page.frontmatter ?? {}) as CameraFrontmatter
  if (frontmatter.entity !== "camera") return null

  const title = String(frontmatter.title ?? page.slug?.split("/").pop() ?? "未命名机型")
  const priceMin = numeric(frontmatter.price_min)
  const priceMax = numeric(frontmatter.price_max)
  const reference = averagePrice(priceMin, priceMax)
  if (!Number.isFinite(reference)) return null

  const brandValue = String(frontmatter.brand ?? "")
  const brand = brandLabels[brandValue] ?? brandValue ?? "其他品牌"
  const beginner = String(frontmatter.beginner_level ?? "待判断")
  const scenes = Array.isArray(frontmatter.recommended_scenes)
    ? frontmatter.recommended_scenes.map(String).filter(Boolean)
    : []
  const tagline = String(frontmatter.tagline ?? frontmatter.description ?? "").trim()
  const summary = tagline || (scenes.length > 0 ? `适合${scenes.slice(0, 3).join("、")}。` : "进入详情页查看优缺点和二手检查重点。")

  return {
    page,
    title,
    brand,
    type: String(frontmatter.camera_type ?? "类型待核验"),
    focus: String(frontmatter.focus ?? "对焦待核验"),
    format: String(frontmatter.format ?? "画幅待核验"),
    year: frontmatter.release_year ? String(frontmatter.release_year) : "年份待核验",
    beginner,
    priceMin,
    priceMax,
    priceReference: reference,
    priceText: priceText(priceMin, priceMax),
    image: String(frontmatter.hero_image ?? "").trim(),
    summary,
    rank: beginnerRank(beginner),
  }
}

function camerasForGroup(cameras: BuyingCamera[], group: PriceGroup) {
  return cameras
    .filter((camera) => camera.priceReference >= group.min && camera.priceReference < group.max)
    .filter((camera) => Boolean(camera.image))
    .sort((a, b) => a.rank - b.rank || a.priceReference - b.priceReference || a.title.localeCompare(b.title, "zh-CN"))
    .slice(0, 4)
}

function ProductCard({ camera, currentSlug }: { camera: BuyingCamera; currentSlug: NonNullable<QuartzComponentProps["fileData"]["slug"]> }) {
  return (
    <a class="buying-product-card" href={resolveRelative(currentSlug, camera.page.slug!)}>
      <div class="buying-product-media has-image">
        <img src={camera.image} alt={camera.title} loading="lazy" decoding="async" />
        <em>{camera.beginner}</em>
      </div>
      <div class="buying-product-body">
        <p>{camera.brand} · {camera.type}</p>
        <h3>{camera.title}</h3>
        <div class="buying-product-facts">
          <span>{camera.format}</span>
          <span>{camera.focus}</span>
          <span>{camera.year}</span>
        </div>
        <strong class="buying-product-price">{camera.priceText}</strong>
        <span class="buying-product-summary">{camera.summary}</span>
        <small>查看优缺点与验机重点 →</small>
      </div>
    </a>
  )
}

const BuyingGuidePage: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const currentSlug = fileData.slug!
  const cameras = allFiles
    .map(cameraFromPage)
    .filter((camera): camera is BuyingCamera => camera !== null)

  return (
    <article class="buying-guide-page">
      <header class="buying-guide-header">
        <div>
          <p>你正在浏览：帮我选相机</p>
          <h1>按预算，直接看值得比较的胶片相机。</h1>
          <span>先确定愿意投入的机身预算，再比较操作方式、画幅和二手状态。每个价位只展示少量入门方向明确的机型，感兴趣后再进入详情页。</span>
        </div>
        <figure>
          <img src="./static/images/library/nikon-fe-workshop-cologne-06-cropped-fee376ba.jpg" alt="尼康 FE 胶片相机" loading="eager" decoding="async" />
          <figcaption>尼康 FE · Tobias Wolter · Wikimedia Commons · CC BY-SA 3.0</figcaption>
        </figure>
      </header>

      <nav class="buying-price-nav" aria-label="按价格浏览">
        {priceGroups.map((group) => (
          <a href={`#${group.id}`}>
            <span>{group.label}</span>
            <small>{group.title}</small>
          </a>
        ))}
      </nav>

      <aside class="buying-budget-note">
        <strong>不要把全部预算都花在机身上。</strong>
        <span>建议至少预留 20%～30% 给镜头、胶卷、冲扫、电池和可能发生的小修。下方价格只用于初步筛选，不代表实际成交价。</span>
      </aside>

      <div class="buying-price-sections">
        {priceGroups.map((group, index) => {
          const recommendations = camerasForGroup(cameras, group)
          return (
            <section class={`buying-price-section ${index % 2 === 1 ? "is-soft" : ""}`} id={group.id}>
              <div class="buying-price-heading">
                <div>
                  <p>{group.label}</p>
                  <h2>{group.title}</h2>
                </div>
                <span>{group.description}</span>
              </div>
              <div class="buying-product-grid">
                {recommendations.map((camera) => <ProductCard camera={camera} currentSlug={currentSlug} />)}
              </div>
              <a class="buying-view-all" href="./cameras#camera-list">查看完整机型库和更多筛选条件 →</a>
            </section>
          )
        })}
      </div>

      <section class="buying-final-note">
        <div>
          <p>最后一步</p>
          <h2>型号只是起点，机况决定是否值得买。</h2>
        </div>
        <span>同一型号的两台老相机，可能因为快门、测光、霉雾、漏光、排线和维修历史产生很大差异。确认候选机型后，再使用验机清单逐项检查。</span>
        <div>
          <a href="./04_knowledge/选购决策/Step4-买了之后">查看二手验机清单</a>
          <a href="./cameras">浏览完整相机图鉴</a>
        </div>
      </section>
    </article>
  )
}

BuyingGuidePage.css = style

export default (() => BuyingGuidePage) satisfies QuartzComponentConstructor

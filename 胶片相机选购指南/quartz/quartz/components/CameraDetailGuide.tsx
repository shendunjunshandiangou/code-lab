import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const detailStyles = `
.camera-detail-guide {
  width: min(1180px, calc(100% - clamp(2rem, 7vw, 8rem)));
  margin: clamp(2rem, 4vw, 3.5rem) auto 0;
  color: #242520;
  background: #e3ded4;
  border: 1px solid rgba(13, 14, 13, 0.12);
}

.camera-detail-guide-top {
  padding: clamp(1.5rem, 3vw, 2.5rem);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 2rem;
  align-items: end;
  border-bottom: 1px solid rgba(13, 14, 13, 0.12);
}

.camera-detail-guide-top > div > span {
  display: block;
  margin-bottom: 0.55rem;
  color: #8b4f29;
  font-size: 15px;
  font-weight: 700;
}

.camera-detail-guide-top h2 {
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  color: #171815 !important;
  font-size: clamp(1.8rem, 3vw, 3rem) !important;
  line-height: 1.2 !important;
  font-weight: 560 !important;
}

.camera-detail-guide-top p {
  max-width: 760px;
  margin: 0.85rem 0 0;
  color: #555750;
  font-size: 17px;
  line-height: 1.75;
}

.camera-detail-guide nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.55rem;
}

.camera-detail-guide nav a {
  min-height: 38px;
  padding: 0 0.85rem;
  display: inline-flex;
  align-items: center;
  color: #3f403b !important;
  background: rgba(255, 255, 255, 0.46) !important;
  border: 1px solid rgba(13, 14, 13, 0.12);
  font-size: 15px;
  text-decoration: none;
}

.camera-detail-guide-facts {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.camera-detail-guide-facts > div {
  min-width: 0;
  padding: 1.25rem 1.35rem;
  border-right: 1px solid rgba(13, 14, 13, 0.12);
}

.camera-detail-guide-facts > div:last-child {
  border-right: 0;
}

.camera-detail-guide-facts span {
  display: block;
  margin-bottom: 0.45rem;
  color: #777970;
  font-size: 14px;
}

.camera-detail-guide-facts strong {
  display: block;
  color: #22231f;
  font-size: 16px;
  line-height: 1.55;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.center:has(.camera-detail-guide) > article.camera-detail {
  width: min(940px, calc(100% - clamp(2rem, 7vw, 8rem)));
  margin-left: auto;
  margin-right: auto;
}

.center:has(.camera-detail-guide) > article.camera-detail > blockquote:first-child {
  margin-top: 0;
  padding: 1.35rem 1.5rem;
  color: #373832;
  background: #e6e1d8;
  border-left: 3px solid #a86336;
  font-size: 18px;
  line-height: 1.8;
}

.center:has(.camera-detail-guide) > article.camera-detail > .camera-hero {
  display: none !important;
}

.center:has(.camera-detail-guide) > article.camera-detail h2 {
  margin-top: clamp(3.5rem, 7vw, 6rem) !important;
  padding-top: 1rem !important;
  border-top: 1px solid rgba(13, 14, 13, 0.15) !important;
  color: #171815 !important;
  font-size: clamp(2rem, 3.4vw, 3.2rem) !important;
  line-height: 1.22 !important;
}

.center:has(.camera-detail-guide) > article.camera-detail .camera-verdict-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid rgba(13, 14, 13, 0.14);
  border-left: 1px solid rgba(13, 14, 13, 0.14);
}

.center:has(.camera-detail-guide) > article.camera-detail .camera-verdict-grid > div {
  min-height: 175px;
  padding: 1.5rem;
  border-right: 1px solid rgba(13, 14, 13, 0.14);
  border-bottom: 1px solid rgba(13, 14, 13, 0.14);
}

.center:has(.camera-detail-guide) > article.camera-detail .camera-verdict-grid strong,
.center:has(.camera-detail-guide) > article.camera-detail .camera-verdict-grid span {
  display: block;
}

.center:has(.camera-detail-guide) > article.camera-detail .camera-verdict-grid strong {
  margin-bottom: 0.7rem;
  color: #8b4f29;
  font-size: 15px;
}

.center:has(.camera-detail-guide) > article.camera-detail .camera-verdict-grid span {
  color: #4f514b;
  font-size: 17px;
  line-height: 1.75;
}

.center:has(.camera-detail-guide) > article.camera-detail table {
  width: 100%;
  border-collapse: collapse;
  background: #e8e3da;
}

.center:has(.camera-detail-guide) > article.camera-detail th,
.center:has(.camera-detail-guide) > article.camera-detail td {
  padding: 0.95rem 1rem;
  border: 1px solid rgba(13, 14, 13, 0.13);
  text-align: left;
  vertical-align: top;
  font-size: 16px;
  line-height: 1.65;
}

.center:has(.camera-detail-guide) > article.camera-detail th {
  color: #22231f;
  background: #d9d3c8;
  font-weight: 700;
}

.center:has(.camera-detail-guide) > article.camera-detail h2[id="为什么值得买"] + ul,
.center:has(.camera-detail-guide) > article.camera-detail h2[id="需要注意什么"] + ul,
.center:has(.camera-detail-guide) > article.camera-detail h2[id="适合谁"] + ul,
.center:has(.camera-detail-guide) > article.camera-detail h2[id="不适合谁"] + ul,
.center:has(.camera-detail-guide) > article.camera-detail h2[id="同价位替代"] + ul {
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
  list-style: none;
}

.center:has(.camera-detail-guide) > article.camera-detail h2[id="为什么值得买"] + ul > li,
.center:has(.camera-detail-guide) > article.camera-detail h2[id="需要注意什么"] + ul > li,
.center:has(.camera-detail-guide) > article.camera-detail h2[id="适合谁"] + ul > li,
.center:has(.camera-detail-guide) > article.camera-detail h2[id="不适合谁"] + ul > li,
.center:has(.camera-detail-guide) > article.camera-detail h2[id="同价位替代"] + ul > li {
  margin: 0;
  padding: 1.25rem 1.35rem;
  color: #4d4f49;
  background: #e7e2d9;
  border: 1px solid rgba(13, 14, 13, 0.11);
  font-size: 17px;
  line-height: 1.75;
}

.center:has(.camera-detail-guide) > article.camera-detail h2[id="购买检查"] + ol {
  margin: 0;
  padding: 0;
  counter-reset: camera-check;
  list-style: none;
}

.center:has(.camera-detail-guide) > article.camera-detail h2[id="购买检查"] + ol > li {
  counter-increment: camera-check;
  position: relative;
  min-height: 62px;
  margin: 0;
  padding: 1rem 1rem 1rem 4rem;
  border-top: 1px solid rgba(13, 14, 13, 0.13);
  color: #4d4f49;
  font-size: 17px;
  line-height: 1.75;
}

.center:has(.camera-detail-guide) > article.camera-detail h2[id="购买检查"] + ol > li::before {
  content: counter(camera-check, decimal-leading-zero);
  position: absolute;
  left: 0.5rem;
  top: 1rem;
  color: #9a5b31;
  font-family: "Noto Serif SC", serif;
  font-size: 1.25rem;
}

@media (max-width: 1050px) {
  .camera-detail-guide-top {
    grid-template-columns: 1fr;
  }

  .camera-detail-guide nav {
    justify-content: flex-start;
  }

  .camera-detail-guide-facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .camera-detail-guide-facts > div:nth-child(3) {
    border-right: 0;
  }

  .camera-detail-guide-facts > div:nth-child(-n + 3) {
    border-bottom: 1px solid rgba(13, 14, 13, 0.12);
  }
}

@media (max-width: 720px) {
  .camera-detail-guide {
    width: calc(100% - 2rem);
  }

  .camera-detail-guide-facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .camera-detail-guide-facts > div {
    border-bottom: 1px solid rgba(13, 14, 13, 0.12);
  }

  .camera-detail-guide-facts > div:nth-child(2n) {
    border-right: 0;
  }

  .center:has(.camera-detail-guide) > article.camera-detail {
    width: calc(100% - 2rem);
  }

  .center:has(.camera-detail-guide) > article.camera-detail .camera-verdict-grid,
  .center:has(.camera-detail-guide) > article.camera-detail h2[id="为什么值得买"] + ul,
  .center:has(.camera-detail-guide) > article.camera-detail h2[id="需要注意什么"] + ul,
  .center:has(.camera-detail-guide) > article.camera-detail h2[id="适合谁"] + ul,
  .center:has(.camera-detail-guide) > article.camera-detail h2[id="不适合谁"] + ul,
  .center:has(.camera-detail-guide) > article.camera-detail h2[id="同价位替代"] + ul {
    grid-template-columns: 1fr;
  }
}
`

function textList(value: unknown) {
  if (Array.isArray(value)) return value.filter(Boolean).join(" / ")
  return String(value ?? "").trim()
}

const CameraDetailGuide: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const frontmatter = (fileData.frontmatter ?? {}) as Record<string, any>
  if (Number(frontmatter.detail_version ?? 0) !== 2) return null

  const title = String(frontmatter.title ?? frontmatter.model ?? "这台相机")
  const exposure = textList(frontmatter.exposure_modes) || "待核验"
  const scenes = textList(frontmatter.recommended_scenes) || "待核验"
  const weight = frontmatter.weight_g ? `${frontmatter.weight_g}g` : "待核验"
  const year = frontmatter.release_year ? `${frontmatter.release_year} 年` : "待核验"

  return (
    <>
      <style id="camera-detail-v2-inline">{detailStyles}</style>
      <section class="camera-detail-guide" aria-label={`${title}详情导航`}>
        <div class="camera-detail-guide-top">
          <div>
            <span>机型购买指南</span>
            <h2>先看结论，再核对参数和二手状态。</h2>
            <p>本页按照实际购买决策重新组织。未完成核验的参数会继续显示“待核验”，二手价格只作为筛选范围。</p>
          </div>
          <nav aria-label="本页目录">
            <a href="#快速判断">快速判断</a>
            <a href="#关键参数">关键参数</a>
            <a href="#为什么值得买">主要优点</a>
            <a href="#需要注意什么">主要缺点</a>
            <a href="#购买检查">购买检查</a>
            <a href="#同价位替代">替代机型</a>
          </nav>
        </div>
        <div class="camera-detail-guide-facts">
          <div><span>发布年份</span><strong>{year}</strong></div>
          <div><span>曝光方式</span><strong>{exposure}</strong></div>
          <div><span>卡口</span><strong>{frontmatter.mount ?? "待核验"}</strong></div>
          <div><span>重量</span><strong>{weight}</strong></div>
          <div><span>电池</span><strong>{frontmatter.battery ?? "待核验"}</strong></div>
          <div><span>推荐场景</span><strong>{scenes}</strong></div>
        </div>
      </section>
    </>
  )
}

export default (() => CameraDetailGuide) satisfies QuartzComponentConstructor

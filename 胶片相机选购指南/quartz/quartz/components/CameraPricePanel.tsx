import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

function number(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function money(value: number | null) {
  return value === null ? "待核价" : `¥${value.toLocaleString("zh-CN")}`
}

const CameraPricePanel: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const fm = (fileData.frontmatter ?? {}) as Record<string, any>
  if (fm.entity !== "camera" || Number(fm.detail_version ?? 0) !== 2) return null

  const min = number(fm.price_min)
  const typical = number(fm.price_typical)
  const max = number(fm.price_max)
  const status = String(fm.price_status ?? "待核价")
  const note = String(fm.price_note ?? "").trim()
  const condition = String(fm.price_condition ?? "仅机身，功能正常，普通使用成色").trim()
  const region = String(fm.price_region ?? "中国大陆二手市场").trim()
  const checkedAt = String(fm.price_checked_at ?? "待更新").trim()

  return (
    <section class="camera-price-panel" aria-label="二手参考价格">
      <style id="camera-price-panel-inline">{`
        .camera-price-panel{width:min(1180px,calc(100% - clamp(2rem,7vw,8rem)));margin:1rem auto 0;padding:1.25rem 1.4rem;display:grid;grid-template-columns:minmax(0,1.2fr) repeat(3,minmax(110px,.55fr));gap:1rem;align-items:center;color:#252620;background:#f0ece4;border:1px solid rgba(13,14,13,.13)}
        .camera-price-panel header p{margin:0 0 .35rem;color:#995b31;font-size:14px;font-weight:700}.camera-price-panel header h2{margin:0!important;padding:0!important;border:0!important;color:#1e1f1b!important;font-size:clamp(1.35rem,2vw,1.8rem)!important}.camera-price-panel header span{display:block;margin-top:.55rem;color:#62645d;font-size:14px;line-height:1.65}.camera-price-panel>div{padding-left:1rem;border-left:1px solid rgba(13,14,13,.12)}.camera-price-panel>div span{display:block;margin-bottom:.28rem;color:#777970;font-size:13px}.camera-price-panel>div strong{display:block;color:#22231f;font-size:18px}.camera-price-panel footer{grid-column:1/-1;padding-top:.85rem;border-top:1px solid rgba(13,14,13,.1);color:#666861;font-size:13px;line-height:1.65}.camera-price-panel footer strong{color:#454740}.camera-price-panel[data-status="暂停推荐"]{border-color:#a35d43}.camera-price-panel[data-status="待核价"]{background:#eee8dd}
        @media(max-width:820px){.camera-price-panel{grid-template-columns:repeat(3,minmax(0,1fr))}.camera-price-panel header{grid-column:1/-1}.camera-price-panel>div:first-of-type{padding-left:0;border-left:0}}
        @media(max-width:560px){.camera-price-panel{width:calc(100% - 2rem);grid-template-columns:1fr 1fr}.camera-price-panel>div:nth-of-type(3){grid-column:1/-1;padding-left:0;border-left:0}.camera-price-panel footer{font-size:12px}}
      `}</style>
      <header>
        <p>二手价格 · {status}</p>
        <h2>价格统一从维护表同步</h2>
        <span>{note || "价格用于筛选和比较，不代表具体成交价。"}</span>
      </header>
      <div><span>最低参考</span><strong>{money(min)}</strong></div>
      <div><span>典型价格</span><strong>{money(typical)}</strong></div>
      <div><span>最高参考</span><strong>{money(max)}</strong></div>
      <footer><strong>口径：</strong>{condition} · {region} · 核价月份 {checkedAt}</footer>
    </section>
  )
}

export default (() => CameraPricePanel) satisfies QuartzComponentConstructor

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { cameraPrice } from "./cameraPrice"

function money(value: number | null) {
  return value === null ? "待核价" : `¥${value.toLocaleString("zh-CN")}`
}

const CameraPricePanel: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const fm = (fileData.frontmatter ?? {}) as Record<string, any>
  if (fm.entity !== "camera" || Number(fm.detail_version ?? 0) !== 2) return null

  const min = cameraPrice(fm.price_min)
  const typical = cameraPrice(fm.price_typical)
  const max = cameraPrice(fm.price_max)
  const status = String(fm.price_status ?? "待核价")
  const note = String(fm.price_note ?? "").trim()
  const condition = String(fm.price_condition ?? "仅机身，功能正常，普通使用成色").trim()
  const region = String(fm.price_region ?? "中国大陆二手市场").trim()
  const checkedAt = String(fm.price_checked_at ?? "待更新").trim()

  return (
    <section class="camera-price-panel" data-status={status} aria-label="二手参考价格">
      <style id="camera-price-panel-inline">{`
        .camera-price-panel{width:min(940px,calc(100% - clamp(2rem,7vw,8rem)));margin:1.35rem auto 0;padding:1.45rem 1.55rem;color:#252620;background:#f0ece4;border:1px solid rgba(13,14,13,.13)}
        .camera-price-panel>header{position:static!important;width:auto!important;min-width:0!important;margin:0 0 1.15rem!important;padding:0 0 1rem!important;display:block!important;border:0!important;border-bottom:1px solid rgba(13,14,13,.11)!important;background:transparent!important}
        .camera-price-panel>header p{margin:0 0 .35rem;color:#995b31;font-size:14px;font-weight:700;letter-spacing:.02em}.camera-price-panel>header h2{margin:0!important;padding:0!important;border:0!important;color:#1e1f1b!important;font-size:clamp(1.45rem,2.2vw,2rem)!important;line-height:1.25!important;white-space:normal!important;writing-mode:horizontal-tb!important}.camera-price-panel>header span{display:block;max-width:720px;margin-top:.55rem;color:#62645d;font-size:14px;line-height:1.65}
        .camera-price-values{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border:1px solid rgba(13,14,13,.11);background:rgba(255,255,255,.2)}
        .camera-price-values>div{min-width:0;padding:1rem 1.15rem;border-right:1px solid rgba(13,14,13,.11)}.camera-price-values>div:last-child{border-right:0}.camera-price-values span{display:block;margin-bottom:.3rem;color:#777970;font-size:13px}.camera-price-values strong{display:block;color:#22231f;font-size:clamp(1.25rem,2vw,1.65rem);line-height:1.25;white-space:nowrap}
        .camera-price-panel>footer{margin-top:1rem;padding-top:.9rem;border-top:1px solid rgba(13,14,13,.1);color:#666861;font-size:13px;line-height:1.7}.camera-price-panel>footer strong{color:#454740}.camera-price-panel[data-status="暂停推荐"]{border-color:#a35d43}.camera-price-panel[data-status="待核价"]{background:#eee8dd}
        @media(max-width:720px){.camera-price-panel{width:calc(100% - 2rem);padding:1.2rem}.camera-price-values{grid-template-columns:1fr}.camera-price-values>div{border-right:0;border-bottom:1px solid rgba(13,14,13,.11)}.camera-price-values>div:last-child{border-bottom:0}.camera-price-panel>footer{font-size:12px}}
      `}</style>
      <header>
        <p>二手参考价 · {status}</p>
        <h2>当前市场参考区间</h2>
        <span>{note || "用于比较不同机型和预算分组，具体成交价仍以机况、版本和附件为准。"}</span>
      </header>
      <div class="camera-price-values">
        <div><span>合理低位</span><strong>{money(min)}</strong></div>
        <div><span>常见价格</span><strong>{money(typical)}</strong></div>
        <div><span>合理高位</span><strong>{money(max)}</strong></div>
      </div>
      <footer><strong>价格口径：</strong>{condition} · {region} · 核价月份 {checkedAt}</footer>
    </section>
  )
}

export default (() => CameraPricePanel) satisfies QuartzComponentConstructor

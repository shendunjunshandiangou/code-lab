import { QuartzComponent, QuartzComponentConstructor } from "./types"

const IconTuning: QuartzComponent = () => null

IconTuning.css = `
/* 图标只承担辅助识别，不与标题和图片争夺注意力 */
.portal-icon {
  width: 34px !important;
  height: 34px !important;
  color: rgba(117, 68, 33, 0.72) !important;
  opacity: 0.82;
}

.portal-icon svg,
.learn-icon svg {
  stroke-width: 1.35 !important;
}

.intent-grid .portal-icon,
.camera-route-grid .portal-icon,
.scene-grid .portal-icon,
.about-principle-grid .portal-icon,
.source-field-grid .portal-icon,
.contact-card-grid .portal-icon {
  width: 30px !important;
  height: 30px !important;
}

.intent-grid h3,
.camera-route-grid h3,
.about-principle-grid h3,
.source-field-grid h3 {
  margin-top: 1.15rem !important;
}

.scene-grid h3 {
  margin-top: 1.25rem !important;
}

.is-dark .portal-icon,
.video-topic-visual .portal-icon {
  color: rgba(200, 121, 63, 0.78) !important;
}

.camera-visual-image .portal-icon {
  width: 48px !important;
  height: 48px !important;
  color: rgba(240, 237, 230, 0.25) !important;
  opacity: 1;
}

.video-topic-visual .portal-icon {
  width: 30px !important;
  height: 30px !important;
}

/* 新手页章节图标去掉徽章式圆框，改成轻量行内提示 */
.learn-icon {
  width: 36px !important;
  height: 36px !important;
  flex: 0 0 36px !important;
  border: 0 !important;
  border-radius: 0 !important;
  color: rgba(117, 68, 33, 0.76) !important;
  background: transparent !important;
  opacity: 0.86;
}

.learn-icon svg {
  width: 27px !important;
  height: 27px !important;
}

.learn-section-heading {
  gap: 0.75rem !important;
}

.camera-type-top .learn-icon {
  width: 28px !important;
  height: 28px !important;
  flex-basis: 28px !important;
}

.camera-type-top .learn-icon svg {
  width: 22px !important;
  height: 22px !important;
}

.has-dark-background .learn-icon {
  color: rgba(200, 121, 63, 0.78) !important;
}

@media (max-width: 640px) {
  .portal-icon {
    width: 30px !important;
    height: 30px !important;
  }

  .learn-icon {
    width: 32px !important;
    height: 32px !important;
    flex-basis: 32px !important;
  }

  .learn-icon svg {
    width: 24px !important;
    height: 24px !important;
  }
}
`

export default (() => IconTuning) satisfies QuartzComponentConstructor

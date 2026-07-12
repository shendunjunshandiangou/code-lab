import { QuartzComponent, QuartzComponentConstructor } from "./types"

const iconTuningStyles = `
/* 图标只承担辅助识别，不与标题和图片争夺注意力 */
.portal-icon {
  width: 30px !important;
  height: 30px !important;
  min-width: 30px !important;
  min-height: 30px !important;
  max-width: 30px !important;
  max-height: 30px !important;
  flex: 0 0 30px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  overflow: hidden !important;
  color: rgba(117, 68, 33, 0.68) !important;
  opacity: 0.78;
  line-height: 1 !important;
  vertical-align: middle !important;
}

.portal-icon svg {
  width: 24px !important;
  height: 24px !important;
  min-width: 24px !important;
  min-height: 24px !important;
  max-width: 24px !important;
  max-height: 24px !important;
  display: block !important;
  flex: none !important;
  stroke-width: 1.3 !important;
}

.learn-icon svg {
  stroke-width: 1.3 !important;
}

.intent-grid .portal-icon,
.camera-route-grid .portal-icon,
.about-principle-grid .portal-icon,
.source-field-grid .portal-icon,
.contact-card-grid .portal-icon {
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  min-height: 28px !important;
  max-width: 28px !important;
  max-height: 28px !important;
  flex-basis: 28px !important;
}

.intent-grid .portal-icon svg,
.camera-route-grid .portal-icon svg,
.about-principle-grid .portal-icon svg,
.source-field-grid .portal-icon svg,
.contact-card-grid .portal-icon svg {
  width: 21px !important;
  height: 21px !important;
  min-width: 21px !important;
  min-height: 21px !important;
  max-width: 21px !important;
  max-height: 21px !important;
}

.intent-grid h3,
.camera-route-grid h3,
.about-principle-grid h3,
.source-field-grid h3 {
  margin-top: 1rem !important;
}

/* 使用场景卡片以文字为主，彻底隐藏装饰图标 */
.scene-grid .portal-icon,
.scene-grid .portal-icon svg {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  min-width: 0 !important;
  min-height: 0 !important;
  max-width: 0 !important;
  max-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  visibility: hidden !important;
}

.scene-grid h3 {
  margin-top: 0 !important;
}

.is-dark .portal-icon,
.video-topic-visual .portal-icon {
  color: rgba(200, 121, 63, 0.72) !important;
}

.camera-visual-image .portal-icon {
  width: 42px !important;
  height: 42px !important;
  min-width: 42px !important;
  min-height: 42px !important;
  max-width: 42px !important;
  max-height: 42px !important;
  flex-basis: 42px !important;
  color: rgba(240, 237, 230, 0.22) !important;
  opacity: 1;
}

.camera-visual-image .portal-icon svg {
  width: 34px !important;
  height: 34px !important;
  min-width: 34px !important;
  min-height: 34px !important;
  max-width: 34px !important;
  max-height: 34px !important;
}

.video-topic-visual .portal-icon {
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  min-height: 28px !important;
  max-width: 28px !important;
  max-height: 28px !important;
}

.video-topic-visual .portal-icon svg {
  width: 21px !important;
  height: 21px !important;
  min-width: 21px !important;
  min-height: 21px !important;
  max-width: 21px !important;
  max-height: 21px !important;
}

/* 新手页章节图标去掉徽章式圆框，改成轻量行内提示 */
.learn-icon {
  width: 34px !important;
  height: 34px !important;
  min-width: 34px !important;
  min-height: 34px !important;
  max-width: 34px !important;
  max-height: 34px !important;
  flex: 0 0 34px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  overflow: hidden !important;
  border: 0 !important;
  border-radius: 0 !important;
  color: rgba(117, 68, 33, 0.72) !important;
  background: transparent !important;
  opacity: 0.82;
}

.learn-icon svg {
  width: 25px !important;
  height: 25px !important;
  min-width: 25px !important;
  min-height: 25px !important;
  max-width: 25px !important;
  max-height: 25px !important;
  display: block !important;
  flex: none !important;
}

.learn-section-heading {
  gap: 0.7rem !important;
}

.camera-type-top .learn-icon {
  width: 26px !important;
  height: 26px !important;
  min-width: 26px !important;
  min-height: 26px !important;
  max-width: 26px !important;
  max-height: 26px !important;
  flex-basis: 26px !important;
}

.camera-type-top .learn-icon svg {
  width: 19px !important;
  height: 19px !important;
  min-width: 19px !important;
  min-height: 19px !important;
  max-width: 19px !important;
  max-height: 19px !important;
}

.has-dark-background .learn-icon {
  color: rgba(200, 121, 63, 0.72) !important;
}

@media (max-width: 640px) {
  .portal-icon {
    width: 26px !important;
    height: 26px !important;
    min-width: 26px !important;
    min-height: 26px !important;
    max-width: 26px !important;
    max-height: 26px !important;
    flex-basis: 26px !important;
  }

  .portal-icon svg {
    width: 20px !important;
    height: 20px !important;
    min-width: 20px !important;
    min-height: 20px !important;
    max-width: 20px !important;
    max-height: 20px !important;
  }

  .learn-icon {
    width: 30px !important;
    height: 30px !important;
    min-width: 30px !important;
    min-height: 30px !important;
    max-width: 30px !important;
    max-height: 30px !important;
    flex-basis: 30px !important;
  }

  .learn-icon svg {
    width: 22px !important;
    height: 22px !important;
    min-width: 22px !important;
    min-height: 22px !important;
    max-width: 22px !important;
    max-height: 22px !important;
  }
}
`

const IconTuning: QuartzComponent = () => (
  <style id="icon-tuning-inline">{iconTuningStyles}</style>
)

export default (() => IconTuning) satisfies QuartzComponentConstructor

import { QuartzComponent, QuartzComponentConstructor } from "./types"

const Readability: QuartzComponent = () => null

Readability.css = `
/* 提升辅助文字和界面文字的可读性，避免为了“高级感”过度缩小字号 */
.site-wordmark small {
  font-size: 0.68rem;
  line-height: 1.35;
}

.site-primary-nav a {
  font-size: 0.95rem;
}

.commercial-eyebrow,
.commercial-section-heading > p,
.commercial-section-heading > div > p,
.editorial-feature-copy > p,
.methodology-section > div:first-child > p {
  font-size: 0.84rem;
  line-height: 1.5;
  letter-spacing: 0.12em;
}

.commercial-button {
  font-size: 1rem;
}

.commercial-hero-stats span {
  font-size: 0.86rem;
  line-height: 1.5;
}

.commercial-hero-credit {
  font-size: 0.76rem;
  line-height: 1.55;
}

.commercial-section-heading > span,
.commercial-section-heading.is-split > span,
.editorial-feature-copy > span {
  font-size: 1rem;
}

.finder-controls legend {
  font-size: 0.88rem;
  line-height: 1.5;
}

.finder-option,
.finder-reset {
  font-size: 0.93rem;
}

.finder-card-copy p {
  font-size: 0.84rem;
  line-height: 1.5;
}

.finder-card-copy strong {
  font-size: 0.96rem;
}

.finder-card-copy > span {
  font-size: 1rem;
}

.finder-card-copy small,
.reading-path-list small,
.video-preview-grid small {
  font-size: 0.9rem;
  line-height: 1.6;
}

.reading-path-list p,
.methodology-grid p {
  font-size: 1rem;
  line-height: 1.8;
}

.video-preview-grid p {
  font-size: 0.84rem;
  line-height: 1.5;
}

.reader-breadcrumb,
.editorial-kicker,
.article-hero-meta,
.camera-hero-facts span {
  font-size: 0.88rem;
  line-height: 1.5;
}

.editorial-hero-media figcaption {
  font-size: 0.78rem;
  line-height: 1.6;
}

.center > article:not(.home-page) p,
.center > article:not(.home-page) li {
  font-size: 1.05rem;
}

.center > article:not(.home-page) table {
  font-size: 0.95rem;
}

.camera-detail .camera-verdict-grid strong,
.source-video-heading > p,
.bilibili-card-body p,
.editorial-disclosure span,
.site-footer-index {
  font-size: 0.84rem;
  line-height: 1.5;
}

.camera-detail .camera-verdict-grid span,
.source-video-heading > span,
.source-video-empty p,
.editorial-disclosure p,
.site-footer-brand p {
  font-size: 1rem;
}

.bilibili-card-body a,
.site-footer-links strong,
.site-footer-links a {
  font-size: 0.9rem;
}

.site-footer-bottom {
  font-size: 0.78rem;
  line-height: 1.5;
}

@media (max-width: 900px) {
  .commercial-hero-credit {
    font-size: 0.72rem;
  }

  .site-primary-nav a {
    font-size: 1rem;
  }
}
`

export default (() => Readability) satisfies QuartzComponentConstructor

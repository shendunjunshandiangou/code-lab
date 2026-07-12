import { QuartzComponent, QuartzComponentConstructor } from "./types"

const Readability: QuartzComponent = () => null

Readability.css = `
/* 以正常阅读为优先：辅助文字不再使用过小字号 */
.site-wordmark small {
  font-size: 13px;
  line-height: 1.35;
}

.site-primary-nav a {
  font-size: 16px;
}

.commercial-eyebrow,
.commercial-section-heading > p,
.commercial-section-heading > div > p,
.methodology-section > div:first-child > p,
.tutorial-heading > p,
.buying-guide-heading > p {
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.06em;
}

.commercial-button {
  min-height: 54px;
  padding: 0 1.6rem;
  font-size: 16px;
}

.commercial-hero-credit {
  font-size: 14px;
  line-height: 1.55;
}

.commercial-section-heading > span,
.commercial-section-heading.is-split > span {
  font-size: 17px;
  line-height: 1.85;
}

.finder-controls legend {
  font-size: 16px;
  line-height: 1.5;
}

.finder-option,
.finder-reset {
  min-height: 42px;
  font-size: 16px;
}

.finder-card-copy p {
  font-size: 15px;
  line-height: 1.5;
}

.finder-card-copy strong {
  font-size: 16px;
}

.finder-card-copy > span {
  font-size: 17px;
  line-height: 1.8;
}

.finder-card-copy small,
.video-preview-grid small {
  font-size: 16px;
  line-height: 1.6;
}

.methodology-grid p {
  font-size: 17px;
  line-height: 1.8;
}

.video-preview-grid p {
  font-size: 15px;
  line-height: 1.5;
}

.reader-breadcrumb,
.editorial-kicker,
.article-hero-meta,
.camera-hero-facts span {
  font-size: 15px;
  line-height: 1.5;
}

.editorial-hero-media figcaption {
  font-size: 14px;
  line-height: 1.6;
}

.center > article:not(.home-page) p,
.center > article:not(.home-page) li {
  font-size: 18px;
  line-height: 1.95;
}

.center > article:not(.home-page) table {
  font-size: 16px;
}

.camera-detail .camera-verdict-grid strong,
.source-video-heading > p,
.bilibili-card-body p,
.editorial-disclosure span,
.site-footer-index {
  font-size: 15px;
  line-height: 1.5;
}

.camera-detail .camera-verdict-grid span,
.source-video-heading > span,
.source-video-empty p,
.editorial-disclosure p,
.site-footer-brand p {
  font-size: 17px;
}

.bilibili-card-body a,
.site-footer-links strong,
.site-footer-links a {
  font-size: 16px;
}

.site-footer-bottom {
  font-size: 14px;
  line-height: 1.5;
}

/* 首屏：大图是主体，文字只负责明确网站用途 */
.commercial-hero {
  min-height: calc(100vh - 78px);
  align-items: center;
  background: #111210;
}

.commercial-hero-image {
  position: absolute;
  inset: 0;
  z-index: -3;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 48%;
  filter: saturate(0.78) contrast(1.04) brightness(0.82);
  transform: scale(1.01);
}

.commercial-hero-overlay {
  background:
    linear-gradient(90deg, rgba(7, 8, 7, 0.9) 0%, rgba(7, 8, 7, 0.68) 38%, rgba(7, 8, 7, 0.18) 72%),
    linear-gradient(180deg, rgba(7, 8, 7, 0.06) 42%, rgba(7, 8, 7, 0.76) 100%);
}

.commercial-hero-content {
  padding: clamp(5rem, 11vh, 9rem) 0 clamp(6rem, 12vh, 9rem);
}

.commercial-hero h1 {
  max-width: 850px;
  font-size: clamp(3.1rem, 6vw, 6.2rem);
  line-height: 1.08;
  letter-spacing: -0.045em;
}

.commercial-hero-content > p:not(.commercial-eyebrow) {
  max-width: 720px;
  font-size: clamp(18px, 1.45vw, 22px);
  line-height: 1.85;
}

.hero-topic-links {
  margin-top: 2.4rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem 1.5rem;
}

.hero-topic-links a {
  color: rgba(240, 237, 230, 0.88) !important;
  background: transparent !important;
  font-size: 16px;
  text-decoration: none;
  border-bottom: 1px solid rgba(240, 237, 230, 0.35);
}

/* 教程区：从暗色封面自然切换到易阅读的暖白内容 */
.tutorial-section {
  width: 100%;
  background: var(--site-paper);
  color: var(--site-black);
}

.tutorial-section-inner {
  width: min(var(--site-width), calc(100% - clamp(2rem, 8vw, 10rem)));
  margin: 0 auto;
  padding: clamp(5rem, 9vw, 9rem) 0;
}

.tutorial-heading {
  max-width: 1050px;
  margin-bottom: clamp(3rem, 5vw, 5rem);
}

.tutorial-heading > p,
.buying-guide-heading > p {
  margin: 0 0 1rem;
  color: #8b4f29;
  font-weight: 700;
}

.tutorial-heading h2,
.buying-guide-heading h2 {
  margin: 0;
  color: var(--site-black);
  font-size: clamp(2.3rem, 4.3vw, 4.8rem);
  line-height: 1.15;
  font-weight: 540;
}

.tutorial-heading > span {
  display: block;
  max-width: 850px;
  margin-top: 1.5rem;
  color: #50524d;
  font-size: 18px;
  line-height: 1.85;
}

.tutorial-step-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  border-top: 1px solid var(--site-line-light);
  border-left: 1px solid var(--site-line-light);
}

.tutorial-step-grid > a {
  min-height: 330px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  border-right: 1px solid var(--site-line-light);
  border-bottom: 1px solid var(--site-line-light);
  color: var(--site-black) !important;
  background: transparent !important;
  text-decoration: none;
  transition: background 180ms ease, transform 180ms ease;
}

.tutorial-step-grid > a:hover {
  background: #e4dfd5 !important;
  transform: translateY(-3px);
}

.tutorial-step-number {
  color: #9a5b32;
  font-family: "Noto Serif SC", serif;
  font-size: 22px;
}

.tutorial-step-grid h3 {
  margin: 0;
  color: var(--site-black);
  font-size: 26px;
  line-height: 1.3;
  font-weight: 560;
}

.tutorial-step-grid p {
  margin: 1rem 0 0;
  color: #555750;
  font-size: 17px;
  line-height: 1.8;
}

.tutorial-step-grid strong {
  color: #754421;
  font-size: 16px;
  font-weight: 600;
}

/* 选购基础说明：教程卡片，不做广告式大图模块 */
.buying-guide-section {
  width: 100%;
  background: #ded9cf;
  color: var(--site-black);
}

.buying-guide-inner {
  width: min(var(--site-width), calc(100% - clamp(2rem, 8vw, 10rem)));
  margin: 0 auto;
  padding: clamp(5rem, 9vw, 9rem) 0;
}

.buying-guide-heading {
  max-width: 980px;
}

.buying-guide-grid {
  margin-top: 4rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--site-line-light);
  border-left: 1px solid var(--site-line-light);
}

.buying-guide-grid article {
  min-height: 300px;
  padding: clamp(2rem, 3vw, 3.2rem);
  border-right: 1px solid var(--site-line-light);
  border-bottom: 1px solid var(--site-line-light);
}

.buying-guide-grid article > span {
  color: #9a5b32;
  font-family: "Noto Serif SC", serif;
  font-size: 20px;
}

.buying-guide-grid h3 {
  margin: 3rem 0 1rem;
  color: var(--site-black);
  font-size: 30px;
  line-height: 1.25;
  font-weight: 560;
}

.buying-guide-grid p {
  margin: 0;
  color: #50524d;
  font-size: 17px;
  line-height: 1.85;
}

.buying-guide-link {
  display: inline-flex;
  margin-top: 2.5rem;
  color: var(--site-black) !important;
  background: transparent !important;
  font-size: 17px;
  font-weight: 600;
}

@media (max-width: 1200px) {
  .tutorial-step-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .commercial-hero {
    min-height: 760px;
  }

  .commercial-hero-image {
    object-position: 62% center;
  }

  .commercial-hero-overlay {
    background:
      linear-gradient(90deg, rgba(7, 8, 7, 0.86), rgba(7, 8, 7, 0.52)),
      linear-gradient(180deg, rgba(7, 8, 7, 0.08), rgba(7, 8, 7, 0.82));
  }

  .tutorial-step-grid,
  .buying-guide-grid {
    grid-template-columns: 1fr;
  }

  .tutorial-step-grid > a,
  .buying-guide-grid article {
    min-height: auto;
  }

  .site-primary-nav a {
    font-size: 17px;
  }
}
`

export default (() => Readability) satisfies QuartzComponentConstructor

import { QuartzComponent, QuartzComponentConstructor } from "./types"

const ContentLayout: QuartzComponent = () => null

ContentLayout.css = `
/* 普通内容页不再使用整屏式 Hero，首屏直接出现标题、摘要和正文 */
.compact-page-intro {
  width: 100%;
  padding: clamp(2.2rem, 4.5vw, 4.5rem) clamp(1.2rem, 4vw, 4rem) clamp(2rem, 4vw, 3.5rem);
  border-bottom: 1px solid rgba(13, 14, 13, 0.14);
  color: var(--site-black);
  background: var(--site-paper);
}

.compact-page-intro-inner {
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2.5rem;
  align-items: center;
}

.compact-page-intro-inner.has-thumbnail {
  grid-template-columns: minmax(0, 1fr) minmax(280px, 390px);
}

.compact-page-intro .reader-breadcrumb {
  margin: 0 0 1.2rem;
  color: #74766e;
}

.compact-page-intro .reader-breadcrumb a {
  color: #686a62 !important;
}

.content-section-label {
  margin: 0;
  color: #8b4f29;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.compact-page-intro h1 {
  max-width: 930px;
  margin: 0.65rem 0 0;
  color: var(--site-black);
  font-size: clamp(2.4rem, 4.4vw, 4.7rem);
  line-height: 1.12;
  font-weight: 560;
  letter-spacing: -0.045em;
}

.compact-page-description {
  max-width: 820px;
  margin: 1.1rem 0 0;
  color: #555750;
  font-size: 18px;
  line-height: 1.8;
}

.compact-page-intro .article-hero-meta {
  margin-top: 1.4rem;
  padding-top: 1rem;
  color: #777970;
  border-top-color: rgba(13, 14, 13, 0.12);
}

.compact-page-thumbnail {
  margin: 0;
}

.compact-page-thumbnail img {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  filter: saturate(0.78) contrast(1.03);
}

.compact-page-thumbnail figcaption {
  margin-top: 0.55rem;
  color: #777970;
  font-size: 14px;
  line-height: 1.5;
}

.compact-page-thumbnail figcaption a,
.compact-page-thumbnail figcaption span {
  color: #6a6c64 !important;
}

/* 正文紧跟页头，不再在前面留出大块空白 */
.center > article:not(.home-page):not(.learn-guide-page) {
  padding-top: clamp(2.5rem, 5vw, 4.5rem);
  padding-bottom: clamp(4rem, 7vw, 7rem);
}

.center > article:not(.home-page):not(.learn-guide-page) h2:first-of-type {
  margin-top: 1rem;
}

/* 相机详情仍保留产品图和关键参数，但压缩到内容型首屏 */
.camera-editorial-hero {
  padding-top: clamp(2.5rem, 5vw, 5rem);
  padding-bottom: clamp(2.5rem, 5vw, 5rem);
}

.camera-editorial-hero .editorial-hero-inner {
  width: min(1280px, 100%);
  grid-template-columns: minmax(0, 1fr) minmax(360px, 520px);
  gap: clamp(2.5rem, 6vw, 6rem);
}

.camera-editorial-hero .reader-breadcrumb {
  margin-bottom: 1.4rem;
}

.camera-editorial-hero h1 {
  font-size: clamp(2.8rem, 5vw, 5.5rem);
  line-height: 1.08;
}

.camera-editorial-hero .editorial-deck {
  margin-top: 1.3rem;
  font-size: 18px;
  line-height: 1.8;
}

.camera-editorial-hero .camera-hero-facts {
  margin-top: 1.8rem;
  padding-top: 1.1rem;
}

.camera-editorial-hero .editorial-hero-media.has-image,
.camera-editorial-hero .editorial-hero-media.is-placeholder {
  aspect-ratio: 4 / 3;
}

.camera-editorial-hero .content-section-label {
  color: var(--site-orange);
}

@media (max-width: 900px) {
  .compact-page-intro-inner.has-thumbnail,
  .camera-editorial-hero .editorial-hero-inner {
    grid-template-columns: 1fr;
  }

  .compact-page-thumbnail {
    order: -1;
  }

  .compact-page-thumbnail img,
  .camera-editorial-hero .editorial-hero-media.has-image,
  .camera-editorial-hero .editorial-hero-media.is-placeholder {
    aspect-ratio: 16 / 9;
  }

  .compact-page-intro {
    padding-top: 2rem;
  }

  .compact-page-intro h1 {
    font-size: clamp(2.2rem, 10vw, 3.7rem);
  }
}
`

export default (() => ContentLayout) satisfies QuartzComponentConstructor

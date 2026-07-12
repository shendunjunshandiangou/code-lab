import { QuartzComponent, QuartzComponentConstructor } from "./types"

const buyingGuideInlineStyles = `
/* 价格选机页关键布局随 HTML 输出，避免旧静态 CSS 缓存导致单列巨图 */
.center > article.buying-guide-page {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  color: #23241f !important;
  background: #f4f1ea !important;
}

.buying-guide-page,
.buying-guide-page * {
  box-sizing: border-box;
}

.buying-guide-page a {
  background-image: none !important;
  text-decoration: none !important;
}

.buying-guide-header {
  width: min(1320px, calc(100% - clamp(2rem, 7vw, 9rem))) !important;
  margin: 0 auto !important;
  padding: clamp(3rem, 6vw, 5.5rem) 0 clamp(2.5rem, 5vw, 4.5rem) !important;
  display: grid !important;
  grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.58fr) !important;
  gap: clamp(2rem, 6vw, 6rem) !important;
  align-items: center !important;
}

.buying-guide-header h1 {
  margin: 0 !important;
  max-width: 900px !important;
  font-size: clamp(2.65rem, 5vw, 5.15rem) !important;
  line-height: 1.08 !important;
  font-weight: 560 !important;
  letter-spacing: -0.05em !important;
}

.buying-guide-header > div > p {
  margin: 0 0 0.9rem !important;
  color: #92542d !important;
  font-size: 16px !important;
  font-weight: 700 !important;
}

.buying-guide-header > div > span {
  display: block !important;
  max-width: 800px !important;
  margin-top: 1.2rem !important;
  color: #575951 !important;
  font-size: 18px !important;
  line-height: 1.8 !important;
}

.buying-guide-header figure {
  margin: 0 !important;
}

.buying-guide-header img {
  width: 100% !important;
  height: auto !important;
  max-height: 360px !important;
  aspect-ratio: 4 / 3 !important;
  display: block !important;
  object-fit: cover !important;
}

.buying-guide-header figcaption {
  margin-top: 0.55rem !important;
  color: #74766e !important;
  font-size: 13px !important;
  line-height: 1.5 !important;
}

.buying-price-nav {
  width: min(1320px, calc(100% - clamp(2rem, 7vw, 9rem))) !important;
  margin: 0 auto clamp(2rem, 4vw, 3.5rem) !important;
  display: grid !important;
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  border-top: 1px solid rgba(13, 14, 13, 0.16) !important;
  border-left: 1px solid rgba(13, 14, 13, 0.16) !important;
}

.buying-price-nav a {
  min-height: 108px !important;
  padding: 1.2rem 1.3rem !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  color: #23241f !important;
  border-right: 1px solid rgba(13, 14, 13, 0.16) !important;
  border-bottom: 1px solid rgba(13, 14, 13, 0.16) !important;
}

.buying-price-nav span {
  font-size: clamp(1.25rem, 2vw, 1.75rem) !important;
  font-weight: 600 !important;
}

.buying-price-nav small {
  margin-top: 0.4rem !important;
  color: #6b6d65 !important;
  font-size: 14px !important;
  line-height: 1.45 !important;
}

.buying-budget-note {
  width: min(1320px, calc(100% - clamp(2rem, 7vw, 9rem))) !important;
  margin: 0 auto clamp(3.5rem, 7vw, 6rem) !important;
  padding: 1.2rem 1.4rem !important;
  display: grid !important;
  grid-template-columns: minmax(220px, 0.4fr) minmax(0, 1fr) !important;
  gap: 1.4rem !important;
  border-left: 3px solid #92542d !important;
  background: #e5e0d7 !important;
}

.buying-budget-note strong {
  font-size: 17px !important;
}

.buying-budget-note span {
  color: #555750 !important;
  font-size: 16px !important;
  line-height: 1.72 !important;
}

.buying-price-section {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: clamp(4rem, 7vw, 7rem) max(clamp(1rem, 3.5vw, 4.5rem), calc((100% - 1320px) / 2)) !important;
}

.buying-price-section.is-soft {
  background: #ded9cf !important;
}

.buying-price-heading {
  margin-bottom: clamp(2rem, 4vw, 3.5rem) !important;
  display: grid !important;
  grid-template-columns: minmax(0, 0.85fr) minmax(300px, 0.75fr) !important;
  gap: clamp(2rem, 5vw, 5rem) !important;
  align-items: end !important;
}

.buying-price-heading p {
  margin: 0 0 0.65rem !important;
  color: #92542d !important;
  font-size: 16px !important;
  font-weight: 700 !important;
}

.buying-price-heading h2 {
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  font-size: clamp(2rem, 4vw, 4rem) !important;
  line-height: 1.12 !important;
  font-weight: 560 !important;
}

.buying-price-heading > span {
  color: #575951 !important;
  font-size: 17px !important;
  line-height: 1.78 !important;
}

.buying-product-grid {
  width: 100% !important;
  display: grid !important;
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  gap: 1rem !important;
  align-items: stretch !important;
}

.buying-product-card {
  min-width: 0 !important;
  width: auto !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  color: #23241f !important;
  background: #f4f1ea !important;
  border: 1px solid rgba(13, 14, 13, 0.14) !important;
  overflow: hidden !important;
}

.buying-product-media {
  position: relative !important;
  width: 100% !important;
  height: auto !important;
  max-height: 260px !important;
  aspect-ratio: 4 / 3 !important;
  overflow: hidden !important;
  background: #d7d2c9 !important;
}

.buying-product-media img {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 260px !important;
  margin: 0 !important;
  display: block !important;
  object-fit: cover !important;
}

.buying-product-media.is-placeholder {
  display: grid !important;
  place-items: center !important;
}

.buying-product-media.is-placeholder > div {
  padding: 1.2rem !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  text-align: center !important;
}

.buying-product-media > em {
  position: absolute !important;
  top: 0.75rem !important;
  left: 0.75rem !important;
  padding: 0.3rem 0.5rem !important;
  color: #f5f0e7 !important;
  background: rgba(23, 24, 21, 0.84) !important;
  font-size: 12px !important;
  font-style: normal !important;
}

.buying-product-body {
  min-height: 310px !important;
  padding: 1.2rem !important;
  display: flex !important;
  flex-direction: column !important;
}

.buying-product-body > p {
  margin: 0 !important;
  color: #92542d !important;
  font-size: 13px !important;
  line-height: 1.45 !important;
}

.buying-product-body h3 {
  margin: 0.5rem 0 0 !important;
  font-size: clamp(1.35rem, 2vw, 1.75rem) !important;
  line-height: 1.24 !important;
}

.buying-product-facts {
  margin-top: 0.8rem !important;
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 0.35rem !important;
}

.buying-product-facts span {
  padding: 0.24rem 0.45rem !important;
  color: #62645d !important;
  background: rgba(13, 14, 13, 0.055) !important;
  font-size: 12px !important;
}

.buying-product-price {
  margin-top: 1rem !important;
  color: #8d4a22 !important;
  font-size: 1.35rem !important;
  font-weight: 650 !important;
}

.buying-product-summary {
  margin-top: 0.75rem !important;
  color: #565850 !important;
  font-size: 14px !important;
  line-height: 1.65 !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 3 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
}

.buying-product-body > small {
  margin-top: auto !important;
  padding-top: 1rem !important;
  color: #704425 !important;
  font-size: 13px !important;
}

.buying-view-all {
  display: inline-block !important;
  margin-top: 1.5rem !important;
  color: #704425 !important;
  font-weight: 700 !important;
}

.buying-final-note {
  width: min(1320px, calc(100% - clamp(2rem, 7vw, 9rem))) !important;
  margin: clamp(4rem, 8vw, 7rem) auto !important;
  padding: clamp(2rem, 4vw, 3.5rem) !important;
  display: grid !important;
  grid-template-columns: minmax(250px, 0.65fr) minmax(0, 1fr) !important;
  gap: 2rem !important;
  background: #23241f !important;
  color: #f3eee5 !important;
}

.buying-final-note h2 {
  margin: 0.35rem 0 0 !important;
  color: #f3eee5 !important;
}

.buying-final-note > span {
  font-size: 16px !important;
  line-height: 1.75 !important;
}

.buying-final-note > div:last-child {
  grid-column: 1 / -1 !important;
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 0.75rem !important;
}

.buying-final-note a {
  padding: 0.75rem 1rem !important;
  color: #f3eee5 !important;
  border: 1px solid rgba(243, 238, 229, 0.35) !important;
}

@media (max-width: 1100px) {
  .buying-product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }

  .buying-product-media,
  .buying-product-media img {
    max-height: 320px !important;
  }
}

@media (max-width: 760px) {
  .buying-guide-header,
  .buying-price-heading,
  .buying-budget-note,
  .buying-final-note {
    grid-template-columns: 1fr !important;
  }

  .buying-guide-header figure {
    order: -1 !important;
  }

  .buying-price-nav {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }

  .buying-product-grid {
    grid-template-columns: 1fr !important;
  }

  .buying-product-card {
    max-width: 520px !important;
    margin-inline: auto !important;
  }

  .buying-product-media,
  .buying-product-media img {
    max-height: 390px !important;
  }
}
`

const BuyingGuideInlineStyles: QuartzComponent = () => (
  <style id="buying-guide-inline-styles">{buyingGuideInlineStyles}</style>
)

export default (() => BuyingGuideInlineStyles) satisfies QuartzComponentConstructor

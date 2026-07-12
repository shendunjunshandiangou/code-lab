import { joinSegments } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

function absoluteUrl(baseUrl: string, value: string) {
  if (/^https?:\/\//i.test(value)) return value
  return joinSegments(`https://${baseUrl}`, value.replace(/^\.\//, ""))
}

function textList(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).join("、")
  return String(value ?? "").trim()
}

const CameraStructuredData: QuartzComponent = ({ cfg, fileData }: QuartzComponentProps) => {
  const frontmatter = (fileData.frontmatter ?? {}) as Record<string, any>
  if (frontmatter.entity !== "camera" || !fileData.slug || !cfg.baseUrl) return null

  const pageUrl = joinSegments(`https://${cfg.baseUrl}`, fileData.slug)
  const title = String(frontmatter.title ?? frontmatter.model ?? "胶片相机")
  const brand = String(frontmatter.brand ?? "").trim()
  const image = String(frontmatter.hero_image ?? "").trim()
  const lowPrice = Number(frontmatter.price_min)
  const highPrice = Number(frontmatter.price_max)
  const hasLowPrice = Number.isFinite(lowPrice)
  const hasHighPrice = Number.isFinite(highPrice)

  const product: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    url: pageUrl,
    description: String(frontmatter.description ?? frontmatter.tagline ?? "").trim(),
    category: String(frontmatter.camera_type ?? "胶片相机"),
    ...(brand ? { brand: { "@type": "Brand", name: brand } } : {}),
    ...(image ? { image: absoluteUrl(cfg.baseUrl, image) } : {}),
    additionalProperty: [
      ["画幅", frontmatter.format],
      ["对焦方式", frontmatter.focus],
      ["曝光方式", textList(frontmatter.exposure_modes)],
      ["卡口", frontmatter.mount],
      ["发布年份", frontmatter.release_year],
      ["新手定位", frontmatter.beginner_level],
    ]
      .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "")
      .map(([name, value]) => ({ "@type": "PropertyValue", name, value: String(value) })),
  }

  if (hasLowPrice || hasHighPrice) {
    product.offers = {
      "@type": "AggregateOffer",
      priceCurrency: String(frontmatter.price_currency ?? "CNY"),
      ...(hasLowPrice ? { lowPrice } : {}),
      ...(hasHighPrice ? { highPrice } : {}),
      url: pageUrl,
    }
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首页",
        item: `https://${cfg.baseUrl}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "相机图鉴",
        item: joinSegments(`https://${cfg.baseUrl}`, "cameras"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: pageUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  )
}

export default (() => CameraStructuredData) satisfies QuartzComponentConstructor

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/knowledgePage.scss"

type KnowledgeArticle = {
  index: string
  title: string
  description: string
  label: string
  href: string
}

type KnowledgeSection = {
  eyebrow: string
  title: string
  description: string
  articles: KnowledgeArticle[]
}

const knowledgeSections: KnowledgeSection[] = [
  {
    eyebrow: "UNDERSTAND THE CAMERA",
    title: "先建立相机系统概念",
    description: "从操作方式、机身类型和镜头卡口开始，理解一台相机为什么适合你。",
    articles: [
      {
        index: "01",
        title: "相机类型详解",
        description: "傻瓜机、自动单反、机械单反、旁轴与中画幅分别怎样工作。",
        label: "类型与操作",
        href: "./04_knowledge/知识百科/01-相机类型详解",
      },
      {
        index: "02",
        title: "品牌系统速查",
        description: "看懂主流品牌、镜头卡口和系统兼容关系，避免买错镜头。",
        label: "品牌与卡口",
        href: "./04_knowledge/知识百科/02-品牌系统速查",
      },
      {
        index: "03",
        title: "推荐机型大全",
        description: "按操作门槛、使用场景和预算，快速建立候选机型清单。",
        label: "机型地图",
        href: "./04_knowledge/知识百科/03-推荐机型大全",
      },
    ],
  },
  {
    eyebrow: "FROM FILM TO FRAME",
    title: "从胶卷走到第一张照片",
    description: "胶卷、曝光、装卷、回卷、冲洗和扫描，共同决定最后拿到的画面。",
    articles: [
      {
        index: "04",
        title: "胶卷完全指南",
        description: "理解彩负、黑白、反转片和 ISO，并按光线与场景选择胶卷。",
        label: "胶卷与 ISO",
        href: "./04_knowledge/知识百科/04-胶卷完全指南",
      },
      {
        index: "05",
        title: "从装卷到出片",
        description: "完整走过装卷、测光、拍摄、回卷、冲洗和扫描的实际流程。",
        label: "完整流程",
        href: "./04_knowledge/知识百科/05-从装卷到出片",
      },
      {
        index: "06",
        title: "为什么要拍胶片",
        description: "了解胶片真正带来的体验、限制和持续成本，再决定是否开始。",
        label: "体验与取舍",
        href: "./04_knowledge/知识百科/06-为什么要拍胶片",
      },
    ],
  },
  {
    eyebrow: "BUY WITH A METHOD",
    title: "带着方法选购与继续学习",
    description: "把热门型号、二手风险和真实需求分开，减少冲动购买与无效折腾。",
    articles: [
      {
        index: "07",
        title: "新手避雷手册",
        description: "识别溢价、故障、成色话术和不适合第一次购买的高风险选择。",
        label: "风险排查",
        href: "./04_knowledge/知识百科/07-新手避雷手册",
      },
      {
        index: "08",
        title: "选购方法论",
        description: "从需求和预算出发建立判断顺序，而不是直接追逐热门机型。",
        label: "购买决策",
        href: "./04_knowledge/知识百科/08-选购方法论",
      },
      {
        index: "09",
        title: "继续学习",
        description: "从基础入门进入测光、构图、冲扫与长期拍摄的下一阶段。",
        label: "进阶路径",
        href: "./04_knowledge/知识百科/09-继续学习",
      },
    ],
  },
]

const KnowledgePage: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (fileData.slug !== "encyclopedia") return null

  return (
    <article class="knowledge-hub">
      <header class="knowledge-hero">
        <div class="knowledge-hero-copy">
          <p class="knowledge-kicker">CAMERA ENCYCLOPEDIA · 相机百科</p>
          <h1>把零散知识，连成一套清楚的胶片摄影地图。</h1>
          <p class="knowledge-intro">
            不用在文件目录里寻找文章。这里把相机类型、品牌系统、胶卷、拍摄流程和选购方法重新集中到一个入口，既可以按顺序读，也可以直接进入现在遇到的问题。
          </p>
          <div class="knowledge-hero-actions">
            <a class="knowledge-primary-action" href="#knowledge-sections">浏览全部专题</a>
            <a href="./learn">第一次拍胶片，从新手入门开始</a>
          </div>
        </div>
        <div class="knowledge-hero-index" aria-label="百科内容数量">
          <strong>09</strong>
          <span>系统专题</span>
          <small>覆盖 68 个基础知识点</small>
        </div>
      </header>

      <main id="knowledge-sections" class="knowledge-sections">
        {knowledgeSections.map((section, sectionIndex) => (
          <section class="knowledge-section">
            <header class="knowledge-section-heading">
              <span>{String(sectionIndex + 1).padStart(2, "0")}</span>
              <div>
                <p>{section.eyebrow}</p>
                <h2>{section.title}</h2>
                <small>{section.description}</small>
              </div>
            </header>
            <div class="knowledge-card-grid">
              {section.articles.map((article) => (
                <a class="knowledge-card" href={article.href}>
                  <div class="knowledge-card-top">
                    <span>{article.index}</span>
                    <small>{article.label}</small>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <strong aria-hidden="true">阅读专题 <span>→</span></strong>
                </a>
              ))}
            </div>
          </section>
        ))}
      </main>

      <aside class="knowledge-next">
        <div>
          <p>已经理解基础知识？</p>
          <h2>把知识变成一台真正适合你的相机。</h2>
        </div>
        <nav aria-label="百科相关入口">
          <a href="./buying">按预算帮我选相机</a>
          <a href="./cameras">浏览完整相机图鉴</a>
          <a href="./film">查看胶卷与成像</a>
        </nav>
      </aside>
    </article>
  )
}

KnowledgePage.css = style

export default (() => KnowledgePage) satisfies QuartzComponentConstructor

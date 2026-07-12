// @ts-ignore
import homeScript from "./scripts/commercialHome.inline"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

const cameras = [
  {
    name: "尼康 FE",
    meta: "电子单反 · 光圈优先",
    price: "¥500～800",
    reason: "保留手动操作，又用 A 档降低曝光门槛，是温和而完整的入门方式。",
    href: "./cameras/nikon-fe",
    image:
      "./static/images/library/nikon-fe-workshop-cologne-06-cropped-fee376ba.jpg",
    budget: "low,mid",
    autonomy: "auto-exposure,manual",
    scene: "daily,street,learn",
    format: "135",
  },
  {
    name: "奥林巴斯 mju-1",
    meta: "自动便携相机 · 随身记录",
    price: "¥400～900",
    reason: "体积小、操作直接，适合旅行和生活记录，不必承担热门机型的高溢价。",
    href: "./cameras/olympus-mju-1",
    image: "",
    budget: "low,mid",
    autonomy: "auto,autofocus",
    scene: "daily,travel",
    format: "135",
  },
  {
    name: "尼康 F-601",
    meta: "自动对焦单反 · 高性价比",
    price: "¥200～600",
    reason: "操作接近现代相机，自动对焦和多种曝光模式能明显降低第一次使用的压力。",
    href: "./cameras/nikon-f-601",
    image:
      "./static/images/library/nikon-f601-n6006-cropped-jpg-533c0aca.jpg",
    budget: "low",
    autonomy: "autofocus,auto-exposure",
    scene: "daily,travel,portrait",
    format: "135",
  },
  {
    name: "宾得 K1000",
    meta: "全机械单反 · 摄影学习",
    price: "¥800～1500",
    reason: "结构简单、操作直接，适合真正想理解光圈、快门和测光关系的人。",
    href: "./cameras/pentax-k1000",
    image: "./static/images/library/pentax-k1000-d0157f0d.jpg",
    budget: "mid",
    autonomy: "manual",
    scene: "street,learn,collection",
    format: "135",
  },
  {
    name: "佳能 AE-1",
    meta: "电子单反 · 快门优先",
    price: "¥800～1500",
    reason: "经典外形、FD 镜头体系和自动曝光，适合喜欢传统单反但不想完全手动的人。",
    href: "./cameras/canon-ae-1",
    image: "",
    budget: "mid",
    autonomy: "auto-exposure,manual",
    scene: "daily,portrait,learn",
    format: "135",
  },
  {
    name: "奥林巴斯 OM-1",
    meta: "全机械单反 · 小型系统",
    price: "¥1000～1800",
    reason: "机身紧凑、取景体验优秀，适合在意携带感又希望认真学习手动摄影的人。",
    href: "./cameras/olympus-om-1",
    image: "",
    budget: "mid,high",
    autonomy: "manual",
    scene: "travel,street,learn",
    format: "135",
  },
]

const learningPath = [
  {
    number: "01",
    title: "胶片相机是什么",
    copy: "先理解胶片如何记录光线，以及它和数码相机最根本的区别。",
    time: "约 5 分钟",
    href: "./04_knowledge/科普入门/01-胶片相机到底是什么",
  },
  {
    number: "02",
    title: "胶卷、冲洗和扫描",
    copy: "了解按下快门之后还会发生什么，以及照片为什么不能马上看到。",
    time: "约 8 分钟",
    href: "./film",
  },
  {
    number: "03",
    title: "相机类型与操作方式",
    copy: "分清自动便携相机、自动对焦单反和全机械单反分别适合谁。",
    time: "约 8 分钟",
    href: "./04_knowledge/知识百科/01-相机类型详解",
  },
  {
    number: "04",
    title: "预算、场景与机型选择",
    copy: "结合完整预算、携带需求、对焦方式和拍摄场景缩小范围。",
    time: "开始选购",
    href: "#quick-finder",
  },
  {
    number: "05",
    title: "验机与第一卷拍摄",
    copy: "检查二手相机状态，再完成装卷、拍摄、回卷和送洗。",
    time: "购买与使用",
    href: "./04_knowledge/知识百科/05-从装卷到出片",
  },
]

const videoTopics = [
  ["01", "零基础", "胶片相机到底是什么？"],
  ["02", "选购入门", "第一台胶片相机应该怎样选？"],
  ["03", "二手验机", "拿到相机后，应该检查哪些地方？"],
]

function HomePage({ fileData }: QuartzComponentProps) {
  if (fileData.slug !== "index") return null

  return (
    <div class="commercial-home">
      <section class="commercial-hero">
        <img
          class="commercial-hero-image"
          src="./static/images/library/nikon-fm2-et-nikkor-50mm-f1-8-a9fafbbf.jpg"
          alt="木桌上的尼康 FM2 胶片相机"
          loading="eager"
          decoding="async"
        />
        <div class="commercial-hero-overlay"></div>
        <div class="commercial-hero-content">
          <p class="commercial-eyebrow">从零开始认识胶片摄影</p>
          <h1>胶片相机入门与选购指南</h1>
          <p>
            从胶片、相机类型和使用成本开始，帮助你一步步理解这种拍摄方式，并选到适合自己的第一台胶片相机。
          </p>
          <div class="commercial-hero-actions">
            <a class="commercial-button is-primary" href="./learn">
              开始学习
            </a>
            <a class="commercial-button is-ghost" href="./buying">
              查看选购指南
            </a>
          </div>
          <div class="hero-topic-links" aria-label="网站主要内容">
            <a href="./learn">入门知识</a>
            <a href="./buying">选购流程</a>
            <a href="./cameras">相机图鉴</a>
            <a href="./film">胶卷与冲扫</a>
          </div>
        </div>
        <p class="commercial-hero-credit">
          Nikon FM2 · 摄影：Patrick Dehais · Wikimedia Commons。首屏图片用于基础版本视觉展示。
        </p>
      </section>

      <section class="tutorial-section">
        <div class="tutorial-section-inner">
          <div class="tutorial-heading">
            <p>新手学习路径</p>
            <h2>第一次接触胶片相机，建议按这个顺序开始。</h2>
            <span>
              不需要先记参数。先理解胶片摄影的完整流程，再判断自己需要什么类型的相机，最后进入具体机型选择。
            </span>
          </div>
          <div class="tutorial-step-grid">
            {learningPath.map(({ number, title, copy, time, href }) => (
              <a href={href}>
                <span class="tutorial-step-number">{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
                <strong>{time} →</strong>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section class="home-commercial-section quick-finder" id="quick-finder">
        <div class="commercial-section-heading is-split">
          <div>
            <p>快速选机</p>
            <h2>已经了解基础知识，可以从这里缩小机型范围。</h2>
          </div>
          <span>根据预算、操作方式、主要场景和画幅筛选，再进入详情页查看优缺点、验机重点和同价位替代。</span>
        </div>

        <div class="finder-layout">
          <div class="finder-controls">
            <fieldset>
              <legend>01 / 完整预算</legend>
              <div class="finder-options">
                <button class="finder-option" data-group="budget" data-value="all" aria-pressed="true">
                  不限
                </button>
                <button class="finder-option" data-group="budget" data-value="low" aria-pressed="false">
                  500 元以内
                </button>
                <button class="finder-option" data-group="budget" data-value="mid" aria-pressed="false">
                  500～1500 元
                </button>
                <button class="finder-option" data-group="budget" data-value="high" aria-pressed="false">
                  1500 元以上
                </button>
              </div>
            </fieldset>

            <fieldset>
              <legend>02 / 操作方式</legend>
              <div class="finder-options">
                <button class="finder-option" data-group="autonomy" data-value="all" aria-pressed="true">
                  不限
                </button>
                <button class="finder-option" data-group="autonomy" data-value="auto" aria-pressed="false">
                  全自动
                </button>
                <button class="finder-option" data-group="autonomy" data-value="autofocus" aria-pressed="false">
                  自动对焦
                </button>
                <button class="finder-option" data-group="autonomy" data-value="auto-exposure" aria-pressed="false">
                  自动曝光
                </button>
                <button class="finder-option" data-group="autonomy" data-value="manual" aria-pressed="false">
                  全机械 / 手动
                </button>
              </div>
            </fieldset>

            <fieldset>
              <legend>03 / 主要场景</legend>
              <div class="finder-options">
                <button class="finder-option" data-group="scene" data-value="all" aria-pressed="true">
                  不限
                </button>
                <button class="finder-option" data-group="scene" data-value="daily" aria-pressed="false">
                  日常
                </button>
                <button class="finder-option" data-group="scene" data-value="travel" aria-pressed="false">
                  旅行
                </button>
                <button class="finder-option" data-group="scene" data-value="street" aria-pressed="false">
                  街拍
                </button>
                <button class="finder-option" data-group="scene" data-value="portrait" aria-pressed="false">
                  人像
                </button>
                <button class="finder-option" data-group="scene" data-value="learn" aria-pressed="false">
                  学习摄影
                </button>
              </div>
            </fieldset>

            <fieldset>
              <legend>04 / 画幅</legend>
              <div class="finder-options">
                <button class="finder-option" data-group="format" data-value="all" aria-pressed="true">
                  不限
                </button>
                <button class="finder-option" data-group="format" data-value="135" aria-pressed="false">
                  135 胶片
                </button>
                <button class="finder-option" data-group="format" data-value="120" aria-pressed="false">
                  中画幅
                </button>
              </div>
            </fieldset>

            <div class="finder-summary">
              <span class="finder-result-count">6 台推荐</span>
              <button class="finder-reset" type="button">
                清除筛选
              </button>
            </div>
          </div>

          <div class="finder-results">
            {cameras.map((camera) => (
              <a
                class="finder-result-card"
                href={camera.href}
                data-budget={camera.budget}
                data-autonomy={camera.autonomy}
                data-scene={camera.scene}
                data-format={camera.format}
              >
                <div class={`finder-card-image ${camera.image ? "has-image" : "is-placeholder"}`}>
                  {camera.image ? <img src={camera.image} alt={camera.name} loading="lazy" /> : <span>{camera.name}</span>}
                </div>
                <div class="finder-card-copy">
                  <p>{camera.meta}</p>
                  <h3>{camera.name}</h3>
                  <strong>{camera.price}</strong>
                  <span>{camera.reason}</span>
                  <small>查看详情 →</small>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section class="buying-guide-section">
        <div class="buying-guide-inner">
          <div class="buying-guide-heading">
            <p>选购基础</p>
            <h2>看具体机型之前，先回答三个问题。</h2>
          </div>
          <div class="buying-guide-grid">
            <article>
              <span>01</span>
              <h3>完整预算是多少？</h3>
              <p>除了机身，还要考虑镜头、胶卷、冲洗、扫描、电池和可能发生的维修费用。</p>
            </article>
            <article>
              <span>02</span>
              <h3>想要多自动？</h3>
              <p>全自动适合直接记录生活，自动曝光适合温和入门，全机械更适合认真学习摄影操作。</p>
            </article>
            <article>
              <span>03</span>
              <h3>主要拍什么？</h3>
              <p>旅行、日常、人像和街拍对体积、对焦、镜头和可靠性的要求并不相同。</p>
            </article>
          </div>
          <a class="buying-guide-link" href="./buying">进入完整选购流程 →</a>
        </div>
      </section>

      <section class="home-commercial-section video-preview-section">
        <div class="commercial-section-heading is-split">
          <div>
            <p>视频与文章</p>
            <h2>习惯看视频，也可以从原视频开始。</h2>
          </div>
          <a href="./videos">查看视频精选 →</a>
        </div>
        <div class="video-preview-grid">
          {videoTopics.map(([number, category, title]) => (
            <a href="./videos">
              <span>{number}</span>
              <div>
                <p>{category}</p>
                <h3>{title}</h3>
                <small>视频来源正在逐条整理，页面会保留原作者和原视频链接。</small>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section class="home-commercial-section methodology-section">
        <div>
          <p>内容整理方式</p>
          <h2>视频内容经过整理、核验和重新编排，方便学习与选购。</h2>
        </div>
        <div class="methodology-grid">
          <article>
            <span>01</span>
            <h3>保留原始出处</h3>
            <p>逐条记录 B 站视频、创作者和链接，不重新托管视频，也不隐藏原作者。</p>
          </article>
          <article>
            <span>02</span>
            <h3>拆分观点与事实</h3>
            <p>主观使用体验保留为创作者观点；参数、年份和兼容性使用公开资料核验。</p>
          </article>
          <article>
            <span>03</span>
            <h3>明确不确定性</h3>
            <p>价格具有时效性，图片需要授权，无法确认的信息不会写成确定结论。</p>
          </article>
        </div>
      </section>
    </div>
  )
}

HomePage.afterDOMLoaded = homeScript

export default (() => HomePage) satisfies QuartzComponentConstructor

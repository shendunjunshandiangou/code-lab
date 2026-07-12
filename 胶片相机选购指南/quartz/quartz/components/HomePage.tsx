// @ts-ignore
import homeScript from "./scripts/commercialHome.inline"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

const cameras = [
  {
    name: "尼康 FE",
    meta: "电子单反 · 光圈优先",
    price: "¥500～800",
    reason: "保留手动操作，又用 A 档降低曝光门槛，是温和而完整的入门方式。",
    href: "./02_atoms/models/尼康-FE",
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Nikon_FE_(Workshop_Cologne_%2706)_(cropped).jpeg?width=1200",
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
    href: "./02_atoms/models/奥林巴斯-mju-1",
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
    href: "./02_atoms/models/尼康-F-601",
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Nikon_F601%28n6006%29_%28cropped%29.JPG?width=1200",
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
    href: "./02_atoms/models/宾得-K1000",
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pentax_K1000.jpg?width=1200",
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
    href: "./02_atoms/models/佳能-AE-1",
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
    href: "./02_atoms/models/奥林巴斯-OM-1",
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
    title: "先了解胶片相机是什么",
    copy: "弄清它与数码相机的区别，以及这种拍摄方式是否适合你。",
    time: "约 5 分钟",
    href: "./04_knowledge/科普入门/01-胶片相机到底是什么",
  },
  {
    number: "02",
    title: "了解胶卷、冲洗和长期成本",
    copy: "知道按下快门之后还要经历什么，以及每拍一卷大概要花多少钱。",
    time: "约 8 分钟",
    href: "./film",
  },
  {
    number: "03",
    title: "分清相机类型和操作方式",
    copy: "比较自动便携相机、自动对焦单反和全机械单反分别适合谁。",
    time: "约 8 分钟",
    href: "./04_knowledge/知识百科/01-相机类型详解",
  },
  {
    number: "04",
    title: "根据预算和场景选择机型",
    copy: "把预算、携带需求、对焦方式和拍摄场景放在一起判断。",
    time: "开始选购",
    href: "#quick-finder",
  },
  {
    number: "05",
    title: "买前检查，并顺利拍完第一卷",
    copy: "检查二手相机状态，再完成装卷、拍摄、回卷和送洗。",
    time: "购买与使用",
    href: "./04_knowledge/知识百科/05-从装卷到出片",
  },
]

const videoTopics = [
  ["01", "零基础", "胶片相机到底是什么？"],
  ["02", "购买决策", "第一台胶片相机应该怎样选？"],
  ["03", "二手检查", "拿到相机后，应该检查哪些地方？"],
]

function HomePage({ fileData }: QuartzComponentProps) {
  if (fileData.slug !== "index") return null

  return (
    <div class="commercial-home">
      <section class="commercial-hero">
        <video
          class="commercial-hero-video"
          autoplay
          muted
          loop
          playsinline
          poster="https://commons.wikimedia.org/wiki/Special:Redirect/file/Nikon_FM2_et_Nikkor_50mm_f1.8.jpg?width=1800"
          aria-hidden="true"
        >
          <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
        </video>
        <div class="commercial-hero-overlay"></div>
        <div class="commercial-hero-content">
          <p class="commercial-eyebrow">胶片相机入门与选购指南</p>
          <h1>
            从了解胶片相机开始，
            <br />
            找到适合你的第一台相机。
          </h1>
          <p>
            先弄清胶片、相机类型和使用成本，再根据预算、操作习惯和拍摄场景缩小选择，顺利开始你的第一卷胶片。
          </p>
          <div class="commercial-hero-actions">
            <a class="commercial-button is-primary" href="./learn">
              从零开始了解
            </a>
            <a class="commercial-button is-ghost" href="./buying">
              直接开始选购
            </a>
          </div>
        </div>
        <div class="commercial-hero-stats" aria-label="网站核心内容">
          <span>
            <strong>5</strong> 步入门路径
          </span>
          <span>
            <strong>83</strong> 台机型资料
          </span>
          <span>
            <strong>1</strong> 套完整选购流程
          </span>
        </div>
        <p class="commercial-hero-credit">
          首屏视频为基础版本临时视觉素材；静态相机图片来自 Wikimedia Commons，后续将替换为完成授权核验的胶片摄影素材。
        </p>
      </section>

      <section class="home-commercial-section reading-path">
        <div class="commercial-section-heading is-split">
          <div>
            <p>新手建议阅读顺序</p>
            <h2>先把基本问题弄清楚，再开始选相机。</h2>
          </div>
          <span>第一次接触胶片相机，建议从第 1 步开始；已经了解胶片流程和使用成本，可以直接跳到第 4 步。</span>
        </div>
        <div class="reading-path-list">
          {learningPath.map(({ number, title, copy, time, href }) => (
            <a href={href}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
              <small>{time} · 进入内容 ↗</small>
            </a>
          ))}
        </div>
      </section>

      <section class="home-commercial-section quick-finder" id="quick-finder">
        <div class="commercial-section-heading is-split">
          <div>
            <p>快速选机</p>
            <h2>根据预算和使用方式，查看适合的入门机型。</h2>
          </div>
          <span>先筛选一个大致方向，再进入详情页查看优缺点、购买检查和同价位替代方案。</span>
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

      <section class="home-commercial-section editorial-feature">
        <div class="editorial-feature-image">
          <img
            src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Nikon_FE_(Workshop_Cologne_%2706)_(cropped).jpeg?width=1600"
            alt="尼康 FE 胶片相机"
            loading="lazy"
          />
        </div>
        <div class="editorial-feature-copy">
          <p>选购前需要确认</p>
          <h2>第一台胶片相机，不需要追求最贵或最热门。</h2>
          <span>
            是否愿意手动对焦、能否接受胶卷与冲扫的持续成本、相机会不会真正随身携带，通常比品牌和参数更重要。
          </span>
          <a href="./buying">查看完整选购方法 →</a>
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
                <small>视频来源映射中 · 查看整理规则</small>
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

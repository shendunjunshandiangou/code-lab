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
    reason: "体积小、操作直接，适合旅行和生活记录，不必承担热门神机的高溢价。",
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
          <p class="commercial-eyebrow">ANALOG CAMERA FIELD GUIDE · 2026</p>
          <h1>
            不要先问哪台是神机。
            <br />
            先找到适合你拍摄方式的相机。
          </h1>
          <p>
            从第一卷胶片到第一台真正适合你的相机，按照预算、操作方式和拍摄场景，建立一条清晰、可靠的入门路径。
          </p>
          <div class="commercial-hero-actions">
            <a class="commercial-button is-primary" href="./buying">
              开始选择相机
            </a>
            <a class="commercial-button is-ghost" href="./learn">
              5 分钟了解胶片
            </a>
          </div>
        </div>
        <div class="commercial-hero-stats" aria-label="网站内容规模">
          <span>
            <strong>83</strong> 台机型
          </span>
          <span>
            <strong>44</strong> 个视频来源
          </span>
          <span>
            <strong>150+</strong> 条知识笔记
          </span>
        </div>
        <p class="commercial-hero-credit">
          首屏视频为基础版本临时视觉素材；相机静态图来自 Wikimedia Commons，正式版本将替换为经过授权核验的胶片摄影片段。
        </p>
      </section>

      <section class="home-commercial-section quick-finder" id="quick-finder">
        <div class="commercial-section-heading is-split">
          <div>
            <p>QUICK CAMERA FINDER</p>
            <h2>先回答四个问题，快速缩小范围。</h2>
          </div>
          <span>基础版本先覆盖六种典型入门方向，后续接入全部机型数据库。</span>
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
                  500～1500
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
          <p>EDITOR'S NOTE · FIRST CAMERA</p>
          <h2>第一次买胶片机，为什么不必追最热门的“神机”。</h2>
          <span>
            机身热度不会替你完成对焦、测光和携带。真正有效的选择，是先确认你愿意学习多少、会在什么场景使用，以及长期胶卷和冲扫预算。
          </span>
          <a href="./buying">打开完整选购路径 →</a>
        </div>
      </section>

      <section class="home-commercial-section reading-path">
        <div class="commercial-section-heading">
          <p>BEFORE THE FIRST ROLL</p>
          <h2>从零开始，只需要走完五步。</h2>
        </div>
        <div class="reading-path-list">
          {[
            ["01", "胶片相机是什么", "理解胶片和数码记录光线的根本区别。", "约 5 分钟", "./04_knowledge/科普入门/01-胶片相机到底是什么"],
            ["02", "胶卷、冲洗和扫描", "看懂按下快门之后，照片为什么还没有出现。", "约 7 分钟", "./film"],
            ["03", "选择相机类型", "傻瓜机、自动单反和全机械单反分别适合谁。", "约 8 分钟", "./04_knowledge/知识百科/01-相机类型详解"],
            ["04", "确定预算和场景", "把机身、镜头、胶卷、冲扫与维修放进同一份预算。", "约 10 分钟", "./buying"],
            ["05", "顺利拍完第一卷", "装卷、测光、拍摄、回卷和送洗的完整流程。", "约 12 分钟", "./04_knowledge/知识百科/05-从装卷到出片"],
          ].map(([number, title, copy, time, href]) => (
            <a href={href}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
              <small>{time} · 开始阅读 ↗</small>
            </a>
          ))}
        </div>
      </section>

      <section class="home-commercial-section video-preview-section">
        <div class="commercial-section-heading is-split">
          <div>
            <p>WATCH & READ</p>
            <h2>从原视频开始，再回到结构化阅读。</h2>
          </div>
          <a href="./videos">查看视频精选 →</a>
        </div>
        <div class="video-preview-grid">
          <a href="./videos">
            <span>01</span>
            <div>
              <p>零基础</p>
              <h3>胶片相机到底是什么？</h3>
              <small>视频来源映射中 · 查看整理规则</small>
            </div>
          </a>
          <a href="./videos">
            <span>02</span>
            <div>
              <p>购买决策</p>
              <h3>第一台胶片相机应该怎样选？</h3>
              <small>视频来源映射中 · 查看整理规则</small>
            </div>
          </a>
          <a href="./videos">
            <span>03</span>
            <div>
              <p>二手检查</p>
              <h3>拿到相机后，先不要急着装卷。</h3>
              <small>视频来源映射中 · 查看整理规则</small>
            </div>
          </a>
        </div>
      </section>

      <section class="home-commercial-section methodology-section">
        <div>
          <p>HOW THIS GUIDE IS BUILT</p>
          <h2>不是把字幕贴到网页，而是把观点重新组织成可以查证、比较和行动的内容。</h2>
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
            <p>价格具有时效性，图片需要授权，无法确认的信息不会伪装成确定结论。</p>
          </article>
        </div>
      </section>
    </div>
  )
}

HomePage.afterDOMLoaded = homeScript

export default (() => HomePage) satisfies QuartzComponentConstructor
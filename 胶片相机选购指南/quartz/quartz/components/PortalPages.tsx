import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/portalPages.scss"

type IconName =
  | "guide"
  | "budget"
  | "auto"
  | "manual"
  | "travel"
  | "portrait"
  | "camera"
  | "film"
  | "scan"
  | "video"
  | "source"
  | "check"
  | "mail"
  | "github"

function PortalIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, preact.JSX.Element> = {
    guide: <><path d="M10 10h12c4 0 6 2 6 6v22H16c-4 0-6-2-6-6z" /><path d="M38 10H26c-4 0-6 2-6 6v22h12c4 0 6-2 6-6z" /></>,
    budget: <><rect x="7" y="12" width="34" height="25" rx="3" /><path d="M7 19h34M13 27h9M13 32h14" /><circle cx="35" cy="28" r="2" /></>,
    auto: <><circle cx="24" cy="24" r="16" /><path d="M24 13v11l7 4M12 12l4 4M36 12l-4 4" /></>,
    manual: <><path d="M8 29h8l4-15 5 24 5-18 3 9h7" /><circle cx="12" cy="12" r="4" /></>,
    travel: <><path d="M9 17h30v22H9zM17 17v-5h14v5" /><path d="M16 17v22M32 17v22" /></>,
    portrait: <><circle cx="24" cy="17" r="7" /><path d="M11 39c1-9 6-14 13-14s12 5 13 14" /></>,
    camera: <><path d="M8 15h7l3-4h12l3 4h7v22H8z" /><circle cx="24" cy="26" r="7" /><path d="M12 19h4" /></>,
    film: <><rect x="8" y="10" width="32" height="28" rx="3" /><circle cx="18" cy="24" r="6" /><circle cx="30" cy="24" r="6" /><path d="M8 16h32M8 32h32" /></>,
    scan: <><path d="M11 16V9h7M37 16V9h-7M11 32v7h7M37 32v7h-7" /><path d="M15 24h18M15 28h18" /></>,
    video: <><rect x="7" y="11" width="34" height="26" rx="3" /><path d="m21 18 10 6-10 6z" /></>,
    source: <><path d="M14 10h20v28H14z" /><path d="M19 17h10M19 23h10M19 29h7" /></>,
    check: <><circle cx="24" cy="24" r="17" /><path d="m16 24 5 5 11-12" /></>,
    mail: <><rect x="7" y="12" width="34" height="25" rx="3" /><path d="m8 15 16 13 16-13" /></>,
    github: <><circle cx="24" cy="24" r="17" /><path d="M17 36c0-4 0-6 3-7-6-1-8-4-8-9 0-2 1-4 3-6 0-2 0-4 1-5 4 0 6 2 8 3 2-1 4-3 8-3 1 1 1 3 1 5 2 2 3 4 3 6 0 5-2 8-8 9 3 1 3 3 3 7" /></>,
  }

  return (
    <span class="portal-icon" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        {paths[name]}
      </svg>
    </span>
  )
}

function PortalHeader(props: { section: string; title: string; description: string; image: string; alt: string; credit: string }) {
  return (
    <header class="portal-page-header">
      <div class="portal-page-header-copy">
        <p>你正在浏览：{props.section}</p>
        <h1>{props.title}</h1>
        <span>{props.description}</span>
      </div>
      <figure>
        <img src={props.image} alt={props.alt} loading="eager" decoding="async" />
        <figcaption>{props.credit}</figcaption>
      </figure>
    </header>
  )
}

const cameraCards = [
  {
    name: "尼康 FE",
    type: "手动对焦 · 光圈优先",
    price: "约 ¥500～800",
    label: "推荐入门",
    copy: "保留手动对焦和过片，同时用 A 档降低曝光门槛，适合想认真学习但不想从全机械开始的人。",
    href: "./02_atoms/models/尼康-FE",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Nikon_FE_(Workshop_Cologne_%2706)_(cropped).jpeg?width=1200",
  },
  {
    name: "尼康 F-601",
    type: "自动对焦单反",
    price: "约 ¥200～600",
    label: "性价比",
    copy: "操作方式接近现代相机，自动对焦和多种曝光模式能显著降低第一次使用胶片单反的压力。",
    href: "./02_atoms/models/尼康-F-601",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Nikon_F601%28n6006%29_%28cropped%29.JPG?width=1200",
  },
  {
    name: "宾得 K1000",
    type: "全机械单反",
    price: "约 ¥800～1500",
    label: "学习摄影",
    copy: "结构简单、操作直接。适合愿意主动学习测光、光圈和快门关系的读者。",
    href: "./02_atoms/models/宾得-K1000",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pentax_K1000.jpg?width=1200",
  },
  {
    name: "尼康 FM2",
    type: "全机械单反",
    price: "价格偏高",
    label: "经典机型",
    copy: "可靠、耐用、机械感强，但市场热度和价格都较高，不必把它当作新手的唯一答案。",
    href: "./02_atoms/models/尼康-FM2",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Nikon_FM2_et_Nikkor_50mm_f1.8.jpg?width=1200",
  },
  {
    name: "奥林巴斯 mju-1",
    type: "自动便携相机",
    price: "约 ¥400～900",
    label: "随身记录",
    copy: "体积小、操作直接，适合旅行和生活记录。购买时应重点检查闪光灯、镜头伸缩和排线状态。",
    href: "./02_atoms/models/奥林巴斯-mju-1",
    image: "",
  },
  {
    name: "佳能 AE-1",
    type: "手动对焦 · 快门优先",
    price: "约 ¥800～1500",
    label: "经典系统",
    copy: "传统单反外形、FD 镜头体系和自动曝光结合，适合喜欢手动操作但不想完全依赖手动测光的人。",
    href: "./02_atoms/models/佳能-AE-1",
    image: "",
  },
]

function BuyingPage() {
  const intents = [
    ["auto" as IconName, "最省心", "自动便携相机", "希望相机完成对焦、测光和过片，主要用于旅行和日常记录。"],
    ["guide" as IconName, "温和学习", "A 档手动对焦单反", "愿意自己对焦和构图，但希望相机帮助完成曝光判断。"],
    ["manual" as IconName, "认真学习", "全机械单反", "愿意花时间理解测光、光圈和快门，重视完整操作体验。"],
    ["budget" as IconName, "预算优先", "90 年代自动单反", "希望先用较低成本体验胶片，不追求热门型号和收藏价值。"],
  ]

  return (
    <article class="portal-rich-page buying-page">
      <PortalHeader
        section="帮我选相机"
        title="先决定怎样拍，再决定买哪台。"
        description="选第一台胶片相机，不需要先背型号。按照使用场景、完整预算、操作方式和二手状态四步判断，通常就能把几十台候选缩小到两三台。"
        image="https://commons.wikimedia.org/wiki/Special:Redirect/file/Nikon_FE_(Workshop_Cologne_%2706)_(cropped).jpeg?width=1600"
        alt="尼康 FE 胶片相机"
        credit="尼康 FE · Tobias Wolter · Wikimedia Commons · CC BY-SA 3.0"
      />

      <section class="portal-section">
        <div class="portal-section-title"><span>第一步</span><h2>你希望相机帮你完成多少操作？</h2></div>
        <div class="intent-grid">
          {intents.map(([icon, tag, title, copy]) => (
            <article>
              <PortalIcon name={icon as IconName} />
              <small>{tag}</small>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section class="portal-section is-soft">
        <div class="portal-section-title"><span>第二步</span><h2>把机身之外的成本一起算进去。</h2></div>
        <div class="budget-layout">
          <div class="budget-stack" aria-label="第一套胶片相机预算组成">
            <div><strong>55%</strong><span>机身与镜头</span></div>
            <div><strong>20%</strong><span>首批胶卷与冲扫</span></div>
            <div><strong>15%</strong><span>电池、背带与清洁</span></div>
            <div><strong>10%</strong><span>验机或维修预留</span></div>
          </div>
          <div class="budget-copy">
            <p class="portal-lead">预算 1000 元，不代表应该买一台标价 1000 元的机身。</p>
            <p>第一次购买至少要预留胶卷、冲扫、电池和可能发生的小修费用。对于可换镜头单反，还要确认报价是否包含镜头。</p>
            <div class="budget-examples">
              <span><strong>500 元以内</strong>优先看自动单反、普通便携机或先体验一次性相机</span>
              <span><strong>500～1500 元</strong>可以选择电子单反、入门机械单反和状态较好的便携机</span>
              <span><strong>1500 元以上</strong>开始为体积、做工、镜头系统或收藏属性付费</span>
            </div>
          </div>
        </div>
      </section>

      <section class="portal-section">
        <div class="portal-section-title"><span>第三步</span><h2>按照真实使用场景排除不合适的相机。</h2></div>
        <div class="scene-grid">
          <article><PortalIcon name="travel" /><h3>旅行与日常</h3><p>优先考虑体积、重量、自动对焦和闪光灯。再好的相机，如果不愿意带出门，也很难发挥价值。</p></article>
          <article><PortalIcon name="portrait" /><h3>人像</h3><p>优先看镜头系统、对焦方式和曝光稳定性。可换镜头单反通常比高价便携机更灵活。</p></article>
          <article><PortalIcon name="manual" /><h3>学习摄影</h3><p>优先选择取景清晰、测光可用、有手动控制或 A 档的单反，而不是只看复古外形。</p></article>
        </div>
      </section>

      <section class="portal-section is-dark">
        <div class="portal-section-title"><span>第四步</span><h2>从典型入门机型开始比较。</h2></div>
        <div class="camera-card-grid compact">
          {cameraCards.slice(0, 4).map((camera) => <CameraCard camera={camera} />)}
        </div>
        <div class="portal-actions"><a href="./cameras">浏览更多机型</a><a href="./04_knowledge/选购决策/Step4-二手检查清单">查看二手验机清单</a></div>
      </section>
    </article>
  )
}

function CameraCard({ camera }: { camera: (typeof cameraCards)[number] }) {
  return (
    <a class="camera-visual-card" href={camera.href}>
      <div class={`camera-visual-image ${camera.image ? "has-image" : "is-placeholder"}`}>
        {camera.image ? <img src={camera.image} alt={camera.name} loading="lazy" /> : <PortalIcon name="camera" />}
        <span>{camera.label}</span>
      </div>
      <div class="camera-visual-copy">
        <p>{camera.type}</p>
        <h3>{camera.name}</h3>
        <strong>{camera.price}</strong>
        <span>{camera.copy}</span>
        <small>查看机型详情 →</small>
      </div>
    </a>
  )
}

function CamerasPage() {
  return (
    <article class="portal-rich-page cameras-page">
      <PortalHeader
        section="相机图鉴"
        title="先按使用方式认识机型，再比较具体型号。"
        description="图鉴不只陈列参数。每台相机会优先说明适合谁、主要优点、需要承担的缺点、参考价格和二手检查重点。"
        image="https://commons.wikimedia.org/wiki/Special:Redirect/file/Pentax_K1000.jpg?width=1600"
        alt="宾得 K1000 胶片单反相机"
        credit="宾得 K1000 · Wikimedia Commons"
      />

      <section class="portal-section">
        <div class="portal-section-title"><span>浏览方式</span><h2>从四条常见入门路线开始。</h2></div>
        <div class="camera-route-grid">
          <a href="#camera-list"><PortalIcon name="auto" /><span>操作最省心</span><h3>自动便携相机</h3><p>适合日常记录和旅行，重点检查电子系统与镜头伸缩。</p></a>
          <a href="#camera-list"><PortalIcon name="check" /><span>性价比优先</span><h3>自动对焦单反</h3><p>操作接近现代相机，常常是被低估的低成本入门方案。</p></a>
          <a href="#camera-list"><PortalIcon name="guide" /><span>平衡学习与易用</span><h3>自动曝光单反</h3><p>手动对焦、自动曝光，适合长期学习和日常使用。</p></a>
          <a href="#camera-list"><PortalIcon name="manual" /><span>完整机械操作</span><h3>全机械单反</h3><p>需要主动测光和设置参数，体验完整但学习成本更高。</p></a>
        </div>
      </section>

      <section class="portal-section is-dark" id="camera-list">
        <div class="portal-section-title"><span>代表机型</span><h2>六台典型相机，覆盖不同入门方向。</h2></div>
        <div class="camera-card-grid">
          {cameraCards.map((camera) => <CameraCard camera={camera} />)}
        </div>
      </section>

      <section class="portal-section camera-reading-note">
        <div><PortalIcon name="check" /><h2>看参数之前，先看状态。</h2></div>
        <p>胶片相机普遍已有二三十年历史。同一型号的两台机器，实际价值可能因为快门、测光、霉雾、漏光、排线和维修历史产生巨大差异。图鉴中的价格只能作为筛选范围，不是成交保证。</p>
        <a href="./04_knowledge/知识百科/03-推荐机型大全">查看完整机型汇总 →</a>
      </section>
    </article>
  )
}

function FilmPage() {
  const filmTypes = [
    ["彩色负片", "最适合第一卷", "曝光容错较高，普通冲扫店都能处理。新手优先选择 C-41、ISO 400。"],
    ["黑白胶卷", "适合练习光影", "颜色因素更少，但不同冲洗方式会明显影响颗粒和反差。"],
    ["反转片", "不建议第一卷", "色彩鲜明、可直接观看底片，但曝光容错低、成本更高。"],
    ["电影卷", "先确认冲洗条件", "需要专门的 ECN-2 工艺，购买前应先确认当地或线上冲扫店。"],
  ]

  return (
    <article class="portal-rich-page film-page">
      <PortalHeader
        section="胶卷与成像"
        title="相机控制光线，胶卷和冲扫决定最终画面。"
        description="同一台机身装入不同胶卷，再经过不同的曝光、冲洗和扫描，会得到明显不同的结果。这里把第一次购买和拍摄真正需要理解的内容放在一页。"
        image="https://commons.wikimedia.org/wiki/Special:Redirect/file/Nikon_FM2_et_Nikkor_50mm_f1.8.jpg?width=1600"
        alt="尼康 FM2 胶片相机与镜头"
        credit="尼康 FM2 · Patrick Dehais · Wikimedia Commons"
      />

      <section class="portal-section film-intro-layout">
        <div class="film-canister-graphic" aria-hidden="true"><span>COLOR</span><strong>400</strong><small>36 EXP · C-41</small><i></i></div>
        <div>
          <div class="portal-section-title"><span>第一卷建议</span><h2>先买 ISO 400 的彩色负片。</h2></div>
          <p class="portal-lead">ISO 400 对晴天、阴天、室内和傍晚的适应性更好，彩色负片也比反转片更能容忍轻微曝光误差。</p>
          <ul class="plain-check-list"><li>包装上确认写有 C-41</li><li>不要从过期卷和来源不明的分装卷开始</li><li>装卷后整卷按照同一个 ISO 拍摄</li><li>托运行李不要放未冲洗胶卷</li></ul>
        </div>
      </section>

      <section class="portal-section is-soft">
        <div class="portal-section-title"><span>胶卷类型</span><h2>四种常见胶卷，一次看懂。</h2></div>
        <div class="film-type-grid">
          {filmTypes.map(([title, tag, copy], index) => <article><span>{String(index + 1).padStart(2, "0")}</span><small>{tag}</small><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section class="portal-section">
        <div class="portal-section-title"><span>ISO</span><h2>ISO 写在胶卷上，不能每张照片随意更改。</h2></div>
        <div class="iso-scale">
          <article><strong>100–200</strong><span>晴天与充足日光</span><p>颗粒更细，但阴天和室内更容易遇到快门过慢。</p></article>
          <article class="is-recommended"><strong>400</strong><span>最通用</span><p>晴天、阴天、室内和黄昏都更容易使用，是第一卷最稳妥的选择。</p></article>
          <article><strong>800+</strong><span>暗光与夜间</span><p>更容易在弱光中拍摄，但颗粒和价格通常都会增加。</p></article>
        </div>
      </section>

      <section class="portal-section is-dark">
        <div class="portal-section-title"><span>拍完之后</span><h2>按下快门只是第一步。</h2></div>
        <div class="film-process-line">
          <div><PortalIcon name="camera" /><strong>拍摄</strong><span>装卷、测光、曝光</span></div>
          <i>→</i>
          <div><PortalIcon name="film" /><strong>冲洗</strong><span>药水让底片显影和定影</span></div>
          <i>→</i>
          <div><PortalIcon name="scan" /><strong>扫描</strong><span>把物理底片转成数字文件</span></div>
          <i>→</i>
          <div><PortalIcon name="check" /><strong>保存</strong><span>检查并妥善保存原始底片</span></div>
        </div>
        <div class="film-cost-row"><span><strong>40～55 元</strong>常见彩色负片</span><span><strong>15～25 元</strong>普通冲扫</span><span><strong>约 1.7～2.5 元</strong>每张照片</span></div>
        <div class="portal-actions"><a href="./04_knowledge/知识百科/04-胶卷完全指南">阅读胶卷完全指南</a><a href="./04_knowledge/知识百科/05-从装卷到出片">查看完整拍摄流程</a></div>
      </section>
    </article>
  )
}

function VideosPage() {
  const topics = [
    ["guide" as IconName, "零基础入门", "胶片相机、胶卷、冲洗和扫描的基本流程", "./learn"],
    ["budget" as IconName, "第一台相机怎么选", "预算、使用场景、自动化程度和典型入门方案", "./buying"],
    ["camera" as IconName, "机型与系统", "具体型号的优缺点、替代方案和二手价格判断", "./cameras"],
    ["check" as IconName, "二手验机", "快门、测光、漏光、霉雾、排线和电池仓检查", "./04_knowledge/选购决策/Step4-二手检查清单"],
  ]

  return (
    <article class="portal-rich-page videos-page">
      <PortalHeader
        section="视频精选"
        title="保留原视频，也提供更容易查询的文字版本。"
        description="本站内容主要整理自 B 站公开视频。视频适合建立直观认识，文章负责把观点、参数、选购步骤和注意事项重新组织成可以检索和比较的结构。"
        image="https://commons.wikimedia.org/wiki/Special:Redirect/file/Nikon_FM2_et_Nikkor_50mm_f1.8.jpg?width=1600"
        alt="尼康 FM2 胶片相机"
        credit="尼康 FM2 · Patrick Dehais · Wikimedia Commons"
      />

      <section class="portal-section">
        <div class="portal-section-title"><span>视频主题</span><h2>先按问题选择内容，不需要从头浏览所有视频。</h2></div>
        <div class="video-topic-grid">
          {topics.map(([icon, title, copy, href], index) => (
            <a href={href}>
              <div class="video-topic-visual"><PortalIcon name={icon as IconName} /><span>0{index + 1}</span><i>▶</i></div>
              <div><h3>{title}</h3><p>{copy}</p><small>先阅读对应内容 →</small></div>
            </a>
          ))}
        </div>
      </section>

      <section class="portal-section is-soft source-workflow-section">
        <div class="portal-section-title"><span>来源整理</span><h2>每条视频上线前，需要完成这些信息。</h2></div>
        <div class="source-field-grid">
          <article><PortalIcon name="video" /><h3>原视频信息</h3><p>平台、BV 号、标题、创作者、原链接和封面。</p></article>
          <article><PortalIcon name="source" /><h3>内容用途</h3><p>区分主要来源、补充观点、机型展示和实际操作示范。</p></article>
          <article><PortalIcon name="check" /><h3>事实核验</h3><p>参数、年份、卡口和兼容性不直接依赖单一视频观点。</p></article>
        </div>
        <p class="source-status-note">当前播放器和视频卡片能力已经完成。具体视频仍在核对 BV 号、创作者和对应文章，无法确认的信息不会使用猜测值填充。</p>
      </section>
    </article>
  )
}

function AboutPage() {
  return (
    <article class="portal-rich-page about-page">
      <PortalHeader
        section="关于本站"
        title="把分散的视频和机型资料，整理成一条清晰的入门路径。"
        description="胶片相机指南面向第一次接触胶片摄影、正在准备购买第一台相机的读者。它不是排行榜，也不是将个人文件夹直接公开的知识库。"
        image="https://commons.wikimedia.org/wiki/Special:Redirect/file/Nikon_FE_(Workshop_Cologne_%2706)_(cropped).jpeg?width=1600"
        alt="尼康 FE 胶片相机"
        credit="尼康 FE · Tobias Wolter · Wikimedia Commons · CC BY-SA 3.0"
      />

      <section class="portal-section">
        <div class="about-stat-grid"><article><strong>83</strong><span>台机型资料</span></article><article><strong>5</strong><span>步新手路径</span></article><article><strong>1</strong><span>套完整选购流程</span></article></div>
      </section>

      <section class="portal-section is-soft">
        <div class="portal-section-title"><span>编辑原则</span><h2>内容不是简单复制，而是整理、核验和标记边界。</h2></div>
        <div class="about-principle-grid">
          <article><PortalIcon name="source" /><h3>保留原始出处</h3><p>记录 B 站视频、创作者和原链接，不下载并重新托管视频，也不隐藏原作者。</p></article>
          <article><PortalIcon name="check" /><h3>区分观点与事实</h3><p>主观使用体验保留为创作者观点；参数、年份和兼容性尽量使用公开资料交叉核对。</p></article>
          <article><PortalIcon name="film" /><h3>补充完整使用背景</h3><p>选购机身之外，也解释胶卷、冲洗、扫描、持续成本和第一卷拍摄流程。</p></article>
          <article><PortalIcon name="camera" /><h3>明确不确定信息</h3><p>二手价格会变化，图片需要授权，尚未确认的信息会标记“待核验”，不会写成确定结论。</p></article>
        </div>
      </section>

      <section class="portal-section contact-section">
        <div class="portal-section-title"><span>联系与纠错</span><h2>发现参数、来源或链接问题，可以直接反馈。</h2></div>
        <div class="contact-card-grid">
          <a href="mailto:335566qwer@gmail.com"><PortalIcon name="mail" /><div><small>电子邮件</small><h3>335566qwer@gmail.com</h3><p>适合内容纠错、图片授权和来源补充。</p></div></a>
          <a href="https://github.com/shendunjunshandiangou/code-lab"><PortalIcon name="github" /><div><small>GitHub</small><h3>查看项目仓库</h3><p>查看网站内容、前台代码和版本更新记录。</p></div></a>
        </div>
      </section>
    </article>
  )
}

const PortalPages: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = String(fileData.slug ?? "")
  if (slug === "buying") return <BuyingPage />
  if (slug === "cameras") return <CamerasPage />
  if (slug === "film") return <FilmPage />
  if (slug === "videos") return <VideosPage />
  if (slug === "about") return <AboutPage />
  return null
}

PortalPages.css = style

export default (() => PortalPages) satisfies QuartzComponentConstructor

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/learnPage.scss"

type IconName = "light" | "camera" | "film" | "cost" | "process" | "check"

function GuideIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, preact.JSX.Element> = {
    light: (
      <>
        <circle cx="24" cy="21" r="8" />
        <path d="M24 5v4M24 33v4M8 21h4M36 21h4M12.7 9.7l2.8 2.8M32.5 29.5l2.8 2.8M35.3 9.7l-2.8 2.8M15.5 29.5l-2.8 2.8" />
        <path d="M19 31h10M20.5 35h7" />
      </>
    ),
    camera: (
      <>
        <path d="M8 15h7l3-4h12l3 4h7v22H8z" />
        <circle cx="24" cy="26" r="7" />
        <path d="M12 19h4" />
      </>
    ),
    film: (
      <>
        <rect x="8" y="10" width="32" height="28" rx="3" />
        <circle cx="18" cy="24" r="6" />
        <circle cx="30" cy="24" r="6" />
        <path d="M8 16h32M8 32h32" />
      </>
    ),
    cost: (
      <>
        <rect x="8" y="12" width="32" height="25" rx="3" />
        <path d="M8 19h32M14 27h8M14 32h13" />
        <circle cx="34" cy="28" r="2" />
      </>
    ),
    process: (
      <>
        <path d="M10 13h10v10H10zM28 13h10v10H28zM19 29h10v10H19z" />
        <path d="M20 18h8M33 23v6M24 23v6" />
      </>
    ),
    check: (
      <>
        <circle cx="24" cy="24" r="17" />
        <path d="m16 24 5 5 11-12" />
      </>
    ),
  }

  return (
    <span class="learn-icon" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        {paths[name]}
      </svg>
    </span>
  )
}

const cameraTypes = [
  {
    icon: "camera" as IconName,
    title: "自动便携相机",
    tag: "最省心",
    copy: "自动对焦、自动测光、自动过片。适合希望随身记录，不想先学习复杂操作的人。",
    advice: "日常、旅行、朋友聚会",
  },
  {
    icon: "check" as IconName,
    title: "自动对焦单反",
    tag: "最容易上手",
    copy: "操作接近现代数码相机，可以换镜头，价格通常也比热门机械单反更合理。",
    advice: "人像、旅行、第一次买单反",
  },
  {
    icon: "light" as IconName,
    title: "A 档手动对焦单反",
    tag: "推荐入门",
    copy: "自己对焦和选择光圈，相机自动匹配快门。既能学习摄影，又不会一下承担全部操作压力。",
    advice: "摄影学习、街拍、长期使用",
  },
  {
    icon: "process" as IconName,
    title: "全机械单反",
    tag: "最需要学习",
    copy: "光圈、快门、对焦和过片全部手动。体验完整，但并不天然比电子相机更适合新手。",
    advice: "喜欢机械操作、愿意练习曝光",
  },
]

const shootingSteps = [
  ["01", "装入胶卷", "拉出片头并确认齿孔咬合。手动相机过片时，回卷手柄跟着转动，才说明装卷成功。"],
  ["02", "设置 ISO 与测光", "ISO 按胶卷包装设置；不熟悉老相机测光时，可以先使用手机测光应用。"],
  ["03", "完成拍摄", "彩色负片曝光不确定时，通常宁可稍微多给一点光，不要严重欠曝。"],
  ["04", "回卷并取出", "拍到底后先按回卷释放按钮，再将胶卷完整卷回暗盒，绝不要直接打开后盖。"],
  ["05", "送去冲扫", "第一次选择普通 C-41 冲洗与标准扫描即可，并要求底片回邮保存。"],
]

const LearnPage: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (fileData.slug !== "learn") return null

  return (
    <article class="learn-guide-page">
      <header class="learn-guide-intro">
        <div class="learn-guide-intro-copy">
          <p class="learn-context-line">新手入门 · 一页完成基础学习</p>
          <h1>第一次接触胶片相机，从这里开始。</h1>
          <p>
            这页会依次讲清胶片相机是什么、相机类型怎么选、胶卷怎么买、需要多少预算，以及怎样顺利拍完第一卷。看完后再进入具体机型选购，会容易很多。
          </p>
          <nav class="learn-anchor-nav" aria-label="本页内容">
            <a href="#what-is-film">胶片原理</a>
            <a href="#camera-types">相机类型</a>
            <a href="#choose-film">胶卷选择</a>
            <a href="#film-cost">使用成本</a>
            <a href="#first-roll">第一卷流程</a>
          </nav>
        </div>
        <figure class="learn-guide-cover">
          <img
            src="./static/images/library/nikon-fm2-et-nikkor-50mm-f1-8-a9fafbbf.jpg"
            alt="木桌上的尼康 FM2 胶片相机"
            loading="eager"
            decoding="async"
          />
          <figcaption>尼康 FM2 · Patrick Dehais · Wikimedia Commons</figcaption>
        </figure>
      </header>

      <section class="learn-section" id="what-is-film">
        <div class="learn-section-heading">
          <GuideIcon name="light" />
          <div>
            <span>第一部分</span>
            <h2>胶片相机到底是什么？</h2>
          </div>
        </div>
        <div class="learn-two-column">
          <div class="learn-main-copy">
            <p class="learn-lead">
              胶片相机和数码相机的区别，不是“一个老、一个新”，而是记录光线的方式不同。数码相机把光转成电子文件；胶片会让光直接作用在底片的感光材料上。
            </p>
            <div class="process-comparison">
              <div>
                <strong>数码相机</strong>
                <p>光线 → 电子传感器 → 数字文件</p>
                <small>按下快门后马上查看</small>
              </div>
              <div>
                <strong>胶片相机</strong>
                <p>光线 → 物理底片 → 冲洗 → 扫描</p>
                <small>按下快门只是整个流程的第一步</small>
              </div>
            </div>
            <p>
              因此，相机机身只是控制光线进入的工具。最终照片的色彩和质感，还会受到胶卷、曝光、冲洗和扫描的共同影响。
            </p>
          </div>
          <aside class="learn-callout">
            <strong>先记住这一句</strong>
            <p>胶片摄影不是为了替代数码，而是一种更慢、更有过程感，也需要持续成本的拍摄方式。</p>
          </aside>
        </div>
      </section>

      <section class="learn-section has-soft-background" id="camera-types">
        <div class="learn-section-heading">
          <GuideIcon name="camera" />
          <div>
            <span>第二部分</span>
            <h2>第一台相机，先选操作方式。</h2>
          </div>
        </div>
        <p class="learn-section-summary">
          新手不需要先记住旁轴、中画幅等所有名词。先决定希望相机帮你完成多少操作，再看具体型号。
        </p>
        <div class="camera-type-grid">
          {cameraTypes.map((item) => (
            <article>
              <div class="camera-type-top">
                <GuideIcon name={item.icon} />
                <span>{item.tag}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <small>适合：{item.advice}</small>
            </article>
          ))}
        </div>
        <div class="learn-photo-feature">
          <figure>
            <img
              src="./static/images/library/nikon-fe-workshop-cologne-06-cropped-fee376ba.jpg"
              alt="银黑色尼康 FE 胶片单反相机"
              loading="lazy"
            />
            <figcaption>尼康 FE · Tobias Wolter · Wikimedia Commons · CC BY-SA 3.0</figcaption>
          </figure>
          <div>
            <span>比较适合多数新手的中间方案</span>
            <h3>手动对焦 + 自动曝光</h3>
            <p>
              以尼康 FE 为例，你仍然需要自己构图和对焦，但可以使用光圈优先模式，让相机自动决定快门速度。它比全自动相机更有学习空间，也比全机械相机更容易开始。
            </p>
            <a href="./02_atoms/models/尼康-FE">查看尼康 FE 详情 →</a>
          </div>
        </div>
      </section>

      <section class="learn-section" id="choose-film">
        <div class="learn-section-heading">
          <GuideIcon name="film" />
          <div>
            <span>第三部分</span>
            <h2>胶卷就像可以更换的“传感器”。</h2>
          </div>
        </div>
        <div class="film-choice-layout">
          <div class="film-roll-illustration" aria-hidden="true">
            <div class="film-canister">
              <span>ISO</span>
              <strong>400</strong>
              <small>COLOR NEGATIVE</small>
            </div>
            <div class="film-strip">
              {Array.from({ length: 6 }).map(() => <i></i>)}
            </div>
          </div>
          <div>
            <p class="learn-lead">
              同一台相机装入不同胶卷，会得到不同的色彩、颗粒和宽容度。第一次购买时，不需要研究全部胶卷类型。
            </p>
            <div class="beginner-recommendation">
              <span>新手直接选择</span>
              <strong>ISO 400 的彩色负片</strong>
              <p>包装上通常会写 C-41。ISO 400 在晴天、阴天和室内都更容易使用，曝光容错也比较高。</p>
            </div>
          </div>
        </div>
        <div class="film-table-wrap">
          <table>
            <thead>
              <tr><th>类型</th><th>特点</th><th>是否适合第一卷</th></tr>
            </thead>
            <tbody>
              <tr><td>彩色负片</td><td>宽容度高、冲洗方便，是最常见的日常选择</td><td><strong>推荐</strong></td></tr>
              <tr><td>黑白胶卷</td><td>风格明确，冲洗选择较多</td><td>可以，但先确认冲扫店支持</td></tr>
              <tr><td>反转片</td><td>色彩通透，但曝光容错低且成本高</td><td>不建议</td></tr>
              <tr><td>电影卷</td><td>需要专门工艺，购买和冲洗更复杂</td><td>不建议</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="learn-section has-dark-background" id="film-cost">
        <div class="learn-section-heading">
          <GuideIcon name="cost" />
          <div>
            <span>第四部分</span>
            <h2>真正需要计算的是长期成本。</h2>
          </div>
        </div>
        <p class="learn-section-summary">
          买相机是一次性投入，胶卷和冲扫才是持续支出。先接受这个成本，再决定机身预算，会更合理。
        </p>
        <div class="cost-card-grid">
          <article><span>口粮彩色负片</span><strong>约 40～55 元</strong><p>每卷约 36 张</p></article>
          <article><span>普通冲洗与扫描</span><strong>约 15～25 元</strong><p>新手选择标准套餐即可</p></article>
          <article><span>每卷总成本</span><strong>约 60～90 元</strong><p>不含机身和可能的维修</p></article>
          <article><span>每张照片</span><strong>约 1.7～2.5 元</strong><p>会自然改变按快门的节奏</p></article>
        </div>
        <div class="cost-frequency">
          <strong>一个容易理解的参考</strong>
          <p>每月拍一卷，一年持续成本大约 800～1100 元。实际价格会随胶卷、冲扫店和地区变化。</p>
        </div>
      </section>

      <section class="learn-section" id="first-roll">
        <div class="learn-section-heading">
          <GuideIcon name="process" />
          <div>
            <span>第五部分</span>
            <h2>从装卷到收到照片，只需要记住五步。</h2>
          </div>
        </div>
        <div class="first-roll-timeline">
          {shootingSteps.map(([number, title, copy]) => (
            <article>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
        <div class="first-roll-warning">
          <GuideIcon name="check" />
          <div>
            <strong>第一卷最重要的目标不是拍出作品</strong>
            <p>先确认相机装卷、测光、过片、回卷和冲扫流程都正常。完成一次完整闭环后，再研究更细的曝光与胶卷风格。</p>
          </div>
        </div>
      </section>

      <section class="learn-next-step">
        <div>
          <span>基础入门完成</span>
          <h2>接下来，根据预算和使用方式选择相机。</h2>
          <p>已经知道自己能接受的操作难度和持续成本后，再比较具体机型，选择会简单很多。</p>
        </div>
        <div class="learn-next-actions">
          <a class="commercial-button is-primary" href="./buying">进入选购流程</a>
          <a class="commercial-button is-ghost" href="./cameras">浏览相机图鉴</a>
        </div>
      </section>
    </article>
  )
}

LearnPage.css = style

export default (() => LearnPage) satisfies QuartzComponentConstructor

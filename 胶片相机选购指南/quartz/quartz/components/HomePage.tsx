import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function HomePage({ fileData }: QuartzComponentProps) {
  if (fileData.slug !== "index") return null

  return (
    <div class="home-shell">
      <nav class="home-nav" aria-label="首页导航">
        <a class="home-brand" href="./">
          <span class="brand-mark" aria-hidden="true">
            ◉
          </span>
          <span>胶片相机指南</span>
        </a>
        <div class="home-nav-links">
          <a href="./04_knowledge/科普入门/01-胶片相机到底是什么">新手入门</a>
          <a href="./04_knowledge/选购决策/README">帮我选相机</a>
          <a href="./04_knowledge/知识百科/03-推荐机型大全">相机图鉴</a>
          <a href="./04_knowledge/知识百科/04-胶卷完全指南">胶卷与成像</a>
        </div>
      </nav>

      <section class="home-hero">
        <div class="hero-copy">
          <p class="eyebrow">ANALOG CAMERA FIELD GUIDE</p>
          <h1>
            从第一卷胶片，
            <br />
            到第一台真正适合你的相机。
          </h1>
          <p class="hero-lead">
            不堆参数，也不盲目追逐“神机”。从预算、操作习惯和拍摄场景出发，帮你看懂胶片、选对相机，并顺利拍完第一卷。
          </p>
          <div class="hero-actions">
            <a class="button button-primary" href="./04_knowledge/选购决策/README">
              开始选择相机
            </a>
            <a class="button button-secondary" href="./04_knowledge/科普入门/01-胶片相机到底是什么">
              5 分钟了解胶片
            </a>
          </div>
          <div class="hero-notes" aria-label="内容规模">
            <span>
              <strong>44</strong> 个视频来源
            </span>
            <span>
              <strong>82</strong> 台机型卡片
            </span>
            <span>
              <strong>150+</strong> 条知识笔记
            </span>
          </div>
        </div>

        <figure class="hero-visual">
          <div class="hero-image-frame">
            <img
              src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Nikon_FM2_et_Nikkor_50mm_f1.8.jpg?width=1600"
              alt="木桌上的尼康 FM2 胶片相机"
              loading="eager"
              decoding="async"
            />
            <span class="film-index">FRAME 01 · 35MM</span>
          </div>
          <figcaption>
            Nikon FM2 · 摄影：Patrick Dehais ·{" "}
            <a href="https://commons.wikimedia.org/wiki/File:Nikon_FM2_et_Nikkor_50mm_f1.8.jpg">
              Wikimedia Commons
            </a>
          </figcaption>
        </figure>
      </section>

      <section class="home-section path-section">
        <div class="section-heading">
          <p class="section-kicker">CHOOSE YOUR PATH</p>
          <h2>你现在最想解决什么问题？</h2>
          <p>不用从头读完整个知识库。按照你当前的状态，选择一条最短的阅读路径。</p>
        </div>

        <div class="path-grid">
          <a class="path-card path-green" href="./04_knowledge/科普入门/01-胶片相机到底是什么">
            <span class="path-number">01</span>
            <span class="path-tag">完全零基础 · 约 5 分钟</span>
            <h3>先弄懂胶片是什么</h3>
            <p>相机为什么不用充电也能拍？胶卷、冲洗和扫描分别是什么？先完成最基础的扫盲。</p>
            <span class="card-link">进入新手入门 →</span>
          </a>

          <a class="path-card path-blue" href="./04_knowledge/知识百科/01-相机类型详解">
            <span class="path-number">02</span>
            <span class="path-tag">知道一点 · 系统学习</span>
            <h3>建立完整知识框架</h3>
            <p>看懂相机类型、品牌系统、胶卷、曝光、装卷、冲扫，以及常见的选购陷阱。</p>
            <span class="card-link">打开知识百科 →</span>
          </a>

          <a class="path-card path-orange" href="./04_knowledge/选购决策/README">
            <span class="path-number">03</span>
            <span class="path-tag">准备购买 · 分步决策</span>
            <h3>直接帮我选相机</h3>
            <p>从拍摄场景、预算和操作习惯开始，逐步缩小范围，不再被几十台热门机型绕晕。</p>
            <span class="card-link">开始选购流程 →</span>
          </a>

          <a class="path-card path-red" href="./04_knowledge/知识百科/03-推荐机型大全">
            <span class="path-number">04</span>
            <span class="path-tag">已有目标 · 快速查询</span>
            <h3>查找具体机型</h3>
            <p>浏览 82 台胶片相机，快速查看类型、价格、优缺点、适合人群和同价位替代方案。</p>
            <span class="card-link">浏览机型大全 →</span>
          </a>
        </div>
      </section>

      <section class="home-section decision-section">
        <div class="section-heading split-heading">
          <div>
            <p class="section-kicker">BUYING DECISIONS</p>
            <h2>先回答三个问题，再看机型</h2>
          </div>
          <p>“哪台最好”通常没有答案。预算、自动化程度和使用场景，才真正决定哪台相机适合你。</p>
        </div>

        <div class="decision-grid">
          <article class="decision-card">
            <span class="decision-icon" aria-hidden="true">
              ¥
            </span>
            <p class="decision-label">问题一</p>
            <h3>你的完整预算是多少？</h3>
            <p>别只计算机身。镜头、胶卷、冲扫、电池和维修成本都应该放进第一年预算。</p>
            <a href="./04_knowledge/选购决策/Step2-确定你的预算">按预算选择 →</a>
          </article>

          <article class="decision-card">
            <span class="decision-icon" aria-hidden="true">
              A / M
            </span>
            <p class="decision-label">问题二</p>
            <h3>你想多自动，还是多手动？</h3>
            <p>全自动适合记录生活，A 档适合温和入门，全机械则适合认真学习曝光与操作。</p>
            <a href="./04_knowledge/知识百科/01-相机类型详解">比较相机类型 →</a>
          </article>

          <article class="decision-card">
            <span class="decision-icon" aria-hidden="true">
              ◎
            </span>
            <p class="decision-label">问题三</p>
            <h3>你最常在什么场景拍？</h3>
            <p>旅行、街拍、人像和日常记录，对体积、对焦速度、镜头和可靠性的要求完全不同。</p>
            <a href="./04_knowledge/选购决策/Step1-确定你的场景">按场景判断 →</a>
          </article>
        </div>
      </section>

      <section class="home-section featured-section">
        <div class="section-heading split-heading">
          <div>
            <p class="section-kicker">STARTING POINTS</p>
            <h2>四种典型入门方向</h2>
          </div>
          <a class="text-link" href="./04_knowledge/知识百科/03-推荐机型大全">
            查看全部 82 台机型 →
          </a>
        </div>

        <div class="camera-grid">
          <a class="camera-card" href="./02_atoms/models/尼康-FE">
            <div class="camera-card-visual visual-aperture">
              <span>01</span>
            </div>
            <div class="camera-card-body">
              <p class="camera-meta">电子快门单反 · 自动曝光</p>
              <h3>尼康 FE</h3>
              <p>保留手动对焦和过片体验，同时用 A 档降低曝光学习门槛。</p>
              <div class="camera-tags">
                <span>温和入门</span>
                <span>F 卡口</span>
              </div>
            </div>
          </a>

          <a class="camera-card" href="./02_atoms/models/奥林巴斯-mju-1">
            <div class="camera-card-visual visual-flash">
              <span>02</span>
            </div>
            <div class="camera-card-body">
              <p class="camera-meta">自动傻瓜机 · 轻便随身</p>
              <h3>奥林巴斯 mju-1</h3>
              <p>适合旅行和日常记录，比热门的 mju-2 更理性、更容易控制预算。</p>
              <div class="camera-tags">
                <span>全自动</span>
                <span>便携</span>
              </div>
            </div>
          </a>

          <a class="camera-card" href="./02_atoms/models/尼康-F-601">
            <div class="camera-card-visual visual-grid">
              <span>03</span>
            </div>
            <div class="camera-card-body">
              <p class="camera-meta">自动对焦单反 · 高性价比</p>
              <h3>尼康 F-601</h3>
              <p>操作接近现代数码相机，价格却非常低，是被低估的实用型选择。</p>
              <div class="camera-tags">
                <span>自动对焦</span>
                <span>预算友好</span>
              </div>
            </div>
          </a>

          <a class="camera-card" href="./02_atoms/models/宾得-K1000">
            <div class="camera-card-visual visual-sprocket">
              <span>04</span>
            </div>
            <div class="camera-card-body">
              <p class="camera-meta">全机械单反 · 手动学习</p>
              <h3>宾得 K1000</h3>
              <p>结构简单、操作直接，适合真正想学会测光、光圈和快门关系的人。</p>
              <div class="camera-tags">
                <span>全机械</span>
                <span>摄影学习</span>
              </div>
            </div>
          </a>
        </div>
      </section>

      <section class="home-section knowledge-section">
        <div class="section-heading">
          <p class="section-kicker">BEFORE THE FIRST ROLL</p>
          <h2>拍第一卷之前，先看这四件事</h2>
        </div>

        <div class="knowledge-grid">
          <a href="./04_knowledge/科普入门/03-胶卷是怎么回事">
            <span>FILM</span>
            <h3>胶卷怎么选</h3>
            <p>彩负、黑白、反转片，以及 ISO 100、200、400 的区别。</p>
          </a>
          <a href="./04_knowledge/知识百科/05-从装卷到出片">
            <span>PROCESS</span>
            <h3>从装卷到出片</h3>
            <p>装卷、拍摄、回卷、送洗和扫描的完整流程。</p>
          </a>
          <a href="./02_atoms/concepts/二手胶片相机验机清单">
            <span>CHECK</span>
            <h3>二手验机清单</h3>
            <p>快门、测光、漏光、霉菌、排线和电池仓应该怎么检查。</p>
          </a>
          <a href="./04_knowledge/科普入门/04-拍胶卷要花多少钱">
            <span>COST</span>
            <h3>算清真实成本</h3>
            <p>相机只是一次性支出，胶卷与冲扫才是长期成本。</p>
          </a>
        </div>
      </section>

      <section class="home-section source-section">
        <div class="source-copy">
          <p class="section-kicker">HOW THIS GUIDE WAS BUILT</p>
          <h2>
            不是一份机型排行榜，
            <br />
            而是一套可以持续生长的知识系统。
          </h2>
          <p>内容来自 44 个胶片摄影相关视频，经过采集、重写、拆解和结构化，最终形成学习文章、决策页面与机型卡片。</p>
        </div>
        <div class="source-flow" aria-label="内容生产流程">
          <div>
            <strong>44</strong>
            <span>视频与资料</span>
          </div>
          <i>→</i>
          <div>
            <strong>150+</strong>
            <span>原子知识笔记</span>
          </div>
          <i>→</i>
          <div>
            <strong>18</strong>
            <span>系统学习文章</span>
          </div>
          <i>→</i>
          <div>
            <strong>1</strong>
            <span>选购知识网站</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default (() => HomePage) satisfies QuartzComponentConstructor

document.addEventListener("nav", () => {
  const cards = document.querySelectorAll<HTMLElement>(".bilibili-card[data-bvid]")

  cards.forEach((card) => {
    const button = card.querySelector<HTMLButtonElement>(".bilibili-play")
    const cover = card.querySelector<HTMLElement>(".bilibili-cover")
    const bvid = card.dataset.bvid
    if (!button || !cover || !bvid) return

    const loadPlayer = () => {
      if (cover.querySelector("iframe")) return
      const iframe = document.createElement("iframe")
      iframe.src = `https://player.bilibili.com/player.html?bvid=${encodeURIComponent(bvid)}&page=1&high_quality=1&danmaku=0`
      iframe.title = "Bilibili 视频播放器"
      iframe.allow = "autoplay; fullscreen; picture-in-picture"
      iframe.allowFullscreen = true
      iframe.referrerPolicy = "no-referrer-when-downgrade"
      iframe.loading = "lazy"
      cover.replaceChildren(iframe)
      card.classList.add("is-playing")
    }

    button.addEventListener("click", loadPlayer)
    window.addCleanup(() => button.removeEventListener("click", loadPlayer))
  })
})
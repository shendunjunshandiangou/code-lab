document.addEventListener("nav", () => {
  const finder = document.querySelector<HTMLElement>(".quick-finder")
  if (!finder) return

  const buttons = finder.querySelectorAll<HTMLButtonElement>(".finder-option")
  const cards = finder.querySelectorAll<HTMLElement>(".finder-result-card")
  const resultCount = finder.querySelector<HTMLElement>(".finder-result-count")
  const reset = finder.querySelector<HTMLButtonElement>(".finder-reset")

  const currentFilters: Record<string, string> = {
    budget: "all",
    autonomy: "all",
    scene: "all",
    format: "all",
  }

  const applyFilters = () => {
    let visible = 0
    cards.forEach((card) => {
      const matches = Object.entries(currentFilters).every(([key, value]) => {
        if (value === "all") return true
        const values = (card.dataset[key] ?? "").split(",")
        return values.includes(value)
      })
      card.hidden = !matches
      if (matches) visible += 1
    })
    if (resultCount) resultCount.textContent = `${visible} 台推荐`
  }

  const onSelect = (event: Event) => {
    const button = event.currentTarget as HTMLButtonElement
    const group = button.dataset.group
    const value = button.dataset.value
    if (!group || !value) return

    currentFilters[group] = value
    finder.querySelectorAll<HTMLButtonElement>(`.finder-option[data-group="${group}"]`).forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button))
    })
    applyFilters()
  }

  const resetFilters = () => {
    Object.keys(currentFilters).forEach((key) => (currentFilters[key] = "all"))
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.value === "all")))
    applyFilters()
  }

  buttons.forEach((button) => button.addEventListener("click", onSelect))
  reset?.addEventListener("click", resetFilters)
  applyFilters()

  const heroVideo = document.querySelector<HTMLVideoElement>(".commercial-hero video")
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
  if (heroVideo && motionQuery.matches) heroVideo.pause()

  window.addCleanup(() => {
    buttons.forEach((button) => button.removeEventListener("click", onSelect))
    reset?.removeEventListener("click", resetFilters)
  })
})
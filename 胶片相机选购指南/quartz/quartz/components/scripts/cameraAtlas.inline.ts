const initCameraAtlas = () => {
  document.querySelectorAll<HTMLElement>("[data-camera-atlas]").forEach((root) => {
    if (root.dataset.cameraAtlasReady === "true") return
    root.dataset.cameraAtlasReady = "true"

    const grid = root.querySelector<HTMLElement>("[data-camera-grid]")
    const count = root.querySelector<HTMLElement>("[data-camera-count]")
    const empty = root.querySelector<HTMLElement>("[data-camera-empty]")
    const more = root.querySelector<HTMLButtonElement>("[data-camera-more]")
    const reset = root.querySelector<HTMLButtonElement>("[data-camera-reset]")
    const controls = Array.from(root.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-camera-filter]"))
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-camera-card]"))
    if (!grid || !count || cards.length === 0) return

    let visibleLimit = 24

    const getValue = (name: string) =>
      (root.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-camera-filter="${name}"]`)?.value ?? "").trim()

    const matches = (card: HTMLElement) => {
      const query = getValue("query").toLocaleLowerCase()
      const brand = getValue("brand")
      const type = getValue("type")
      const control = getValue("control")
      const format = getValue("format")
      const budget = getValue("budget")
      const scene = getValue("scene")

      if (query && !(card.dataset.search ?? "").toLocaleLowerCase().includes(query)) return false
      if (brand && card.dataset.brand !== brand) return false
      if (type && card.dataset.type !== type) return false
      if (control && card.dataset.control !== control) return false
      if (format && card.dataset.format !== format) return false
      if (budget && card.dataset.budget !== budget) return false
      if (scene && !(card.dataset.scenes ?? "").split("|").includes(scene)) return false
      return true
    }

    const sortCards = (items: HTMLElement[]) => {
      const sort = getValue("sort") || "recommended"
      return [...items].sort((a, b) => {
        if (sort === "price") return Number(a.dataset.price ?? 999999) - Number(b.dataset.price ?? 999999)
        if (sort === "year") return Number(a.dataset.year ?? 9999) - Number(b.dataset.year ?? 9999)
        if (sort === "name") return (a.dataset.name ?? "").localeCompare(b.dataset.name ?? "", "zh-CN")

        const rankDiff = Number(a.dataset.rank ?? 9) - Number(b.dataset.rank ?? 9)
        if (rankDiff !== 0) return rankDiff
        const priceDiff = Number(a.dataset.price ?? 999999) - Number(b.dataset.price ?? 999999)
        if (priceDiff !== 0) return priceDiff
        return (a.dataset.name ?? "").localeCompare(b.dataset.name ?? "", "zh-CN")
      })
    }

    const render = () => {
      const filtered = sortCards(cards.filter(matches))
      filtered.forEach((card) => grid.appendChild(card))
      cards.filter((card) => !filtered.includes(card)).forEach((card) => grid.appendChild(card))

      cards.forEach((card) => (card.hidden = true))
      filtered.slice(0, visibleLimit).forEach((card) => (card.hidden = false))

      count.textContent = `${filtered.length} 台符合当前条件`
      if (empty) empty.hidden = filtered.length > 0
      if (more) more.hidden = filtered.length <= visibleLimit
    }

    controls.forEach((control) => {
      const eventName = control instanceof HTMLInputElement ? "input" : "change"
      control.addEventListener(eventName, () => {
        visibleLimit = 24
        render()
      })
    })

    reset?.addEventListener("click", () => {
      controls.forEach((control) => (control.value = ""))
      const sort = root.querySelector<HTMLSelectElement>('[data-camera-filter="sort"]')
      if (sort) sort.value = "recommended"
      visibleLimit = 24
      render()
    })

    more?.addEventListener("click", () => {
      visibleLimit += 24
      render()
    })

    render()
  })
}

initCameraAtlas()
document.addEventListener("nav", initCameraAtlas)

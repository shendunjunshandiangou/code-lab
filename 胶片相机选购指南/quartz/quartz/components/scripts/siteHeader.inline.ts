document.addEventListener("nav", () => {
  const button = document.querySelector<HTMLButtonElement>(".site-menu-button")
  const navigation = document.querySelector<HTMLElement>(".site-primary-nav")
  const header = document.querySelector<HTMLElement>(".page-header header")
  if (!button || !navigation) return

  let lockedScrollY = 0
  let viewportFrame = 0

  const updateMobileViewport = () => {
    cancelAnimationFrame(viewportFrame)
    viewportFrame = requestAnimationFrame(() => {
      if (window.innerWidth > 960) {
        document.documentElement.style.removeProperty("--mobile-nav-top")
        document.documentElement.style.removeProperty("--mobile-nav-height")
        return
      }

      const viewportHeight = window.visualViewport?.height ?? window.innerHeight
      const headerBottom = Math.max(0, header?.getBoundingClientRect().bottom ?? 68)
      const navHeight = Math.max(240, viewportHeight - headerBottom)
      document.documentElement.style.setProperty("--mobile-nav-top", `${Math.round(headerBottom)}px`)
      document.documentElement.style.setProperty("--mobile-nav-height", `${Math.round(navHeight)}px`)
    })
  }

  const unlockPage = () => {
    const wasLocked = document.body.classList.contains("menu-open")
    document.body.classList.remove("menu-open")
    document.body.style.removeProperty("position")
    document.body.style.removeProperty("top")
    document.body.style.removeProperty("left")
    document.body.style.removeProperty("right")
    if (wasLocked) window.scrollTo(0, lockedScrollY)
  }

  const closeMenu = () => {
    button.setAttribute("aria-expanded", "false")
    navigation.classList.remove("is-open")
    unlockPage()
  }

  const openMenu = () => {
    lockedScrollY = window.scrollY
    updateMobileViewport()
    button.setAttribute("aria-expanded", "true")
    navigation.classList.add("is-open")
    navigation.scrollTop = 0
    document.body.classList.add("menu-open")
    document.body.style.position = "fixed"
    document.body.style.top = `-${lockedScrollY}px`
    document.body.style.left = "0"
    document.body.style.right = "0"
    requestAnimationFrame(updateMobileViewport)
  }

  const toggleMenu = () => {
    const nextOpen = button.getAttribute("aria-expanded") !== "true"
    if (nextOpen) openMenu()
    else closeMenu()
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") closeMenu()
  }

  const onResize = () => {
    updateMobileViewport()
    if (window.innerWidth > 960 && button.getAttribute("aria-expanded") === "true") closeMenu()
  }

  updateMobileViewport()
  button.addEventListener("click", toggleMenu)
  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu))
  document.addEventListener("keydown", onKeydown)
  window.addEventListener("resize", onResize)
  window.visualViewport?.addEventListener("resize", updateMobileViewport)
  window.visualViewport?.addEventListener("scroll", updateMobileViewport)

  window.addCleanup(() => {
    closeMenu()
    cancelAnimationFrame(viewportFrame)
    document.documentElement.style.removeProperty("--mobile-nav-top")
    document.documentElement.style.removeProperty("--mobile-nav-height")
    button.removeEventListener("click", toggleMenu)
    navigation.querySelectorAll("a").forEach((link) => link.removeEventListener("click", closeMenu))
    document.removeEventListener("keydown", onKeydown)
    window.removeEventListener("resize", onResize)
    window.visualViewport?.removeEventListener("resize", updateMobileViewport)
    window.visualViewport?.removeEventListener("scroll", updateMobileViewport)
  })
})

document.addEventListener("nav", () => {
  const button = document.querySelector<HTMLButtonElement>(".site-menu-button")
  const navigation = document.querySelector<HTMLElement>(".site-primary-nav")
  if (!button || !navigation) return

  let lockedScrollY = 0

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
    button.setAttribute("aria-expanded", "true")
    navigation.classList.add("is-open")
    navigation.scrollTop = 0
    document.body.classList.add("menu-open")
    document.body.style.position = "fixed"
    document.body.style.top = `-${lockedScrollY}px`
    document.body.style.left = "0"
    document.body.style.right = "0"
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
    if (window.innerWidth > 960 && button.getAttribute("aria-expanded") === "true") closeMenu()
  }

  button.addEventListener("click", toggleMenu)
  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu))
  document.addEventListener("keydown", onKeydown)
  window.addEventListener("resize", onResize)

  window.addCleanup(() => {
    closeMenu()
    button.removeEventListener("click", toggleMenu)
    navigation.querySelectorAll("a").forEach((link) => link.removeEventListener("click", closeMenu))
    document.removeEventListener("keydown", onKeydown)
    window.removeEventListener("resize", onResize)
  })
})

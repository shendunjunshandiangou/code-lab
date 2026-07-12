document.addEventListener("nav", () => {
  const button = document.querySelector<HTMLButtonElement>(".site-menu-button")
  const navigation = document.querySelector<HTMLElement>(".site-primary-nav")
  if (!button || !navigation) return

  const closeMenu = () => {
    button.setAttribute("aria-expanded", "false")
    navigation.classList.remove("is-open")
    document.body.classList.remove("menu-open")
  }

  const toggleMenu = () => {
    const nextOpen = button.getAttribute("aria-expanded") !== "true"
    button.setAttribute("aria-expanded", String(nextOpen))
    navigation.classList.toggle("is-open", nextOpen)
    document.body.classList.toggle("menu-open", nextOpen)
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") closeMenu()
  }

  button.addEventListener("click", toggleMenu)
  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu))
  document.addEventListener("keydown", onKeydown)

  window.addCleanup(() => {
    button.removeEventListener("click", toggleMenu)
    navigation.querySelectorAll("a").forEach((link) => link.removeEventListener("click", closeMenu))
    document.removeEventListener("keydown", onKeydown)
  })
})
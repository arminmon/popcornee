import goTo from 'vuetify/es5/services/goto'

export default (to, from, savedPosition) => {
  let position = null

  const page = to.matched
    .filter((i) => i.components.default.options.scrollTo !== undefined)
    .pop()

  if (page) {
    const scrollTo = page.components.default.options.scrollTo

    if (scrollTo && scrollTo.startsWith('#')) position = scrollTo

    if (scrollTo === 'top') position = 0
  }

  if (savedPosition) position = savedPosition

  if (to.hash) position = to.hash

  if (position !== null)
    return new Promise((resolve) => {
      goTo(position)
    })
}

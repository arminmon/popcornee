import goTo from 'vuetify/es5/services/goto'

export default (to, from, savedPosition) => {
  let position = null

  const scrollTo = String(
    to.matched[to.matched.length - 1].components.default.options.scrollTo
  )

  if (scrollTo && scrollTo.startsWith('#')) position = scrollTo

  if (scrollTo === 'top') position = 0

  if (savedPosition) position = savedPosition

  if (to.hash) position = to.hash

  if (position !== null)
    return new Promise((resolve) => {
      goTo(position)
    })
}

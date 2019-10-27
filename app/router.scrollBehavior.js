import goTo from 'vuetify/es5/services/goto'

export default (to, from, savedPosition) => {
	if (to.path == from.path) {
		if (to.hash) return to.hash.startsWith('#tab--') ? null : goTo(to.hash)
		else return null
	} else return goTo(0)
}

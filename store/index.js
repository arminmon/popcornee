/* STATE (store stuff) */
export const state = () => ({
	drawer: false,
	configs: null,
	genres: { all: {}, movies: [], series: [] },
	certifications: { movies: null, series: null }
})

/* MUTATIONS (put stuff in store) */
export const mutations = {
	SET_DRAWER(state, value) {
		state.drawer = value
	},
	SET_CONFIGS(state, configs) {
		state.configs = configs
	},
	SET_GENRES(state, genres) {
		state.genres[genres.type] = genres.list
		for (let genre of genres.list) state.genres.all[genre.id] = genre.name
	},
	SET_CERTS(state, certs) {
		state.certifications[certs.type] = certs.list
	}
}

/* GETTERS (return stuff from store) */
export const getters = {
	imgURL: (state) => (path, type, size) => (path ? `${state.configs.images.secure_base_url}${state.configs.images[type + '_sizes'][size]}${path}` : '/null.png'),
	genreName: (state) => (id) => state.genres.all[id]
}

/* ACTIONS (prepare stuff for store) */
export const actions = {
	async FETCH_CONFIGS({ commit, state }) {
		if (state.configs == null) await this.$api.tmdb(['configuration']).then((response) => commit('SET_CONFIGS', response))
	},
	async FETCH_GENRES({ commit, state }) {
		if (state.genres.movies.length == 0) await this.$api.tmdb(['genre', 'movie', 'list']).then((response) => commit('SET_GENRES', { type: 'movies', list: response.genres }))
		if (state.genres.series.length == 0) await this.$api.tmdb(['genre', 'tv', 'list']).then((response) => commit('SET_GENRES', { type: 'series', list: response.genres }))
	},
	async FETCH_CERTS({ commit, state }) {
		if (state.certifications.movies == null) await this.$api.tmdb(['certification', 'movie', 'list']).then((response) => commit('SET_CERTS', { type: 'movies', list: response.certifications }))
		if (state.certifications.series == null) await this.$api.tmdb(['certification', 'tv', 'list']).then((response) => commit('SET_CERTS', { type: 'series', list: response.certifications }))
	}
}

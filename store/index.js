/* STATE (store stuff) */
export const state = () => ({
	drawer: false,
	appBar: {
		collapsed: false
	},
	progress: {
		active: false,
		value: 0,
		color: "primary"
	},
	snackbar: {},
	configs: null,
	genres: { all: {}, movies: [], series: [] },
	certifications: { movies: null, series: null }
});

/* MUTATIONS (put stuff in store) */
export const mutations = {
	SET_DRAWER(state, value) {
		state.drawer = value;
	},
	COLLAPSE_APP_BAR(state, value) {
		state.appBar.collapsed = value;
	},
	SET_PROGRESS_ACTIVE(state, value) {
		state.progress.active = value;
	},
	SET_PROGRESS_VALUE(state, value) {
		state.progress.value = value;
	},
	SET_PROGRESS_COLOR(state, value) {
		state.progress.color = value;
	},
	SET_SNACKBAR(state, text) {
		state.snackbar = text;
	},
	SET_CONFIGS(state, configs) {
		state.configs = configs;
	},
	SET_GENRES(state, genres) {
		state.genres[genres.type] = genres.list;
		for (let genre of genres.list) state.genres.all[genre.id] = genre.name;
	},
	SET_CERTS(state, certs) {
		state.certifications[certs.type] = certs.list;
	}
};

/* GETTERS (return stuff from store) */
export const getters = {
	appBar: state => state.appBar,
	progress: state => state.progress,
	imgURL: state => (path, type, size) =>
		path
			? `${state.configs.images.secure_base_url}${
					state.configs.images[type + "_sizes"][size]
			  }${path}`
			: "/null.png",
	genreName: state => id => state.genres.all[id]
};

/* ACTIONS (prepare stuff for store) */
export const actions = {
	async FETCH_CONFIGS({ commit, state, error }) {
		if (state.configs == null)
			await this.$api.tmdb
				.get("configuration")
				.then(res => commit("SET_CONFIGS", res))
				.catch(e => error(e));
	},
	async FETCH_GENRES({ commit, state, error }) {
		if (state.genres.movies.length == 0)
			await this.$api.tmdb
				.get("genre/movie/list")
				.then(res => commit("SET_GENRES", { type: "movies", list: res.genres }))
				.catch(e => error(e));
		if (state.genres.series.length == 0)
			await this.$api.tmdb
				.get("genre/tv/list")
				.then(res => commit("SET_GENRES", { type: "series", list: res.genres }))
				.catch(e => error(e));
	},
	async FETCH_CERTS({ commit, state, error }) {
		if (state.certifications.movies == null)
			await this.$api.tmdb
				.get("certification/movie/list")
				.then(res =>
					commit("SET_CERTS", { type: "movies", list: res.certifications })
				)
				.catch(e => error(e));
		if (state.certifications.series == null)
			await this.$api.tmdb
				.get("certification/tv/list")
				.then(res =>
					commit("SET_CERTS", { type: "series", list: res.certifications })
				)
				.catch(e => error(e));
	}
};

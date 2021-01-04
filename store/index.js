/* STATE (store stuff) */
export const state = () => ({
  drawer: false,
  appBarCollapsed: false,
  progress: {
    active: false,
    value: 0,
    color: 'primary',
  },
  configs: null,
  genres: { all: {}, movies: [], series: [] },
  certifications: { movies: null, series: null },
})

/* MUTATIONS (put stuff in store) */
export const mutations = {
  SET_DRAWER(state, value) {
    state.drawer = value
  },
  COLLAPSE_APP_BAR(state, value) {
    state.appBarCollapsed = value
  },
  SET_PROGRESS_ACTIVE(state, value) {
    state.progress.active = value
  },
  SET_PROGRESS_VALUE(state, value) {
    state.progress.value = value
  },
  SET_PROGRESS_COLOR(state, value) {
    state.progress.color = value
  },
  SET_CONFIGS(state, configs) {
    state.configs = configs
  },
  SET_GENRES(state, genres) {
    state.genres[genres.type] = genres.list
    for (const genre of genres.list) state.genres.all[genre.id] = genre.name
  },
  SET_CERTS(state, certs) {
    state.certifications[certs.type] = certs.list
  },
}

/* GETTERS (return stuff from store) */
export const getters = {
  appBarCollapsed: (state) => state.appBarCollapsed,
  progress: (state) => state.progress,
  imgURL: (state) => (path, type, size) =>
    path
      ? `${state.configs.images.secure_base_url}${
          state.configs.images[type + '_sizes'][size]
        }${path}`
      : '/null.png',
  genreName: (state) => (id) => state.genres.all[id],
}

/* ACTIONS (prepare stuff for store) */
export const actions = {
  async FETCH_CONFIGS({ commit, state }) {
    if (state.configs == null)
      await this.$axios
        .$get('configuration')
        .then((res) => commit('SET_CONFIGS', res))
  },
  async FETCH_GENRES({ commit, state }) {
    if (state.genres.movies.length === 0)
      await this.$axios
        .$get('genre/movie/list')
        .then((res) =>
          commit('SET_GENRES', { type: 'movies', list: res.genres })
        )
    if (state.genres.series.length === 0)
      await this.$axios
        .$get('genre/tv/list')
        .then((res) =>
          commit('SET_GENRES', { type: 'series', list: res.genres })
        )
  },
  async FETCH_CERTS({ commit, state }) {
    if (state.certifications.movies == null)
      await this.$axios
        .$get('certification/movie/list')
        .then((res) =>
          commit('SET_CERTS', { type: 'movies', list: res.certifications })
        )
    if (state.certifications.series == null)
      await this.$axios
        .$get('certification/tv/list')
        .then((res) =>
          commit('SET_CERTS', { type: 'series', list: res.certifications })
        )
  },
}

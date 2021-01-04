<template lang="pug">
v-main
	v-container(fluid)
		media-iterator(:media='movies' default-view='narrow' title="Top Rated Movies" resource='movie/top_rated')
</template>

<script>
export default {
  asyncData: ({ app, error }) =>
    app.$api.tmdb
      .get('movie/top_rated')
      .then((res) => ({ movies: res }))
      .catch((e) => error(e)),
  fetch: async ({ store }) => {
    await store.dispatch('FETCH_CONFIGS')
    await store.dispatch('FETCH_GENRES')
  },
  head: {
    title: 'Top Rated Movies',
  },
  mounted() {
    this.$store.commit('COLLAPSE_APP_BAR', false)
  },
}
</script>

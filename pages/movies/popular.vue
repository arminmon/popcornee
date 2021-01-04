<template lang="pug">
v-main
	v-container(fluid)
		media-iterator(:media='movies' default-view='narrow' title="Popular Movies" resource='movie/popular')
</template>

<script>
export default {
  asyncData: ({ app, error }) =>
    app.$api.tmdb
      .get('movie/popular')
      .then((res) => ({ movies: res }))
      .catch((e) => error(e)),
  fetch: async ({ store }) => {
    await store.dispatch('FETCH_CONFIGS')
    await store.dispatch('FETCH_GENRES')
  },
  head: {
    title: 'Popular Movies',
  },
  mounted() {
    this.$store.commit('COLLAPSE_APP_BAR', false)
  },
}
</script>

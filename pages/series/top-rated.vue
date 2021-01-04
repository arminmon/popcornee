<template lang="pug">
v-main
	v-container(fluid)
		media-iterator(:media='series' default-view='narrow' title="Top Rated Series" resource='tv/top_rated')
</template>

<script>
export default {
  asyncData: ({ app, error }) =>
    app.$api.tmdb
      .get('tv/top_rated')
      .then((res) => ({ series: res }))
      .catch((e) => error(e)),
  fetch: async ({ store }) => {
    await store.dispatch('FETCH_CONFIGS')
    await store.dispatch('FETCH_GENRES')
  },
  head: {
    title: 'Top Rated Series',
  },
  mounted() {
    this.$store.commit('COLLAPSE_APP_BAR', false)
  },
}
</script>

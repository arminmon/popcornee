<template lang="pug">
v-main
	v-container(fluid)
		media-iterator(:media='movies' default-view='narrow' title="Top Rated Movies" resource='movie/top_rated')
</template>

<script>
export default {
  asyncData: ({ $axios }) =>
    $axios.$get('movie/top_rated').then((res) => ({ movies: res })),
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

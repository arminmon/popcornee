<template lang="pug">
v-main
	v-container(fluid)
		media-iterator(:media='movies' default-view='narrow' title="Popular Movies" resource='movie/popular')
</template>

<script>
export default {
  asyncData: ({ $axios }) =>
    $axios.$get('movie/popular').then((res) => ({ movies: res })),
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

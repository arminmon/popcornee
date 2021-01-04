<template lang="pug">
v-main
	v-container(fluid)
		media-iterator(:media='movies' default-view='narrow' title="Upcoming Movies" resource='movie/upcoming')
</template>

<script>
export default {
  asyncData: ({ $axios }) =>
    $axios.$get('movie/upcoming').then((res) => ({ movies: res })),
  fetch: async ({ store }) => {
    await store.dispatch('FETCH_CONFIGS')
    await store.dispatch('FETCH_GENRES')
  },
  head: {
    title: 'Upcoming Movies',
  },
  mounted() {
    this.$store.commit('COLLAPSE_APP_BAR', false)
  },
}
</script>

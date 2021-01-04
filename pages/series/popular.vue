<template lang="pug">
v-main
	v-container(fluid)
		media-iterator(:media='series' default-view='narrow' title="Popular Series" resource='tv/popular')
</template>

<script>
export default {
  asyncData: ({ $axios }) =>
    $axios.$get('tv/popular').then((res) => ({ series: res })),
  fetch: async ({ store }) => {
    await store.dispatch('FETCH_CONFIGS')
    await store.dispatch('FETCH_GENRES')
  },
  head: {
    title: 'Popular Series',
  },
  mounted() {
    this.$store.commit('COLLAPSE_APP_BAR', false)
  },
}
</script>

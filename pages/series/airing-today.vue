<template lang="pug">
v-main
	v-container(fluid)
		media-iterator(:media='series' default-view='narrow' title="Airing Today" resource='tv/airing_today')
</template>

<script>
export default {
  scrollTo: 'top',
  asyncData: ({ $axios }) =>
    $axios.$get('tv/airing_today').then((res) => ({ series: res })),
  fetch: async ({ store }) => {
    await store.dispatch('FETCH_CONFIGS')
    await store.dispatch('FETCH_GENRES')
  },
  head: {
    title: 'Airing Today',
  },
  mounted() {
    this.$store.commit('COLLAPSE_APP_BAR', false)
  },
}
</script>

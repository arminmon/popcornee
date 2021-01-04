<template lang="pug">
v-main
	v-container(fluid)
		media-iterator(:media='all' default-view='narrow' title="Today's Trending Movies & Series" resource='trending/all/day')
</template>

<script>
export default {
  asyncData: ({ $axios }) =>
    $axios.$get('trending/all/day').then((res) => ({ all: res })),
  fetch: async ({ store }) => {
    await store.dispatch('FETCH_CONFIGS')
    await store.dispatch('FETCH_GENRES')
  },
  head: {
    title: "Today's Trending Movies & Series",
  },
  mounted() {
    this.$store.commit('COLLAPSE_APP_BAR', false)
  },
}
</script>

<template lang="pug">
v-main
	v-container(fluid)
		media-iterator(:media='all' default-view='narrow' title="Today's Trending Movies & Series" resource='trending/all/day')
</template>

<script>
import MediaIterator from '~/components/shared/iterators/MediaIterator'
export default {
	components: {
		MediaIterator
	},
	fetch: async ({ store }) => {
		await store.dispatch('FETCH_CONFIGS')
		await store.dispatch('FETCH_GENRES')
	},
	asyncData: ({ app, error }) =>
		app.$api.tmdb
			.get('trending/all/day')
			.then((res) => ({ all: res }))
			.catch((e) => error(e)),
	mounted() {
		this.$store.commit('COLLAPSE_APP_BAR', false)
	},
	head: {
		title: "Today's Trending Movies & Series"
	}
}
</script>

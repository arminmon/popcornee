<template lang="pug">
v-content
	v-container(fluid)
		media-iterator(:media='all' title='All' :resource='["trending", "all", "day"]')
</template>

<script>
	import MediaIterator from "~/components/iterators/MediaIterator";
	export default {
		components: {
			MediaIterator
		},
		fetch: async ({ store }) => {
			await store.dispatch("FETCH_CONFIGS");
			await store.dispatch("FETCH_GENRES");
		},
		asyncData: ({ app }) =>
			app.$api
				.tmdb(["trending", "all", "day"])
				.then(response => ({ all: response }))
				.catch(error => console.error(error))
	};
</script>

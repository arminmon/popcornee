<template lang="pug">
v-content
	v-container(fluid)
		media-iterator(:media='series' default-view='narrow' title="Popular Series" resource='tv/popular')
</template>

<script>
	import MediaIterator from "~/components/shared/iterators/MediaIterator";
	export default {
		components: {
			MediaIterator
		},
		fetch: async ({ store }) => {
			await store.dispatch("FETCH_CONFIGS");
			await store.dispatch("FETCH_GENRES");
		},
		head: {
			title: "Popular Series"
		},
		asyncData: ({ app, error }) =>
			app.$api.tmdb
				.get("tv/popular")
				.then(res => ({ series: res }))
				.catch(e => error(e)),
		mounted() {
			this.$store.commit("COLLAPSE_APP_BAR", false);
		}
	};
</script>

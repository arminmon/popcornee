<template lang="pug">
v-content
	v-container(fluid)
		media-iterator(:media='movies' default-view='narrow' title="Popular Movies" resource='movie/popular')
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
			title: "Popular Movies"
		},
		asyncData: ({ app, error }) =>
			app.$api.tmdb
				.get("movie/popular")
				.then(res => ({ movies: res }))
				.catch(e => error(e)),
		mounted() {
			this.$store.commit("COLLAPSE_APP_BAR", false);
		}
	};
</script>

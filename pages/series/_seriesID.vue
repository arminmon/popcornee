<template lang="pug">
	nuxt-child(:series='series')
</template>

<script>
	export default {
		validate({ params }) {
			return /^\d+$/.test(params.seriesID);
		},
		fetch: async ({ store }) => {
			await store.dispatch("FETCH_CONFIGS");
			await store.dispatch("FETCH_GENRES");
		},
		asyncData: ({ app, params }) =>
			app.$api
				.tmdb(["tv", params.seriesID], {
					append_to_response: [
						"credits",
						"keywords",
						"external_ids",
						"videos",
						"recommendations",
						"similar",
						"reviews",
						"content_ratings"
					].join()
				})
				.then(response => ({ series: response }))
				.catch(error => console.error(error))
	};
</script>
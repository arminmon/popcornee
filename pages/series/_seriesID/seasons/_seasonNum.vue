<template lang="pug">
	nuxt-child(:series='{ id: series.id, name: series.name, original_name: series.original_name, backdrop_path: series.backdrop_path, number_of_seasons: series.number_of_seasons }' :season='season' :key='$route.params.seasonNum')
</template>

<script>
	export default {
		props: { series: Object },
		validate({ params }) {
			return /^\d+$/.test(params.seasonNum) && /^\d+$/.test(params.seriesID);
		},
		asyncData: ({ app, params }) =>
			app.$api
				.tmdb(["tv", params.seriesID, "season", params.seasonNum], {
					append_to_response: ["credits", "external_ids", "videos"].join()
				})
				.then(response => ({ season: response }))
				.catch(error => console.error(error))
	};
</script>
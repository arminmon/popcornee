<template lang="pug">
	v-content.pt-0
		v-img(
			:aspect-ratio='10'
			:min-height='collection.backdrop_path ? `100vh` : null'
			:src='$store.getters.imgURL(collection.backdrop_path, "backdrop", 2)'
			:lazy-src='$store.getters.imgURL(collection.backdrop_path, "backdrop", 0)'
			:gradient='$utils.gradient("to top", [{ alpha: "1", pos: "0%" }, { alpha: ".55", pos: "100%" }])'
			)
			template(v-slot:placeholder)
				v-row.fill-height.ma-0.pa-3(justify='end' align='start')
					v-progress-circular(indeterminate style='opacity: .25')
			.d-flex.flex-column.fill-height
				v-container.fill-height.pt-12
					v-row.fill-height.pt-12.pb-6(align='center' justify='center')
						v-col.px-6(cols='12' :sm='collection.poster_path ? 8 : 12')
							h1.display-1.font-weight-bold.mb-3 {{collection.name}}
							p(v-if='collection.overview') {{collection.overview}}
						v-col(cols='12' sm='4' v-if='collection.poster_path' :class='{"px-8": $vuetify.breakpoint.xsOnly}')
							v-hover(v-slot:default='{ hover }')
								v-card(elevation='15')
									v-img(:src='$store.getters.imgURL(collection.poster_path, "poster", 4)' :lazy-src='$store.getters.imgURL(collection.poster_path, "poster", 0)' :aspect-ratio='2/3')
										template(v-slot:placeholder)
											v-row.fill-height.ma-0.pa-3(justify='center' align='center')
												v-progress-circular(indeterminate)
										v-container.fill-height.align-end.justify-center(fluid)
											v-fab-transition
												v-btn(v-show='hover' fab small :href='`${$store.getters.imgURL(collection.poster_path,"poster",6)}`' target='_blank')
													v-icon mdi-download
		//- Collection
		v-sheet(flat)
			v-container(fluid)
				media-iterator(:media='collection.parts' default-view='wide' flat-header )
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
		asyncData: ({ app, params }) =>
			app.$api
				.tmdb(["collection", params.collectionID])
				.then(response => ({ collection: response }))
				.catch(error => console.error(error)),
		head() {
			return {
				title: this.collection.name
			};
		},
		data: _ => ({
			grid: {
				view: "narrow",
				views: [
					{
						name: "wide",
						icon: "mdi-view-agenda"
					},
					{
						name: "square",
						icon: "mdi-view-grid"
					},
					{
						name: "narrow",
						icon: "mdi-view-agenda",
						class: "mdi-rotate-90"
					}
				]
			}
		}),
		mounted() {
			if (this.$route.hash == "") this.$router.replace({ hash: "#tab--info" });
		}
	};
</script>
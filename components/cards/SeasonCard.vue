<template lang="pug">
	v-card(hover :color='$vuetify.theme.dark ? "grey darken-4" : "grey lighten-3"' nuxt :to='`/series/${seriesID}/seasons/${season.season_number}`')
		v-img(:src='$store.getters.imgURL(season.poster_path, "poster", 3)' :lazy-src='$store.getters.imgURL(season.poster_path, "poster", 3)' :aspect-ratio='2/3' :gradient='$utils.gradient("10deg", [{alpha: ".9", pos: "0%"}, {alpha: "0", pos: "55%"}])')
			template(v-slot:placeholder)
				v-row.fill-height.ma-0.pa-3(:align='season.poster_path ? "center" : "start"' :justify='season.poster_path ? "center" : "center"')
					v-progress-circular(indeterminate style='opacity: .25')
			v-container.fill-height(fluid)
				v-row.fill-height(no-gutters)
					v-col.d-flex.justify-end(align-self='start')
						v-chip.overline(:small='$vuetify.breakpoint.mdAndUp' :x-small='$vuetify.breakpoint.smAndDown')
							span.font-weight-black.me-1 {{season.episode_count}}
							span {{season.episode_count > 1 ? "Episodes" : "Episode"}}
					v-col(cols='12' :align-self='season.poster_path ? "end" : "center"' :class='{"text-center": !season.poster_path}')
						v-list-item.pa-0(flat)
							v-list-item-content.pa-0
								v-list-item-title.font-weight-bold.text-wrap {{season.name}}
								v-list-item-subtitle.overline
									span(v-if='season.air_date') {{new Date(season.air_date).toLocaleDateString("en-US", {year: "numeric", month: "long"})}}
									span(v-else) (n/a)
</template>

<script>
	export default {
		props: {
			season: Object,
			seriesID: Number
		}
	};
</script>
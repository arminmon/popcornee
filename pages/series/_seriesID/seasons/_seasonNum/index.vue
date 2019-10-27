<template lang="pug">
	v-content.pt-0
		v-img.v-img--blurred(
			:aspect-ratio='10'
			:min-height='series.backdrop_path && season.poster_path ? `calc(100vh + 48px)` : null'
			:src='$store.getters.imgURL(series.backdrop_path, "backdrop", 2)'
			:lazy-src='$store.getters.imgURL(series.backdrop_path, "backdrop", 0)'
			:gradient='$utils.gradient("to top", [{ alpha: "1", pos: "50px" }, { alpha: ".55", pos: "100%" }])'
			)
			template(v-slot:placeholder)
				v-row.fill-height.ma-0.pa-3(justify='end' align='start')
					v-progress-circular(indeterminate style='opacity: .25')
			.d-flex.flex-column.fill-height
				v-container.fill-height.pt-12.pb-0
					v-row.fill-height.pt-12.pb-6(align='center' justify='center')
						v-col.px-6(cols='12' :sm='season.poster_path ? 8 : 12')
							h3.subtitle-2.font-weight-light {{series.name}}
							h1.display-1 {{season.name}}
							p(v-if='season.overview') {{season.overview}}
							.d-block
								h2.subtitle-1.d-inline(v-if='season.air_date')
									span.font-weight-bold {{new Date(season.air_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
								h2.subtitle-1.font-weight-light(v-else) (N/A)
							.overline {{season.episodes.length}} {{season.episodes.length > 1 ? "Episodes" : "Episode"}}
						v-col(cols='12' sm='4' v-if='season.poster_path' :class='{"px-8": $vuetify.breakpoint.xsOnly}')
							v-hover(v-slot:default='{ hover }')
								v-card(elevation='15')
									v-img(:src='$store.getters.imgURL(season.poster_path, "poster", 4)' :lazy-src='$store.getters.imgURL(season.poster_path, "poster", 0)' :aspect-ratio='2/3')
										template(v-slot:placeholder)
											v-row.fill-height.ma-0.pa-3(justify='center' align='center')
												v-progress-circular(indeterminate)
										v-container.fill-height.align-end.justify-center(fluid)
											v-fab-transition
												v-btn(v-show='hover' fab small :href='`${$store.getters.imgURL(season.poster_path,"poster",6)}`' target='_blank')
													v-icon mdi-download
				v-container.py-0(:class='{ "px-0": $vuetify.breakpoint.xsOnly }')
					.text-center
						v-expand-transition
							v-btn.my-3(@click='$vuetify.goTo("#tabs")' icon x-large v-show='$vuetify.breakpoint.smAndUp && series.backdrop_path && season.poster_path && downButton' v-scroll='(e) => {downButton = e.target.scrollingElement.scrollTop < 50 }')
								v-icon(large style='opacity: .5') mdi-chevron-down
					v-tabs#tabs(v-model='tab' show-arrows grow center-active background-color="transparent")
						v-tab(v-for='tab in tabs' :key='tab.title' v-if='!tab.disabled' :to='tab.to' nuxt replace)
							v-icon(:left='$vuetify.breakpoint.smAndUp') {{tab.icon}}
							span(v-if='$vuetify.breakpoint.smAndUp') {{tab.title}}
		v-tabs-items(v-model='tab')
			//- Episodes Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--episodes')
				v-container
					v-data-iterator(:items='season.episodes' :sort-desc='episodesSortDesc' sort-by='episode_number' disable-pagination hide-default-footer)
						template(v-slot:header='props')
							v-toolbar(flat color='transparent')
								v-badge
									template(v-slot:badge) {{season.episodes.length}}
									v-toolbar-title Episodes
								v-spacer
								v-btn-toggle(v-model='episodesSortDesc' mandatory)
									v-btn(:value='false')
										v-icon mdi-sort-ascending
									v-btn(:value='true')
										v-icon mdi-sort-descending
						template(v-slot:default='props')
							v-row(dense)
								v-col(cols='12' v-for='episode in props.items' :key='episode.id')
									v-card(hover style='overflow: hidden' nuxt :to='`/series/${series.id}/seasons/${season.season_number}/episodes/${episode.episode_number}#tab--info`')
										v-img(eager :aspect-ratio='10' :src='$vuetify.breakpoint.xsOnly ? $store.getters.imgURL(episode.still_path, "still", 2) : "/null.png"' :lazy-src='$vuetify.breakpoint.xsOnly ? $store.getters.imgURL(episode.still_path, "still", 0) : "/null.png"' :gradient='$vuetify.breakpoint.smAndDown ? $utils.gradient("to bottom", [{ alpha: ".85", pos: "50%" }, { alpha: ".55", pos: "85%" }]) : null')
											template(v-slot:placeholder)
												v-row.fill-height.ma-0.pa-3(justify='start' align='start')
													v-progress-circular(indeterminate style='opacity: .25')
											v-container(fluid)
												v-row(align='center')
													v-col.py-0(cols='3' v-show='$vuetify.breakpoint.smAndUp')
														v-card(elevation='5')
															v-img(:src='$store.getters.imgURL(episode.still_path, "still", 2)' :lazy-src='$store.getters.imgURL(episode.still_path, "still", 0)' :aspect-ratio='300/169')
																template(v-slot:placeholder)
																	v-row.fill-height.ma-0.pa-3(justify='start' align='start')
																		v-progress-circular(indeterminate)
																.d-flex.fill-height.align-center.justify-center.pa-3(v-if='episode.still_path == null')
																	v-icon.d-flex(style='opacity: .25') mdi-image-off
													v-col.py-0
														v-list-item.pa-0(three-line)
															v-list-item-content
																v-list-item-title.title
																	span.font-weight-thin {{episode.episode_number}}. 
																	span {{episode.name}}
																v-list-item-subtitle.overline {{new Date(episode.air_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
																v-list-item-subtitle.body-2(v-if='episode.overview') {{episode.overview}}
			//- Cast Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--cast' v-if='!tabs.cast.disabled')
				cast-iterator(:cast='season.credits.cast')
			//- Crew Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--crew' v-if='!tabs.crew.disabled')
				crew-table(:crew='season.credits.crew')
			//- Videos Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--videos' v-if='!tabs.videos.disabled')
				videos-grid(:videos='season.videos')
		//- Navigator
		v-container.mt-12
			v-row(justify='end')
				v-col(cols='auto')
					v-tooltip(bottom v-if='season.season > 1')
						template(v-slot:activator='{ on }')
							v-btn(:to='`/series/${series.id}/seasons/${season.season_number - 1}`' nuxt v-on='on')
								v-icon(left) mdi-chevron-left
								span Previous Season
						span S{{season.season_number - 1}}
					v-btn(v-else :to='`/series/${series.id}`' nuxt)
						v-icon(left) mdi-chevron-double-left
						span Back to Series
				v-spacer
				v-col(cols='auto')
					v-tooltip(top v-if='season.season_number < series.number_of_seasons')
						template(v-slot:activator='{ on }')
							v-btn( :to='`/series/${series.id}/seasons/${season.season_number + 1}`' nuxt v-on='on')
								span Next Season
								v-icon(right) mdi-chevron-right
						span S{{season.season_number + 1}}
</template>

<script>
	import PersonCard from "~/components/cards/PersonCard";
	import CastIterator from "~/components/iterators/CastIterator";
	import CrewTable from "~/components/iterators/CrewTable";
	import VideosGrid from "~/components/iterators/VideosGrid";
	export default {
		props: { series: Object, season: Object },
		components: {
			PersonCard,
			CastIterator,
			CrewTable,
			VideosGrid
		},
		head() {
			return {
				title: `${this.season.name} (${
					this.season.air_date
						? new Date(this.season.air_date).toLocaleDateString("en-US", {
								year: "numeric"
						  })
						: "n/a"
				})`
			};
		},
		data: _ => ({
			downButton: true,
			tab: null,
			episodesSortDesc: false
		}),
		computed: {
			tabs() {
				return {
					episodes: {
						title: "Episodes",
						to: "#tab--episodes",
						icon: "mdi-format-list-bulleted"
					},
					cast: {
						title: "Cast",
						to: "#tab--cast",
						icon: "mdi-account-box-multiple",
						disabled: this.season.credits.cast.length < 1
					},
					crew: {
						title: "Crew",
						to: "#tab--crew",
						icon: "mdi-account-group",
						disabled: this.season.credits.crew.length < 1
					},
					videos: {
						title: "Videos",
						to: "#tab--videos",
						icon: "mdi-library-video",
						disabled: this.season.videos.total_results < 1
					}
				};
			}
		},
		mounted() {
			if (this.$route.hash == "")
				if (this.season.episodes.length == 0)
					this.$router.replace({ hash: "#tab--videos" });
				else this.$router.replace({ hash: "#tab--episodes" });
		}
	};
</script>
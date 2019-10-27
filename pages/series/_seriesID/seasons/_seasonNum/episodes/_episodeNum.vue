<template lang="pug">
	v-content.pt-0
		v-img.v-img--blurred(
			:aspect-ratio='10'
			:src='$store.getters.imgURL(episode.still_path, "still", 0)'
			:gradient='$utils.gradient("to top", [{ alpha: "1", pos: "50px" }, { alpha: ".55", pos: "100%" }])'
			)
			template(v-slot:placeholder)
				v-row.fill-height.ma-0.pa-3(justify='end' align='start')
					v-progress-circular(indeterminate style='opacity: .25')
			v-container.pt-12
				v-row.fill-height.pt-12.pb-6(align='center' justify='center')
					v-col.px-6(cols='12' :sm='episode.still_path ? 7 : 12')
						h4.subtitle-2.font-weight-thin {{series.name}}
						h3.subtitle-1.font-weight-light {{season.name}}
						h1.display-1
							span.font-weight-thin.headline {{episode.episode_number}}. 
							| {{episode.name}}
						p(v-if='episode.overview') {{episode.overview}}
						.d-block
							h2.subtitle-1.d-inline(v-if='episode.air_date')
								span.font-weight-bold {{new Date(episode.air_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
							h2.subtitle-1.font-weight-light(v-else) (N/A)
					v-col(cols='12' sm='5' v-if='episode.still_path')
						v-card(elevation='10')
							v-img(:src='$store.getters.imgURL(episode.still_path, "still", 3)' :lazy-src='$store.getters.imgURL(episode.still_path, "still", 0)')
								template(v-slot:placeholder)
									v-row.fill-height.ma-0.pa-3(justify='center' align='center')
										v-progress-circular(indeterminate)
			v-container.py-0(:class='{ "px-0": $vuetify.breakpoint.xsOnly }')
				v-tabs#tabs(v-model='tab' show-arrows grow center-active background-color="transparent")
					v-tab(v-for='tab in tabs' :key='tab.title' v-if='!tab.disabled' :to='tab.to' nuxt replace)
						v-icon(:left='$vuetify.breakpoint.smAndUp') {{tab.icon}}
						span(v-if='$vuetify.breakpoint.smAndUp') {{tab.title}}
		v-tabs-items(v-model='tab')
			//- Info Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--info')
				//- Info Table
				v-container
					v-simple-table.py-6.info-table
						tbody
							tr(v-if='episode.air_date')
								td.text-right.caption.font-weight-light Air Date
								td {{new Date(episode.air_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
							tr(v-if='episode.production_code')
								td.text-right.caption.font-weight-light Production Code
								td {{episode.production_code}}
				//- Cast
				v-container(v-show='$vuetify.breakpoint.smAndUp && episode.credits.cast.length > 0')
					v-toolbar(flat color='transparent')
						v-toolbar-title.text-capitalize Cast
						v-spacer
						v-btn(text nuxt to='#tab--cast' v-if='episode.credits.cast.length > visibleCast') View All ({{episode.credits.cast.length}})
					v-row(:dense='$store.state.drawer || $vuetify.breakpoint.smAndDown')
						v-col(v-for='person in episode.credits.cast.slice(0, visibleCast)' :key='person.credit_id' cols='6' sm='4' md='3' lg='2' xl='1')
							person-card(:person='person')
			//- Guest Stars ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--guest-stars' v-if='!tabs.guestStars.disabled')
				v-container
					v-data-iterator(:items='episode.guest_stars' item-key='credit_id' :search='guestStarsIterator.search' no-results-text='No one was found!' disable-pagination hide-default-footer)
						template(v-slot:header)
							v-toolbar(flat color='transparent')
								v-toolbar-title Guest Stars
								v-spacer
								v-text-field(v-model='guestStarsIterator.search' append-icon='mdi-account-search' label='Search Actors/Actresses & Characters' single-line hide-details clearable)
						template(v-slot:default='props')
							v-row(:dense='$store.state.drawer || $vuetify.breakpoint.smAndDown')
								v-col(v-for='person in props.items' :key='person.credit_id' cols='6' sm='4' md='3' lg='2' xl='1')
									person-card(:person='person')
						template(v-slot:no-results)
							.pa-3.text-center
								v-icon(x-large disabled) mdi-account-question
								br
								v-btn(text @click='guestStarsIterator.search = ""') Clear Search
			//- Cast Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--cast' v-if='!tabs.cast.disabled')
				cast-iterator(:cast='episode.credits.cast')
			//- Crew Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--crew' v-if='!tabs.crew.disabled')
				crew-table(:crew='episode.credits.crew')
			//- Videos Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--videos' v-if='!tabs.videos.disabled')
				videos-grid(:videos='episode.videos')
		//- Navigator
		v-container.mt-3
			v-row(dense)
				v-col.d-flex.flex-column(cols='10' offset='0' sm='3' offset-sm='0' :order='$vuetify.breakpoint.smAndDown ? 2 : 0')
					v-tooltip(right v-if='episode.episode_number > 1')
						template(v-slot:activator='{ on }')
							v-btn.mb-2(:to='`/series/${series.id}/seasons/${season.season_number}/episodes/${episode.episode_number - 1}`' nuxt exact v-on='on')
								v-icon(left) mdi-chevron-left
								span Previous Episode
						span S{{season.season_number}}E{{episode.episode_number - 1}}
					v-tooltip(right v-if='season.season_number > 1')
						template(v-slot:activator='{ on }')
							v-btn.mb-2(:to='`/series/${series.id}/seasons/${season.season_number - 1}`' nuxt exact v-on='on')
								v-icon(left) mdi-chevron-double-left
								span Previous Season
						span S{{season.season_number - 1}}
					v-tooltip(right)
						template(v-slot:activator='{ on }')
							v-btn.mb-2(:to='`/series/${series.id}/seasons/${season.season_number}`' nuxt exact v-on='on')
								v-icon(left) mdi-chevron-double-left
								span Back to Season
						span S{{season.season_number}}
					v-btn.mb-2(:to='`/series/${series.id}`' nuxt exact)
						v-icon(left) mdi-chevron-triple-left
						span Back to Series
				v-col.d-flex.flex-column(cols='10' offset='2' sm='3' offset-sm='6')
					v-tooltip(left v-if='episode.episode_number < season.episodes.length')
						template(v-slot:activator='{ on }')
							v-btn.mb-2(:to='`/series/${series.id}/seasons/${season.season_number}/episodes/${episode.episode_number + 1}`' nuxt v-on='on')
								span Next Episode
								v-icon(right) mdi-chevron-right
						span S{{season.season_number}}E{{episode.episode_number + 1}}
					v-tooltip(left v-if='season.season_number < series.number_of_seasons')
						template(v-slot:activator='{ on }')
							v-btn.mb-2(:to='`/series/${series.id}/seasons/${season.season_number + 1}`' nuxt v-on='on')
								span Next Season
								v-icon(right) mdi-chevron-double-right
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
		validate({ params }) {
			return (
				/^\d+$/.test(params.episodeNum) &&
				/^\d+$/.test(params.seasonNum) &&
				/^\d+$/.test(params.seriesID)
			);
		},
		asyncData: ({ app, params }) =>
			app.$api
				.tmdb(
					[
						"tv",
						params.seriesID,
						"season",
						params.seasonNum,
						"episode",
						params.episodeNum
					],
					{
						append_to_response: ["credits", "external_ids", "videos"].join()
					}
				)
				.then(response => ({ episode: response }))
				.catch(error => console.error(error)),
		head() {
			return {
				title: `${this.episode.name} (${
					this.episode.air_date
						? new Date(this.episode.air_date).toLocaleDateString("en-US", {
								year: "numeric"
						  })
						: "n/a"
				})`
			};
		},
		data: _ => ({
			tab: null,
			guestStarsIterator: {
				search: "",
				keys: ["name", "character"]
			}
		}),
		computed: {
			tabs() {
				return {
					info: {
						title: "Info",
						to: "#tab--info",
						icon: "mdi-information-variant"
					},
					guestStars: {
						title: "Guest Stars",
						to: "#tab--guest-stars",
						icon: "mdi-account-star",
						disabled: this.episode.guest_stars.length < 1
					},
					cast: {
						title: "Cast",
						to: "#tab--cast",
						icon: "mdi-account-box-multiple",
						disabled: this.episode.credits.cast.length < 1
					},
					crew: {
						title: "Crew",
						to: "#tab--crew",
						icon: "mdi-account-group",
						disabled: this.episode.credits.crew.length < 1
					},
					videos: {
						title: "Videos",
						to: "#tab--videos",
						icon: "mdi-library-video",
						disabled: this.episode.videos.total_results < 1
					}
				};
			},
			visibleCast: ({ $vuetify }) =>
				$vuetify.breakpoint.xsOnly
					? 4
					: $vuetify.breakpoint.smOnly
					? 3
					: $vuetify.breakpoint.mdOnly
					? 4
					: $vuetify.breakpoint.lgOnly
					? 6
					: 12
		},
		mounted() {
			if (this.$route.hash == "") this.$router.replace({ hash: "#tab--info" });
		}
	};
</script>
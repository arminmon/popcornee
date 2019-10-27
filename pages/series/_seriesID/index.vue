<template lang="pug">
	v-content.pt-0
		v-img(
			:aspect-ratio='10'
			:min-height='series.backdrop_path && series.poster_path ? `calc(100vh + 48px)` : null'
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
						v-col.px-6(cols='12' :sm='series.poster_path ? 8 : 12')
							h1.display-1 {{series.name || series.original_name}}
							p(v-if='series.overview') {{series.overview}}
							.d-block
								h2.subtitle-1.d-inline(v-if='series.first_air_date')
									span.font-weight-bold {{new Date(series.first_air_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
									span.font-weight-light(v-if='series.status')  ({{series.status}})
								h2.subtitle-1.font-weight-light(v-else) (N/A)
							.overline {{series.number_of_episodes}} {{series.number_of_episodes > 1 ? "Episodes" : "Episode"}} in {{series.number_of_seasons}} {{series.number_of_seasons > 1 ? "Seasons" : "Season"}}
							.mx-n1.py-2
								v-chip.ma-1(v-for='genre in series.genres' :key='genre.id' :small='$vuetify.breakpoint.smAndDown' outlined nuxt :to='{ path: "/series/discover", query: {with_genres: genre.id}}') {{genre.name}}
							.d-block(v-if='series.vote_average > 0')
								v-rating.d-inline(:value='series.vote_average/2' length='5' half-increments readonly :dense='$vuetify.breakpoint.mdAndDown' open-delay='300')
								.d-inline.overline.px-2
									span.font-weight-bold {{series.vote_average}}
									span /10
						v-col(cols='12' sm='4' v-if='series.poster_path' :class='{"px-8": $vuetify.breakpoint.xsOnly}')
							v-hover(v-slot:default='{ hover }')
								v-card(elevation='15')
									v-img(:src='$store.getters.imgURL(series.poster_path, "poster", 4)' :lazy-src='$store.getters.imgURL(series.poster_path, "poster", 0)' :aspect-ratio='2/3')
										template(v-slot:placeholder)
											v-row.fill-height.ma-0.pa-3(justify='center' align='center')
												v-progress-circular(indeterminate)
										v-container.fill-height.align-end.justify-center(fluid)
											v-fab-transition
												v-btn(v-show='hover' fab small :href='`${$store.getters.imgURL(series.poster_path,"poster",6)}`' target='_blank')
													v-icon mdi-download
				v-container.py-0(:class='{ "px-0": $vuetify.breakpoint.xsOnly }')
					.text-center
						v-expand-transition
							v-btn.my-3(@click='$vuetify.goTo("#tabs")' icon x-large v-show='$vuetify.breakpoint.smAndUp && series.backdrop_path && series.poster_path && downButton' v-scroll='(e) => {downButton = e.target.scrollingElement.scrollTop < 50 }')
								v-icon(large style='opacity: .5') mdi-chevron-down
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
							tr(v-if='series.original_name')
								td.text-right.caption.font-weight-light Original Name
								td {{series.original_name}}
							tr(v-if='series.original_language')
								td.text-right.caption.font-weight-light Original Language
								td
									v-avatar.text-uppercase(size='32' :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"') {{series.original_language}}
							tr(v-if='series.origin_country.length > 0')
								td.text-right.caption.font-weight-light Origin {{series.episode_run_time.length > 1 ? "Countries" : "Country"}}
								td
									.mx-n1
										v-avatar.ma-1.text-uppercase(v-for='(country, index) in series.origin_country' :key='index' size='32' :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"') {{country}}
							tr(v-if='series.type')
								td.text-right.caption.font-weight-light Type
								td {{series.type}}
							tr(v-if='series.status')
								td.text-right.caption.font-weight-light Status
								td
									span {{series.status}}
							tr(v-if='series.number_of_seasons > 0')
								td.text-right.caption.font-weight-light Number of Seasons
								td
									v-chip(pill) {{series.number_of_seasons}}
							tr(v-if='series.number_of_episodes > 0')
								td.text-right.caption.font-weight-light Number of Episodes
								td
									v-chip(pill) {{series.number_of_episodes}}
							tr(v-if='series.first_air_date')
								td.text-right.caption.font-weight-light First Air Date
								td {{new Date(series.first_air_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
							tr(v-if='series.last_air_date')
								td.text-right.caption.font-weight-light Last Air Date
								td {{new Date(series.last_air_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
							tr(v-if='series.episode_run_time.length > 0')
								td.text-right.caption.font-weight-light Episode {{series.episode_run_time.length > 1 ? "Runtimes" : "Runtime"}}
								td
									.mx-n1
										v-chip.ma-1(v-for='(runtime, index) in series.episode_run_time' :key='index' pill) {{runtime}}ʹ
							tr(v-if='series.content_ratings.results.length > 0')
								td.text-right.caption.font-weight-light Content {{series.content_ratings.results.length > 1 ? "Ratings" : "Rating"}}
								td
									.mx-n1
										v-chip.ma-1(pill v-for='rating in series.content_ratings.results' :key='rating.iso_3166_1')
											v-avatar.text-uppercase(left :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"') {{rating.iso_3166_1}}
											| {{rating.rating}}
							tr(v-if='series.production_companies.length > 0')
								td.text-right.caption.font-weight-light Production {{series.production_companies.length > 1 ? "Companies" : "Company"}}
								td
									.mx-n1
										v-chip.ma-1(pill v-for='company in series.production_companies' :key='company.id' :to='`/companies/${company.id}`' nuxt)
											v-avatar(v-if='$vuetify.breakpoint.mdAndUp && company.logo_path' left :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"')
												v-img(:src='$store.getters.imgURL(company.logo_path, "logo", 0)' contain)
											| {{company.name}}
							tr(v-if='series.created_by.length > 0')
								td.text-right.caption.font-weight-light Created By
								td
									.mx-n1
										v-chip.ma-1(pill v-for='person in series.created_by' :key='person.credit_id')
											v-avatar(v-if='$vuetify.breakpoint.smAndUp && person.profile_path' left :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"')
												v-img(:src='$store.getters.imgURL(person.profile_path, "profile", 0)')
											| {{person.name}}
							tr(v-if='series.networks.length > 0')
								td.text-right.caption.font-weight-light {{series.networks.length > 1 ? "Networks" : "Network"}}
								td
									.mx-n1
										v-chip.ma-1(pill v-for='network in series.networks' :key='network.id' :to='`/networks/${network.id}`' nuxt)
											v-avatar(v-if='$vuetify.breakpoint.mdAndUp && network.logo_path' left :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"')
												v-img(:src='$store.getters.imgURL(network.logo_path, "logo", 0)' contain)
											| {{network.name}}
							tr(v-if='series.homepage || series.external_ids.imdb_id || series.external_ids.twitter_id || series.external_ids.facebook_id || series.external_ids.instagram_id')
								td.text-right.caption.font-weight-light External Links
								td
									v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='series.homepage' target='_blank' v-if='series.homepage')
										v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-home-circle
										span(v-show='$vuetify.breakpoint.mdAndUp') Homepage
									v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='`https://www.imdb.com/title/${series.external_ids.imdb_id}`' target='_blank' v-if='series.external_ids.imdb_id')
										v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-database
										span(v-show='$vuetify.breakpoint.mdAndUp') IMdb
									v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='`https://twitter.com/${series.external_ids.twitter_id}`' target='_blank' v-if='series.external_ids.twitter_id')
										v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-twitter
										span(v-show='$vuetify.breakpoint.mdAndUp') Twitter
									v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='`https://www.facebook.com/${series.external_ids.facebook_id}`' target='_blank' v-if='series.external_ids.facebook_id')
										v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-facebook
										span(v-show='$vuetify.breakpoint.mdAndUp') Facebook
									v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='`https://www.instagram.com/${series.external_ids.instagram_id}`' target='_blank' v-if='series.external_ids.instagram_id')
										v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-instagram
										span(v-show='$vuetify.breakpoint.mdAndUp') Instagram
									eztv-dialog(:imdbID='series.external_ids.imdb_id' v-if='series.external_ids.imdb_id')
				//- Seasons
				v-container
					v-data-iterator(:items='series.seasons' :sort-desc='seasonsSortDesc' sort-by='season_number' disable-pagination hide-default-footer)
						template(v-slot:header='props')
							v-toolbar(flat)
								v-badge
									template(v-slot:badge) {{series.seasons[0].name == 'Specials' ? `${series.seasons.length - 1}+1` : series.seasons.length}}
									v-toolbar-title Seasons
								v-spacer
								v-btn-toggle(v-model='seasonsSortDesc' mandatory v-if='series.seasons.length > 1')
									v-btn(:value='false')
										v-icon mdi-sort-ascending
									v-btn(:value='true')
										v-icon mdi-sort-descending
						template(v-slot:default='props')
							v-row(:dense='$store.state.drawer || $vuetify.breakpoint.smAndDown')
								v-col(v-for='season in props.items' :key='season.id' cols='6' sm='6' md='4' lg='3' xl='2' :class='{ "order-last": season.name == "Specials" }')
									season-card(:season='season' :seriesID='series.id')
				//- Cast
				v-container(v-show='$vuetify.breakpoint.smAndUp')
					v-toolbar(flat color='transparent')
						v-toolbar-title.text-capitalize Cast
						v-spacer
						v-btn(text nuxt to='#tab--cast' v-if='series.credits.cast.length > visibleCast') View All ({{series.credits.cast.length}})
					v-row(:dense='$store.state.drawer || $vuetify.breakpoint.smAndDown')
						v-col(v-for='person in series.credits.cast.slice(0, visibleCast)' :key='person.credit_id' cols='6' sm='4' md='3' lg='2' xl='1')
							person-card(:person='person')
				//- Recommendations
				v-container(fluid v-if='series.recommendations.total_results > 0')
					media-iterator(:media='series.recommendations' title='You may also like' default-view='square' flat-header :resource='["tv", series.id, "recommendations"]')
				//- Keywords
				v-container(v-if='series.keywords.results')
					.px-2
						.text-center.pb-6.mx-n3
							v-chip.text-uppercase.ma-3(v-for='keyword in series.keywords.results' :key='keyword.id' label outlined small nuxt :to='{ path: "/series/discover", query: {with_keywords: keyword.id}}') {{keyword.name}}
			//- Cast Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--cast' v-if='!tabs.cast.disabled')
				cast-iterator(:cast='series.credits.cast')
			//- Crew Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--crew' v-if='!tabs.crew.disabled')
				crew-table(:crew='series.credits.crew')
			//- Videos Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--videos' v-if='!tabs.videos.disabled')
				videos-grid(:videos='series.videos')
			//- Reviews Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--reviews' v-if='!tabs.reviews.disabled')
				reviews-timeline(:reviews='series.reviews')
			//- Similar Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--similar' v-if='!tabs.similar.disabled')
				v-container(fluid)
					media-iterator(:media='series.similar' title='Similar Series' default-view='square' flat-header :resource='["tv", series.id, "similar"]')
</template>

<script>
	import EztvDialog from "~/components/dialogs/EztvDialog";
	import SeasonCard from "~/components/cards/SeasonCard";
	import PersonCard from "~/components/cards/PersonCard";
	import MediaIterator from "~/components/iterators/MediaIterator";
	import CastIterator from "~/components/iterators/CastIterator";
	import CrewTable from "~/components/iterators/CrewTable";
	import VideosGrid from "~/components/iterators/VideosGrid";
	import ReviewsTimeline from "~/components/iterators/ReviewsTimeline";
	export default {
		components: {
			EztvDialog,
			SeasonCard,
			PersonCard,
			MediaIterator,
			CastIterator,
			CrewTable,
			VideosGrid,
			ReviewsTimeline
		},
		props: { series: Object },
		head() {
			return {
				title: `${this.series.name || this.series.original_name} (${
					this.series.first_air_date
						? new Date(this.series.first_air_date).toLocaleDateString("en-US", {
								year: "numeric"
						  })
						: "n/a"
				})${this.series.tagline ? " – " + this.series.tagline : ""}`
			};
		},
		data: _ => ({
			downButton: true,
			tab: null,
			seasonsSortDesc: false
		}),
		computed: {
			tabs() {
				return {
					info: {
						title: "Info",
						to: "#tab--info",
						icon: "mdi-information-variant"
					},
					cast: {
						title: "Cast",
						to: "#tab--cast",
						icon: "mdi-account-box-multiple",
						disabled: this.series.credits.cast.length < 1
					},
					crew: {
						title: "Crew",
						to: "#tab--crew",
						icon: "mdi-account-group",
						disabled: this.series.credits.crew.length < 1
					},
					videos: {
						title: "Videos",
						to: "#tab--videos",
						icon: "mdi-library-video",
						disabled: this.series.videos.total_results < 1
					},
					reviews: {
						title: "Reviews",
						to: "#tab--reviews",
						icon: "mdi-android-messages",
						disabled: this.series.reviews.total_results < 1
					},
					similar: {
						title: "Similar",
						to: "#tab--similar",
						icon: "mdi-approximately-equal-box",
						disabled: this.series.similar.total_results < 1
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
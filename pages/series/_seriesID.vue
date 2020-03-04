<template lang="pug">
	v-content.pt-0
		v-img.v-img--blurred(
			:aspect-ratio='10'
			:src='$store.getters.imgURL(series.backdrop_path, "backdrop", 0)'
			:lazy-src='$store.getters.imgURL(series.backdrop_path, "backdrop", 0)'
			:gradient='$utils.gradient("to top", [{ alpha: "1", pos: "15%" }, { alpha: ".7", pos: "100%" }])'
			)
			template(v-slot:placeholder)
				.d-flex.pa-3.fill-height.justify-end.align-start
					v-progress-circular(indeterminate style='opacity: .25')
			v-container.fill-height.py-12(:class='{ "pb-0": $vuetify.breakpoint.xsOnly }')
				v-row.py-6(align='center' justify='center')
					v-col(align-self='center')
						h1.display-1.font-weight-bold {{series.name || series.original_name}}
						p(v-if='series.overview') {{series.overview}}
						.d-block
							h2.subtitle-1.d-inline(v-if='series.first_air_date')
								span.font-weight-bold {{new Date(series.first_air_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
								span(v-if='series.status' :class='{ "red--text": series.status.toLowerCase() == "canceled", "blue--text": series.status.toLowerCase() == "ended" }')  ({{series.status}})
							h2.subtitle-1.font-weight-light(v-else) (N/A)
						v-btn.overline(text small nuxt replace to='#tab__seasons') {{series.number_of_episodes}} {{series.number_of_episodes > 1 ? "Episodes" : "Episode"}} in {{series.number_of_seasons}} {{series.number_of_seasons > 1 ? "Seasons" : "Season"}}
						.mx-n1.py-2
							v-chip.ma-1(v-for='genre in series.genres' :key='genre.id' :small='$vuetify.breakpoint.smAndDown' outlined nuxt :to='{ path: "/discover/series", query: {with_genres: genre.id}}') {{genre.name}}
						.d-block(v-if='series.vote_average > 0')
							v-rating.d-inline(:value='series.vote_average/2' length='5' half-increments readonly :dense='$vuetify.breakpoint.mdAndDown' open-delay='300' color='orange' :background-color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-5"')
							.d-inline.overline.px-2
								span.font-weight-bold {{series.vote_average}}
								span /10
						v-btn.mt-6(v-if='!tabs.cast.disabled' height='100' text nuxt replace to='#tab__cast' :block='$vuetify.breakpoint.smAndDown')
							.mx-n2
								v-avatar.elevation-3.mx-2(v-for='person in series.credits.cast.slice(0, $vuetify.breakpoint.smAndDown ? 3 : 4)' :key='person.credit_id' :size='$vuetify.breakpoint.smAndDown ? 65 : 78')
									v-img(v-if='person.profile_path' :src='$store.getters.imgURL(person.profile_path, "profile", 1)' aspect-ratio='1' :lazy-src='$store.getters.imgURL(person.profile_path, "profile", 0)')
									span.headline(v-else) {{person.name.split(" ")[0][0]}}{{person.name.split(" ")[1][0]}}
								v-avatar.mx-2(v-if='series.credits.cast.length - ($vuetify.breakpoint.smAndDown ? 3 : 4) > 0' :size='$vuetify.breakpoint.smAndDown ? 65 : 78')
									span.title +{{series.credits.cast.length - ($vuetify.breakpoint.smAndDown ? 3 : 4)}}
					v-col(cols='12' sm='4' v-if='series.poster_path')
						v-hover(v-slot:default='{ hover }')
							v-card(elevation='15')
								v-img(:src='$store.getters.imgURL(series.poster_path, "poster", 4)' :lazy-src='$store.getters.imgURL(series.poster_path, "poster", 0)' :aspect-ratio='2/3')
									template(v-slot:placeholder)
										.d-flex.pa-3.fill-height.justify-center.align-center
											v-progress-circular(indeterminate)
									v-container.fill-height.align-end.justify-center(fluid)
										v-fab-transition
											v-btn(v-show='hover' fab small :href='`${$store.getters.imgURL(series.poster_path,"poster",6)}`' target='_blank')
												v-icon mdi-download
		v-sheet(tile elevation='0')
			v-container.py-0(:class='{ "px-0": $vuetify.breakpoint.xsOnly }')
				v-tabs#tabs(v-model='tab' show-arrows grow center-active icons-and-text background-color="transparent")
					v-tabs-slider
					v-tab(v-for='tab in tabs' :key='tab.to' nuxt replace :to='tab.to' v-if='!tab.disabled')
						span {{tab.title}}
						v-icon {{tab.icon}}
		v-tabs-items(v-model='tab')
			//- Info Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__info')
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
										v-chip.ma-1(pill v-for='company in series.production_companies' :key='company.id' :to='`/companies/${company.id}-${$utils.slugify(String(company.name))}#tab__info`' nuxt)
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
										v-chip.ma-1(pill v-for='network in series.networks' :key='network.id' :to='`/networks/${network.id}-${$utils.slugify(String(network.name))}#tab__info`' nuxt)
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
				//- Recommendations
				v-container(fluid v-if='series.recommendations.total_results > 0')
					media-iterator(:media='series.recommendations' title='You may also like' :resource='`tv/${series.id}/recommendations`')
				//- Keywords
				v-container(v-if='series.keywords.results')
					.px-2
						.text-center.pb-6.mx-n3
							v-chip.text-uppercase.ma-3(v-for='keyword in series.keywords.results' :key='keyword.id' label outlined small nuxt :to='{ path: "/discover/series", query: {with_keywords: keyword.id}}') {{keyword.name}}
			//- Seasons Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__seasons')
				season-browser(:seasons='series.seasons' :seriesID='series.id.toString()')
			//- Cast Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__cast' v-if='!tabs.cast.disabled')
				cast-iterator(:cast='series.credits.cast')
			//- Crew Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__crew' v-if='!tabs.crew.disabled')
				crew-table(:crew='series.credits.crew')
			//- Videos Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__videos' v-if='!tabs.videos.disabled')
				videos-grid(:videos='series.videos')
			//- Reviews Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__reviews' v-if='!tabs.reviews.disabled')
				reviews-timeline(:reviews='series.reviews')
			//- Similar Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__similar' v-if='!tabs.similar.disabled')
				v-container(fluid)
					media-iterator(:media='series.similar' title='Similar Series' :resource='`tv/${series.id}/similar`')
</template>

<script>
	import MediaIterator from "~/components/shared/iterators/MediaIterator";
	import SeasonBrowser from "~/components/series/SeasonBrowser";
	import CastIterator from "~/components/shared/iterators/CastIterator";
	import CrewTable from "~/components/shared/iterators/CrewTable";
	import VideosGrid from "~/components/shared/iterators/VideosGrid";
	import ReviewsTimeline from "~/components/shared/iterators/ReviewsTimeline";
	export default {
		components: {
			MediaIterator,
			SeasonBrowser,
			CastIterator,
			CrewTable,
			VideosGrid,
			ReviewsTimeline
		},
		validate: ({ params }) => /^\d+$/.test(String(params.seriesID).split("-")[0]),
		fetch: async ({ store }) => {
			await store.dispatch("FETCH_CONFIGS");
			await store.dispatch("FETCH_GENRES");
		},
		asyncData: ({ app, params, store, error }) =>
			app.$api.tmdb
				.get(`tv/${String(params.seriesID).split("-")[0]}`, {
					params: {
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
					}
				})
				.then(res => {
					store.commit("series/SET_ID", res.id);
					store.commit("series/SET_NAME", res.name);
					return { series: res };
				})
				.catch(e => error(e)),
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
			tab: null,
			seasonsSortDesc: true
		}),
		computed: {
			tabs() {
				return {
					info: {
						title: "Info",
						to: "#tab__info",
						icon: "mdi-information-variant"
					},
					seasons: {
						title: "Seasons",
						to: "#tab__seasons",
						icon: "mdi-cards-variant"
					},
					cast: {
						title: "Cast",
						to: "#tab__cast",
						icon: "mdi-account-box-multiple",
						disabled: this.series.credits.cast.length < 1
					},
					crew: {
						title: "Crew",
						to: "#tab__crew",
						icon: "mdi-account-group",
						disabled: this.series.credits.crew.length < 1
					},
					videos: {
						title: "Videos",
						to: "#tab__videos",
						icon: "mdi-library-video",
						disabled: this.series.videos.total_results < 1
					},
					reviews: {
						title: "Reviews",
						to: "#tab__reviews",
						icon: "mdi-android-messages",
						disabled: this.series.reviews.total_results < 1
					},
					similar: {
						title: "Similar",
						to: "#tab__similar",
						icon: "mdi-approximately-equal-box",
						disabled: this.series.similar.total_results < 1
					}
				};
			},
			visibleCast: ({ $vuetify }) =>
				$vuetify.breakpoint.mdAndDown
					? 4 - 1
					: $vuetify.breakpoint.lgOnly
					? 6 - 1
					: 12 - 1
		},
		mounted() {
			this.$store.commit("COLLAPSE_APP_BAR", true);
			if (this.$route.hash == "") this.$router.replace({ hash: "#tab__info" });
		}
	};
</script>

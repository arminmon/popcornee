<template lang="pug">
	v-content.pt-0
		v-img(
			:aspect-ratio='10'
			:min-height='movie.backdrop_path && movie.poster_path ? `calc(100vh + 48px)` : null'
			:src='$store.getters.imgURL(movie.backdrop_path, "backdrop", 2)'
			:lazy-src='$store.getters.imgURL(movie.backdrop_path, "backdrop", 0)'
			:gradient='$utils.gradient("to top", [{ alpha: "1", pos: "50px" }, { alpha: ".55", pos: "100%" }])'
			)
			template(v-slot:placeholder)
				v-row.fill-height.ma-0.pa-3(justify='end' align='start')
					v-progress-circular(indeterminate style='opacity: .25')
			.d-flex.flex-column.fill-height
				v-container.fill-height.pt-12.pb-0
					v-row.fill-height.pt-12.pb-6(align='center' justify='center')
						v-col.px-6(cols='12' :sm='movie.poster_path ? 8 : 12')
							h1.display-1 {{movie.title || movie.original_title}}
							h3.subtitle-1.font-weight-light.font-italic(v-if='movie.tagline') – {{movie.tagline}}
							p(v-if='movie.overview') {{movie.overview}}
							.d-block
								h2.subtitle-1.d-inline(v-if='movie.release_date')
									span.font-weight-bold {{new Date(movie.release_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
									span.font-weight-light(v-if='movie.status')  ({{movie.status}})
								h2.subtitle-1.font-weight-light(v-else) (N/A)
								releases-dialog(:releases='movie.release_dates.results' v-if='movie.release_date && movie.release_dates.results.length>0')
							.mx-n1.py-2
								v-chip.ma-1(v-for='genre in movie.genres' :key='genre.id' :small='$vuetify.breakpoint.smAndDown' outlined nuxt :to='{ path: "/discover/movies", query: {with_genres: genre.id}}') {{genre.name}}
							.d-block(v-if='movie.vote_average > 0')
								v-rating.d-inline(:value='movie.vote_average/2' length='5' half-increments readonly :dense='$vuetify.breakpoint.mdAndDown' open-delay='300')
								.d-inline.overline.px-2
									span.font-weight-bold {{movie.vote_average}}
									span /10
						v-col(cols='12' sm='4' v-if='movie.poster_path' :class='{"px-8": $vuetify.breakpoint.xsOnly}')
							v-hover(v-slot:default='{ hover }')
								v-card(elevation='15')
									v-img(:src='$store.getters.imgURL(movie.poster_path, "poster", 4)' :lazy-src='$store.getters.imgURL(movie.poster_path, "poster", 0)' :aspect-ratio='2/3')
										template(v-slot:placeholder)
											v-row.fill-height.ma-0.pa-3(justify='center' align='center')
												v-progress-circular(indeterminate)
										v-container.fill-height.align-end.justify-center(fluid)
											v-fab-transition
												v-btn(v-show='hover' fab small :href='`${$store.getters.imgURL(movie.poster_path,"poster",6)}`' target='_blank')
													v-icon mdi-download
				v-container.py-0(:class='{ "px-0": $vuetify.breakpoint.xsOnly }')
					.text-center
						v-expand-transition
							v-btn.my-3(@click='$vuetify.goTo("#tabs")' icon x-large v-show='$vuetify.breakpoint.smAndUp && movie.backdrop_path && movie.poster_path && downButton' v-scroll='(e) => {downButton = e.target.scrollingElement.scrollTop < 50 }')
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
							tr(v-if='movie.original_title')
								td.text-right.caption.font-weight-light Original Title
								td {{movie.original_title}}
							tr(v-if='movie.original_language')
								td.text-right.caption.font-weight-light Original Language
								td
									v-avatar.text-uppercase(size='32' :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"') {{movie.original_language}}
							tr(v-if='movie.spoken_languages.length > 0')
								td.text-right.caption.font-weight-light Spoken {{movie.spoken_languages.length > 1 ? "Languages" : "Language"}}
								td
									.mx-n1
										v-chip.ma-1(pill v-for='language in movie.spoken_languages' :key='language.iso_639_1')
											v-avatar.text-uppercase(v-if='$vuetify.breakpoint.mdAndUp' left :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"') {{language.iso_639_1}}
											| {{language.name}}
							tr(v-if='movie.runtime > 0')
								td.text-right.caption.font-weight-light Runtime
								td
									v-chip(pill) {{movie.runtime}}ʹ
							tr(v-if='movie.status')
								td.text-right.caption.font-weight-light Status
								td
									span {{movie.status}}
							tr(v-if='movie.release_date')
								td.text-right.caption.font-weight-light Release Date
								td {{new Date(movie.release_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
							tr(v-if='movie.production_companies.length > 0')
								td.text-right.caption.font-weight-light Production {{movie.production_companies.length > 1 ? "Companies" : "Company"}}
								td
									.mx-n1
										v-chip.ma-1(pill v-for='company in movie.production_companies' :key='company.id' :to='`/companies/${company.id}`' nuxt)
											v-avatar(v-if='$vuetify.breakpoint.mdAndUp && company.logo_path' left :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"')
												v-img(:src='$store.getters.imgURL(company.logo_path, "logo", 0)' contain)
											| {{company.name}}
							tr(v-if='movie.production_countries.length > 0')
								td.text-right.caption.font-weight-light Production {{movie.production_countries.length > 1 ? "Countries" : "Country"}}
								td
									.mx-n1
										v-chip.ma-1(pill v-for='country in movie.production_countries' :key='country.iso_3166_1')
											v-avatar.text-uppercase(v-if='$vuetify.breakpoint.mdAndUp' left :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"') {{country.iso_3166_1}}
											| {{country.name}}
							tr(v-if='movie.budget > 0')
								td.text-right.caption.font-weight-light Budget
								td ${{movie.budget.toLocaleString()}}
							tr(v-if='movie.revenue > 0')
								td.text-right.caption.font-weight-light Revenue
								td ${{movie.revenue.toLocaleString()}}
							tr(v-if='movie.homepage || movie.external_ids.imdb_id || movie.external_ids.twitter_id || movie.external_ids.facebook_id || movie.external_ids.instagram_id')
								td.text-right.caption.font-weight-light External Links
								td
									v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='movie.homepage' target='_blank' v-if='movie.homepage')
										v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-home-circle
										span(v-show='$vuetify.breakpoint.mdAndUp') Homepage
									v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='`https://www.imdb.com/title/${movie.external_ids.imdb_id}`' target='_blank' v-if='movie.external_ids.imdb_id')
										v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-database
										span(v-show='$vuetify.breakpoint.mdAndUp') IMdb
									v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='`https://twitter.com/${movie.external_ids.twitter_id}`' target='_blank' v-if='movie.external_ids.twitter_id')
										v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-twitter
										span(v-show='$vuetify.breakpoint.mdAndUp') Twitter
									v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='`https://www.facebook.com/${movie.external_ids.facebook_id}`' target='_blank' v-if='movie.external_ids.facebook_id')
										v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-facebook
										span(v-show='$vuetify.breakpoint.mdAndUp') Facebook
									v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='`https://www.instagram.com/${movie.external_ids.instagram_id}`' target='_blank' v-if='movie.external_ids.instagram_id')
										v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-instagram
										span(v-show='$vuetify.breakpoint.mdAndUp') Instagram
									yts-dialog(:torrents='movie.yts' v-if='movie.yts')
				//- Cast
				v-container(v-show='$vuetify.breakpoint.smAndUp')
					v-toolbar(flat color='transparent')
						v-toolbar-title.text-capitalize Cast
						v-spacer
						v-btn(text nuxt to='#tab--cast' v-if='movie.credits.cast.length > visibleCast') View All ({{movie.credits.cast.length}})
					v-row(:dense='$store.state.drawer || $vuetify.breakpoint.smAndDown')
						v-col(v-for='person in movie.credits.cast.slice(0, visibleCast)' :key='person.credit_id' cols='6' sm='4' md='3' lg='2' xl='1')
							person-card(:person='person')
				//- Collection
				v-container(v-if='movie.collection')
					media-iterator(:media='movie.collection.parts' :title='movie.collection.name' default-view='narrow' flat-header hide-views)
						template(v-slot:header-append)
							v-btn(text nuxt :to='`/movies/collections/${movie.collection.id}`') {{$vuetify.breakpoint.mdAndUp ? "View Collection" : "View"}}
				//- Recommendations
				v-container(fluid v-if='movie.recommendations.total_results > 0')
					media-iterator(:media='movie.recommendations' title='You may also like' default-view='square' flat-header :resource='["movie", movie.id, "recommendations"]')
				//- Keywords
				v-container(v-if='movie.keywords.keywords')
					.px-2
						.text-center.pb-6.mx-n2
							v-chip.text-uppercase.ma-2(v-for='keyword in movie.keywords.keywords' :key='keyword.id' label outlined small nuxt :to='{ path: "/discover/movies", query: {with_keywords: keyword.id}}') {{keyword.name}}
			//- Cast Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--cast' v-if='!tabs.cast.disabled')
				cast-iterator(:cast='movie.credits.cast')
			//- Crew Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--crew' v-if='!tabs.crew.disabled')
				crew-table(:crew='movie.credits.crew')
			//- Videos Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--videos' v-if='!tabs.videos.disabled')
				videos-grid(:videos='movie.videos')
			//- Reviews Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--reviews' v-if='!tabs.reviews.disabled')
				reviews-timeline(:reviews='movie.reviews')
			//- Similar Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--similar' v-if='!tabs.similar.disabled')
				v-container(fluid)
					media-iterator(:media='movie.similar' title='Similar Movies' default-view='square' flat-header :resource='["movie", movie.id, "similar"]')
</template>

<script>
	import ReleasesDialog from "~/components/dialogs/ReleasesDialog";
	import YtsDialog from "~/components/dialogs/YtsDialog";
	import PersonCard from "~/components/cards/PersonCard";
	import MediaIterator from "~/components/iterators/MediaIterator";
	import CastIterator from "~/components/iterators/CastIterator";
	import CrewTable from "~/components/iterators/CrewTable";
	import VideosGrid from "~/components/iterators/VideosGrid";
	import ReviewsTimeline from "~/components/iterators/ReviewsTimeline";
	export default {
		components: {
			ReleasesDialog,
			YtsDialog,
			PersonCard,
			MediaIterator,
			CastIterator,
			CrewTable,
			VideosGrid,
			ReviewsTimeline
		},
		validate: ({ params }) => /^\d+$/.test(params.movieID),
		fetch: async ({ store }) => {
			await store.dispatch("FETCH_CONFIGS");
			await store.dispatch("FETCH_GENRES");
		},
		asyncData: ({ app, params }) =>
			app.$api
				.tmdb(["movie", params.movieID], {
					append_to_response: [
						"credits",
						"keywords",
						"external_ids",
						"videos",
						"recommendations",
						"similar",
						"release_dates",
						"reviews"
					].join()
				})
				.then(async response => {
					response.release_dates.results.sort((a, b) =>
						a.iso_3166_1 > b.iso_3166_1 ? 1 : -1
					);
					response.collection = null;
					if (response.belongs_to_collection) {
						response.collection = await app.$api.tmdb([
							"collection",
							response.belongs_to_collection.id
						]);
						delete response.belongs_to_collection;
					}
					response.yts = null;
					if (response.external_ids.imdb_id) {
						let yts = await app.$api.yts(response.external_ids.imdb_id);
						if (yts.movie_count > 0) response.yts = yts.movies[0].torrents;
					}
					return { movie: response };
				})
				.catch(error => console.error(error)),
		head() {
			return {
				title: `${this.movie.title || this.movie.original_title} (${
					this.movie.release_date
						? new Date(this.movie.release_date).toLocaleDateString("en-US", {
								year: "numeric"
						  })
						: "n/a"
				})${this.movie.tagline ? " – " + this.movie.tagline : ""}`
			};
		},
		data: _ => ({
			downButton: true,
			tab: null
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
						disabled: this.movie.credits.cast.length < 1
					},
					crew: {
						title: "Crew",
						to: "#tab--crew",
						icon: "mdi-account-group",
						disabled: this.movie.credits.crew.length < 1
					},
					videos: {
						title: "Videos",
						to: "#tab--videos",
						icon: "mdi-library-video",
						disabled: this.movie.videos.total_results < 1
					},
					reviews: {
						title: "Reviews",
						to: "#tab--reviews",
						icon: "mdi-android-messages",
						disabled: this.movie.reviews.total_results < 1
					},
					similar: {
						title: "Similar",
						to: "#tab--similar",
						icon: "mdi-approximately-equal-box",
						disabled: this.movie.similar.total_results < 1
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
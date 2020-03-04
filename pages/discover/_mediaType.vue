<template lang="pug">
	v-content
		v-navigation-drawer(
			v-model='queryDrawer'
			app
			bottom
			clipped
			:permanent='queryDrawer && $vuetify.breakpoint.mdAndUp'
			:temporary='queryDrawer && $vuetify.breakpoint.smAndDown'
			floating
			:right='$vuetify.rtl'
			:overlay-color='$vuetify.theme.dark ? "grey darken-4" : "white"'
			overlay-opacity='.75'
			:width='$vuetify.breakpoint.smAndDown ? "calc(100vw - 16px)" : "310"'
			:class='{ "v-card": $vuetify.breakpoint.smAndDown, "elevation-12": $vuetify.breakpoint.smAndDown }')
			template(v-slot:prepend)
				v-tabs(v-model='mediaType' grow)
					v-tab
						v-icon(left) mdi-movie-open
						span Movies
					v-tab
						span Series
						v-icon(right) mdi-television-classic
			v-expansion-panels(v-model='panels' multiple focusable accordion tile flat)
				v-expansion-panel
					v-expansion-panel-header
						template(v-slot:default='{ open }')
							v-fade-transition(leave-absolute)
								span(v-show='open') Genres
							v-fade-transition(leave-absolute)
								span(v-show='!open')
									span(v-if='withGenres.length == 0 && withoutGenres.length == 0')
										span.font-weight-bold Any 
										| Genres
									span(v-else)
										span.font-weight-bold(v-if='withGenres.length > 0') Include {{withGenres.length}}
										span(v-if='withGenres.length > 0 && withoutGenres.length > 0')  and 
										span.font-weight-bold(v-if='withoutGenres.length > 0') Exclude {{withoutGenres.length}} 
										span {{(withGenres.length + withoutGenres.length) > 1 ? " Genres" : " Genre"}}
					v-expansion-panel-content
						v-list.pa-0(dense)
							v-list-item.px-0(v-for='genre in genres' :key='genre.id')
								v-list-item-action
									v-btn(fab small depressed :color='!genre.without ? "transparent" : `deep-orange ${$vuetify.theme.dark ? "darken-4" : "lighten-5"}`' @click='genre.without = !genre.without; genre.with = false')
										v-icon(:color='!genre.without ? `grey ${$vuetify.theme.dark ? "darken-1" : "lighten-1"}` : `deep-orange ${$vuetify.theme.dark ? "" : "lighten-1"}`') mdi-minus
								v-list-item-content
									v-list-item-title.text-center(:class='{ "font-weight-bold": genre.with || genre.without }') {{genre.name}}
								v-list-item-action
									v-btn(fab small depressed :color='!genre.with ? "transparent" : `green ${$vuetify.theme.dark ? "darken-4" : "lighten-5"}`' @click='genre.with = !genre.with; genre.without = false')
										v-icon(:color='!genre.with ? `grey ${$vuetify.theme.dark ? "darken-1" : "lighten-1"}` : `green ${$vuetify.theme.dark ? "darken-1" : "lighten-1"}`') mdi-plus
				v-expansion-panel
					v-expansion-panel-header
						template(v-slot:default='{ open }')
							span
								| Sort by 
								v-fade-transition
									span(v-show='!open')
										span.font-weight-bold {{sorts.find(sort => sort.value == sortBy).text}}
										v-icon.ms-1(small) {{orderDesc ? "mdi-sort-descending" : "mdi-sort-ascending"}}
					v-expansion-panel-content
						v-radio-group(v-model='sortBy')
							v-radio.my-3(v-for='sort in sorts' :key='sort.value' :value='sort.value' :label='sort.text')
						v-divider
						v-switch(v-model='orderDesc' label='Order Descending')
				v-expansion-panel
					v-expansion-panel-header
						template(v-slot:default='{ open }')
							v-fade-transition(leave-absolute)
								span(v-show='open') Keywords
							v-fade-transition(leave-absolute)
								span(v-show='!open')
									span
										span.font-weight-bold {{withKeywords.length == 0 ? "Any" : withKeywords.length}} 
										| {{withKeywords.length <= 1 ? "Keyword" : "Keywords"}}
					v-expansion-panel-content
						v-autocomplete(
							v-model='withKeywords'
							:search-input.sync='searchKeywords'
							return-object
							:items='keywords'
							item-text='name'
							item-value='id'
							:loading='loadingKeywords'
							multiple
							chips
							small-chips
							hide-details
							hide-no-data
							no-data-text='Nothing was found!'
							placeholder='Search Keywords')
						v-list(dense)
							v-list-item(v-for='(keyword, index) in withKeywords' :key='keyword.id')
								v-list-item-content
									v-list-item-title.text-uppercase {{keyword.name}}
								v-list-item-action
									v-btn(icon @click='withKeywords.splice(index, 1)')
										v-icon mdi-close
			template(v-slot:append)
				v-scroll-y-reverse-transition
					v-btn(v-show='queried.with_genres != query.with_genres || queried.without_genres != query.without_genres || queried.sort_by != query.sort_by || queried.with_keywords != query.with_keywords' block tile x-large @click='$router.push({ query: query })' :loading='progress.active' color='primary')
						span Discover
		v-container(fluid)
			media-iterator(ref='mediaIterator' :media='discovery' :title='$vuetify.breakpoint.mdAndUp ? "Discover" : ""' dense default-view='wide' :resource='`discover/${$route.params.mediaType == "movies" ? "movie" : "tv"}`' :query='query')
				template(v-slot:header-prepend)
					v-badge(v-show='$vuetify.breakpoint.smAndDown' overlap :value='withGenres.length + withoutGenres.length > 0')
						template(v-slot:badge) {{withGenres.length + withoutGenres.length}}
						v-btn(:depressed='queryDrawer' @click='queryDrawer = true')
							v-icon(left) mdi-filter-variant
							span Filters
</template>

<script>
	import { mapGetters } from "vuex";
	import MediaIterator from "~/components/shared/iterators/MediaIterator";
	export default {
		components: {
			MediaIterator
		},
		fetch: async ({ store }) => {
			await store.dispatch("FETCH_CONFIGS");
			await store.dispatch("FETCH_GENRES");
		},
		validate: async ({ params, query, redirect }) => {
			switch (params.mediaType) {
				case "movies":
					return true;
				case "series":
					return true;
				case "tv":
					return redirect({ params: { mediaType: "series" }, query: query });
				case "movie":
					return redirect({ params: { mediaType: "movies" }, query: query });
				default:
					return redirect("/discover");
			}
		},
		asyncData: ({ app, params, query, store, error }) =>
			app.$api.tmdb
				.get(`discover/${params.mediaType == "movies" ? "movie" : "tv"}`, {
					params: query
				})
				.then(async res => {
					// Generate genres from store
					let genres = store.state.genres[params.mediaType].map(genre => ({
						id: genre.id.toString(),
						name: genre.name,
						with: query.with_genres
							? String(query.with_genres)
									.split(",")
									.find(id => id == String(genre.id))
							: false,
						without: query.without_genres
							? String(query.without_genres)
									.split(",")
									.find(id => id == String(genre.id))
							: false
					}));
					// Fetch keywords from api
					let withKeywords = [];
					if (query.with_keywords) {
						let keyword = null;
						for (let keywordID of String(query.with_keywords).split(",")) {
							keyword = await app.$api.tmdb.get(`keyword/${keywordID}`);
							withKeywords.push(keyword);
						}
					}
					return {
						discovery: res,
						mediaType: params.mediaType == "movies" ? 0 : 1,
						queried: {
							with_genres: query.with_genres || "",
							without_genres: query.without_genres || "",
							sort_by: query.sort_by ? query.sort_by : "popularity.desc",
							with_keywords: query.with_keywords || ""
						},
						genres,
						withKeywords,
						sortBy: query.sort_by ? query.sort_by.split(".")[0] : "popularity",
						orderDesc: query.sort_by
							? query.sort_by.split(".")[1] == "desc"
							: true
					};
				})
				.catch(e => error(e)),
		head() {
			return {
				title: `Discover ${this.$route.params.mediaType.replace(/^\w/, c =>
					c.toUpperCase()
				)}`
			};
		},
		watchQuery: true,
		data: _ => ({
			drawer: false,
			panels: [0, 1, 2],
			sorts: [
				{ text: "Popularity", value: "popularity" },
				{ text: "Release Date", value: "release_date" },
				{ text: "Revenue", value: "revenue" },
				{ text: "Vote Count", value: "vote_count" }
			],
			searchKeywords: null,
			keywords: [],
			loadingKeywords: false
		}),
		computed: {
			withGenres() {
				return this.genres.filter(genre => genre.with).map(genre => genre.id);
			},
			withoutGenres() {
				return this.genres.filter(genre => genre.without).map(genre => genre.id);
			},
			query() {
				return {
					with_genres: this.withGenres.join(),
					without_genres: this.withoutGenres.join(),
					sort_by: `${this.sortBy}.${this.orderDesc ? "desc" : "asc"}`,
					with_keywords: this.withKeywords.map(keyword => keyword.id).join(",")
				};
			},
			...mapGetters(["progress"]),
			queryDrawer: {
				get() {
					return (
						!this.$store.state.drawer &&
						(this.$vuetify.breakpoint.mdAndUp || this.drawer)
					);
				},
				set(val) {
					if (val) {
						this.$store.commit("SET_DRAWER", false);
						this.drawer = true;
					} else {
						this.drawer = this.$vuetify.breakpoint.mdAndUp;
					}
				}
			}
		},
		watch: {
			mediaType(val) {
				this.$router.push({ params: { mediaType: val ? "series" : "movies" } });
			},
			async searchKeywords(keyword) {
				if (keyword)
					try {
						this.loadingKeywords = true;
						let res = await this.$api.tmdb.get("search/keyword", {
							params: { query: keyword }
						});
						this.keywords = res.results;
					} catch (e) {
						this.loadingKeywords = "error";
					} finally {
						this.loadingKeywords = false;
					}
			}
		},
		mounted() {
			this.$store.commit("SET_DRAWER", false);
			this.$store.commit("COLLAPSE_APP_BAR", false);
		}
	};
</script>
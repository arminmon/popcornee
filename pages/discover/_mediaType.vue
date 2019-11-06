<template lang="pug">
	v-content
		v-navigation-drawer(v-model='queryDrawer' app disable-route-watcher clipped :right='$vuetify.rtl' width='310' floating)
			.pa-3(:class='{ "pt-8": $vuetify.breakpoint.smAndDown }')
				v-select.mb-3(
					v-model='withGenres'
					:items='genres'
					item-text='name'
					item-value='id'
					item-disabled='without'
					:prefix='withGenres.length > 0 ? "Include" : "Include Any Genre"'
					:menu-props="{ offsetY: true, maxHeight: 310 }"
					multiple
					chips
					deletable-chips
					hide-details)
				v-select.mb-3(
					v-model='withoutGenres'
					:items='genres'
					item-text='name'
					item-value='id'
					item-disabled='with'
					:prefix='withoutGenres.length > 0 ? "Exclude" : "Exclude No Genre"'
					:menu-props="{ offsetY: true, maxHeight: 310 }"
					multiple
					chips
					deletable-chips
					hide-details)
				v-select.mb-3(
					v-model='sortBy'
					:items='sorts'
					item-text='text'
					item-value='value'
					prefix='Sort by'
					:menu-props="{ offsetY: true, maxHeight: 310 }"
					mandatory
					hide-details)
					template(v-slot:append-outer)
						v-btn(icon @click='orderDesc = !orderDesc')
							v-icon {{orderDesc ? "mdi-sort-descending" : "mdi-sort-ascending"}}
			template(v-slot:append)
				.pa-3(:class='{ "pb-8": $vuetify.breakpoint.smAndDown }')
					v-btn(block large @click='$router.push({ query: query })' :color='queried.with_genres != query.with_genres || queried.without_genres != query.without_genres ? "primary" : undefined' :text='queried.with_genres == query.with_genres && queried.without_genres == query.without_genres')
						span Discover
		v-container(fluid)
			media-iterator(ref='mediaIterator' :media='discovery' :loading='loading' flat-header default-view='wide' :title='$vuetify.breakpoint.mdAndUp ? "Results" : ""' :dense='queryDrawer' :resource='["discover", "movie"]' :query='query')
				template(v-slot:header-prepend)
					v-badge(v-show='$vuetify.breakpoint.smAndDown' overlap :value='withGenres.length + withoutGenres.length > 0')
						template(v-slot:badge) {{withGenres.length + withoutGenres.length}}
						v-btn(text :depressed='queryDrawer' @click='queryDrawer = true')
							v-icon(left) mdi-filter-variant
							span Filters
</template>

<script>
	import MediaIterator from "~/components/iterators/MediaIterator";
	export default {
		components: {
			MediaIterator
		},
		watchQuery: true,
		fetch: async ({ store }) => {
			await store.dispatch("FETCH_CONFIGS");
			await store.dispatch("FETCH_GENRES");
		},
		head: {
			title: "Discover"
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
		asyncData: ({ app, params, query }) =>
			app.$api
				.tmdb(["discover", params.mediaType == "movies" ? "movie" : "tv"], query)
				.then(response => ({
					discovery: response,
					queried: {
						with_genres: query.with_genres ? query.with_genres : "",
						without_genres: query.without_genres ? query.without_genres : "",
						sort_by: query.sort_by ? query.sort_by : "popularity.desc"
					},
					withGenres: query.with_genres
						? query.with_genres.toString().split(",")
						: [],
					withoutGenres: query.without_genres
						? query.without_genres.toString().split(",")
						: [],
					sortBy: query.sort_by ? query.sort_by.split(".")[0] : "popularity",
					orderDesc: query.sort_by ? query.sort_by.split(".")[1] == "desc" : true
				})),
		data: _ => ({
			drawer: true,
			loading: true,
			sorts: [
				{ text: "Popularity", value: "popularity" },
				{ text: "Release Date", value: "release_date" },
				{ text: "Revenue", value: "revenue" },
				{ text: "Vote Count", value: "vote_count" }
			]
		}),
		computed: {
			genres() {
				return this.$store.state.genres.movies.map(genre => ({
					id: genre.id.toString(),
					name: genre.name,
					with: this.withGenres.find(id => id == genre.id.toString())
						? true
						: false,
					without: this.withoutGenres.find(id => id == genre.id.toString())
						? true
						: false
				}));
			},
			queryDrawer: {
				get() {
					return this.drawer && !this.$store.state.drawer;
				},
				set(val) {
					if (val) {
						this.$store.commit("SET_DRAWER", false);
						this.drawer = true;
					} else {
						this.drawer = this.$vuetify.breakpoint.mdAndUp;
					}
				}
			},
			query() {
				return {
					with_genres: this.withGenres.join(),
					without_genres: this.withoutGenres.join(),
					with_keywords: this.$route.query.with_keywords,
					sort_by: `${this.sortBy}.${this.orderDesc ? "desc" : "asc"}`
				};
			}
		},
		mounted() {
			this.$store.commit("SET_DRAWER", false);
		}
	};
</script>
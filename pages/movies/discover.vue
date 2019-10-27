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
					v-on:change='(e) => updateGenres(e, "with")'
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
					v-on:change='(e) => updateGenres(e, "without")'
					:prefix='withoutGenres.length > 0 ? "Exclude" : "Exclude No Genre"'
					:menu-props="{ offsetY: true, maxHeight: 310 }"
					multiple
					chips
					deletable-chips
					hide-details)
			template(v-slot:append)
				.pa-3(:class='{ "pb-8": $vuetify.breakpoint.smAndDown }')
					v-btn(text block @click='discover' :loading='loading' :color='queried.with_genres != query.with_genres || queried.without_genres != query.without_genres ? "primary" : undefined')
						span Apply
		v-container(fluid)
			media-iterator(ref='mediaIterator' :media='discovery' :loading='loading' flat-header default-view='wide' :title='$vuetify.breakpoint.mdAndUp ? "Results" : ""' :dense='queryDrawer' :resource='["discover", "movie"]' :query='query')
				template(v-slot:header-prepend)
					v-btn(v-show='$vuetify.breakpoint.smAndDown' text :depressed='queryDrawer' @click='queryDrawer = true')
						v-icon mdi-filter-variant
						span Filters
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
		head: {
			title: "Discover Movies"
		},
		data: ({ $store }) => ({
			drawer: true,
			loading: true,
			discovery: { results: [] },
			queried: { with_genres: "", without_genres: "" },
			genres: $store.state.genres.movies.map(g => ({
				id: g.id,
				name: g.name,
				with: false,
				without: false
			})),
			withGenres: [],
			withoutGenres: []
		}),
		computed: {
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
				let query = {};
				if (this.withGenres.length > 0)
					query.with_genres = this.withGenres.join();
				if (this.withoutGenres.length > 0)
					query.without_genres = this.withoutGenres.join();
				if (this.$route.query.with_keywords)
					query.with_keywords = this.$route.query.with_keywords;
				return query;
			}
		},
		methods: {
			async discover() {
				try {
					this.loading = true;
					let response = await this.$api.tmdb(["discover", "movie"], this.query);
					this.discovery = response;
					this.queried = this.query;
					this.$refs.mediaIterator.reset();
					if (response.results.length == 0) throw new Error();
				} catch (error) {
					console.error(error);
				} finally {
					this.loading = false;
					this.queryDrawer = false;
				}
			},
			updateGenres(selected, target) {
				for (let genre of this.genres) {
					genre[target] = false;
					for (let id of selected)
						if (genre.id == id) {
							genre[target] = true;
							break;
						}
				}
				this.$router.push({ query: this.query });
			}
		},
		mounted() {
			this.$store.commit("SET_DRAWER", false);
			(this.withGenres = this.$route.query.with_genres
				? Array.from(this.$route.query.with_genres.toString().split(",")).map(
						item => Number(item)
				  )
				: []),
				(this.withoutGenres = this.$route.query.without_genres
					? Array.from(
							this.$route.query.without_genres.toString().split(",")
					  ).map(item => Number(item))
					: []);
			this.discover();
		}
	};
</script>
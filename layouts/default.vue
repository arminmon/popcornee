<template lang="pug">
	v-app(id='popcornee-app')
		//- Application Bar
		v-app-bar(app fixed :right='$vuetify.rtl' :collapse='collapsed' :clipped-left='!drawer && !$vuetify.rtl' :clipped-right='!drawer && $vuetify.rtl')
			v-progress-linear(absolute bottom height='3' :active='progress.active' :value='progress.value' :color='progress.color' :indeterminate='progress.active && progress.value == 0 && progress.color != "error"')
			v-btn(icon @click='drawer = !drawer')
				v-icon(:class='{"mdi-flip-h": !drawer}') mdi-backburger
			v-toolbar-title Popcornee
			v-spacer
			v-btn(icon disabled)
				v-icon mdi-account-circle
		//- Navigation Drawer
		v-navigation-drawer(v-model='drawer' app width='310' disable-resize-watcher)
			template(v-slot:prepend)
				v-text-field(
					v-model='search.query'
					type='search'
					role='search'
					name='search'
					@keyup.enter.native='startSearch'
					@focus='$event.target.select()'
					:loading='search.loading'
					:placeholder='search.showModes ? "Search?" : `Search ${search.mode.title}`'
					:readonly='search.showModes'
					autocomplete='off'
					solo
					flat
					height='63'
					clearable
					hide-details
					single-line)
					template(v-slot:prepend-inner)
						v-btn(icon @click='search.showModes = !search.showModes')
							v-scale-transition(leave-absolute)
								v-icon(v-show='!search.showModes') {{search.mode.icon}}
							v-scroll-y-reverse-transition(leave-absolute)
								v-icon(v-show='search.showModes') mdi-chevron-up
				v-expand-transition
					v-list(v-show='search.showModes')
						v-list-item-group(v-model='search.mode.value' mandatory)
							v-list-item(v-for='mode in search.modes' :key='mode.value' :value='mode.value' @click='search.mode= mode; search.showModes = false; startSearch()')
								v-list-item-icon
									v-icon {{mode.icon}}
								v-list-item-content
									v-list-item-title {{mode.title}}
				v-divider
			v-window(v-model='window')
				v-window-item(value='nav')
					v-list(nav)
						v-list-item(nuxt to='/')
							v-list-item-content
								v-list-item-title Root
						v-list-item(nuxt to='/discover/movies')
							v-list-item-content
								v-list-item-title Discover Movies
						v-list-item(nuxt to='/discover/series')
							v-list-item-content
								v-list-item-title Discover Series
				v-window-item(value='search')
					v-expand-transition
						.overline.text-center.pa-2(v-show='(search.results.length > 0 && search.loading == false) && (search.query != searched.query || search.mode.value != searched.mode.value)')
							span Results for 
							span.font-italic.font-weight-bold "{{searched.query}}" 
							span in {{searched.mode.title}}
							v-icon.d-block(small) mdi-chevron-down
					v-scroll-y-transition
						v-list.pt-0(v-show='search.results.length > 0 && search.loading == false')
							template(v-for='(result, index) in search.results')
								v-divider(v-if='index != 0' :key='index')
								//- Person
								v-list-group(v-if='result.media_type == "person" || searched.mode.value == "person"' :key='result.id')
									template(v-slot:activator)
										v-list-item-avatar
											v-img(v-if='result.profile_path' :src='$store.getters.imgURL(result.profile_path, "profile", 1)')
											v-icon(v-else style='opacity: .25') mdi-account-circle
										v-list-item-content
											v-list-item-title.font-weight-bold {{result.name}} 
											v-list-item-subtitle.overline {{result.known_for_department}}
											v-list-item-subtitle
												v-btn(icon x-small @click='dialog = false' nuxt :to='`/people/${result.id}`')
													v-icon(small style='opacity: .75') mdi-dots-horizontal-circle
									template(v-for='rMedia in result.known_for')
										//- Series
										v-list-item(v-if='rMedia.media_type == "tv"' :key='rMedia.id' @click='dialog = false' two-line nuxt :to='`/series/${rMedia.id}`')
											v-list-item-avatar(tile width='41' height='63')
												img(v-if='rMedia.poster_path' :src='$store.getters.imgURL(rMedia.poster_path, "poster", 0)')
												v-icon(v-else style='opacity: .25') mdi-image-off
											v-list-item-content
												v-list-item-title.font-weight-bold {{rMedia.name || rMedia.original_name}}
												v-list-item-subtitle.overline.font-weight-bold(v-if='rMedia.first_air_date') Since {{new Date(rMedia.first_air_date).toLocaleDateString("en-US", {year: "numeric", month: "short"})}}
												v-list-item-subtitle {{rMedia.overview}}
										//- Movie
										v-list-item(v-else-if='rMedia.media_type == "movie"' :key='rMedia.id' @click='dialog = false' two-line nuxt :to='`/movies/${rMedia.id}`')
											v-list-item-avatar(tile width='41' height='63')
												img(v-if='rMedia.poster_path' :src='$store.getters.imgURL(rMedia.poster_path, "poster", 0)')
												v-icon(v-else style='opacity: .25') mdi-image-off
											v-list-item-content
												v-list-item-title.font-weight-bold {{rMedia.title || rMedia.original_title}}
												v-list-item-subtitle.overline.font-weight-bold(v-if='rMedia.release_date') {{new Date(rMedia.release_date).toLocaleDateString("en-US", {year: "numeric", month: "short"})}}
												v-list-item-subtitle {{rMedia.overview}}
								//- Keyword
								//- v-list-item(v-else-if='searched.mode.value == "keyword"' :key='result.id' @click='dialog = false' nuxt :to='{ path: "/discover/movies", query: {with_keywords: result.id}}' exact)
									v-list-title.text-uppercase {{result.name}}
								//- Collection
								v-list-item(v-else-if='searched.mode.value == "collection"' :key='result.id' @click='dialog = false' nuxt :to='`/movies/collections/${result.id}`')
									v-list-item-avatar(tile width='41' height='63')
										img(v-if='result.poster_path' :src='$store.getters.imgURL(result.poster_path, "poster", 0)')
										v-icon(v-else style='opacity: .25') mdi-image-off
									v-list-item-content
										v-list-item-title.font-weight-bold {{result.name}}
								//- Series
								v-list-item(v-if='result.media_type == "tv" || searched.mode.value == "tv"' :key='result.id' @click='dialog = false' three-line nuxt :to='`/series/${result.id}`')
									v-list-item-avatar(tile width='41' height='63')
										img(v-if='result.poster_path' :src='$store.getters.imgURL(result.poster_path, "poster", 0)')
										v-icon(v-else style='opacity: .25') mdi-image-off
									v-list-item-content
										v-list-item-title.font-weight-bold {{result.name || result.original_name}}
										v-list-item-subtitle.overline.font-weight-bold(v-if='result.first_air_date') Since {{new Date(result.first_air_date).toLocaleDateString("en-US", {year: "numeric", month: "short"})}}
										v-list-item-subtitle {{result.overview}}
								//- Movie
								v-list-item(v-else-if='result.media_type == "movie" || searched.mode.value == "movie"' :key='result.id' @click='dialog = false' three-line nuxt :to='`/movies/${result.id}`')
									v-list-item-avatar(tile width='41' height='63')
										img(v-if='result.poster_path' :src='$store.getters.imgURL(result.poster_path, "poster", 0)')
										v-icon(v-else style='opacity: .25') mdi-image-off
									v-list-item-content
										v-list-item-title.font-weight-bold {{result.title || result.original_title}}
										v-list-item-subtitle.overline.font-weight-bold(v-if='result.release_date') {{new Date(result.release_date).toLocaleDateString("en-US", {year: "numeric", month: "short"})}}
										v-list-item-subtitle {{result.overview}}
					v-expand-transition
						.text-center.overline.pa-3(v-show='search.results.length == 0 && search.query == searched.query && search.mode.value == searched.mode.value && search.loading == false')
							span Found nothing for 
							span.font-italic.font-weight-bold "{{searched.query}}" 
							span in {{searched.mode.title}}
			template(v-slot:append)
				v-fade-transition
					.pa-6(v-show='window == "nav"')
						v-btn(block @click='$vuetify.theme.dark = !$vuetify.theme.dark')
							v-icon(left) {{$vuetify.theme.dark ? "mdi-lightbulb-on" : "mdi-lightbulb"}}
							| {{$vuetify.theme.dark ? "Lights On" : "Lights Off"}}
		//- Content
		nuxt
		//- Footer
		v-footer(app inset absolute)
</template>

<script>
	export default {
		data: _ => ({
			search: {
				query: "",
				loading: false,
				results: [],
				showModes: false,
				mode: {
					value: "multi",
					title: "Movies, Series & People",
					icon: "mdi-magnify"
				},
				modes: [
					{
						value: "multi",
						title: "Movies, Series & People",
						icon: "mdi-magnify"
					},
					{ value: "movie", title: "Movies", icon: "mdi-movie-open" },
					{ value: "tv", title: "Series", icon: "mdi-television-classic" },
					{
						value: "collection",
						title: "Collections",
						icon: "mdi-checkbox-multiple-blank"
					},
					{ value: "person", title: "People", icon: "mdi-account-box" }
					// { value: "keyword", title: "Keywords", icon: "mdi-file-word-box" }
				]
			},
			searched: {
				query: "",
				mode: ""
			}
		}),
		computed: {
			drawer: {
				get: ({ $store }) => $store.state.drawer,
				set(val) {
					this.$store.commit("SET_DRAWER", val);
				}
			},
			progress: ({ $store }) => $store.state.progress,
			collapsed: ({ $route }) =>
				$route.path != "/" && $route.path.split("/")[1] != "discover",
			window() {
				return this.search.query != "" &&
					this.search.query != null &&
					this.searched.query != ""
					? "search"
					: "nav";
			}
		},
		methods: {
			async startSearch() {
				if (this.search.query != "" && this.search.query != null)
					try {
						this.search.loading = true;
						let response = await this.$api.tmdb(
							["search", this.search.mode.value],
							{
								query: this.search.query
							}
						);
						this.searched.query = this.search.query;
						this.searched.mode = this.search.mode;
						this.search.loading = "success";
						this.search.results = response.results;
						if (response.results.length == 0) throw new Error();
					} catch (error) {
						this.search.fetching = "error";
					} finally {
						this.search.loading = false;
					}
			}
		}
	};
</script>

<style lang='scss'>
	.v-img--blurred {
		> .v-image__image {
			filter: blur(15px);
			transform: scale(1.2);
			// clip-path: content-box;
		}
	}
	.info-table {
		tbody {
			> tr {
				td {
					&:first-child {
						min-width: 100px;
						max-width: 25%;
					}
				}
			}
		}
	}
	.v-badge__badge {
		line-height: 1 !important;
	}
</style>

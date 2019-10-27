<template lang="pug">
	v-app(id='popcornee-app')
		//- Application Bar
		v-app-bar(
			app
			fixed
			:right='$vuetify.rtl'
			:collapse='collapsed'
			:clipped-left='!$store.state.drawer && !$vuetify.rtl'
			:clipped-right='!$store.state.drawer && $vuetify.rtl')
			v-btn(icon @click='$store.commit("SET_DRAWER", !$store.state.drawer)')
				v-icon(:class='{"mdi-flip-h": !$store.state.drawer}') mdi-backburger
			v-toolbar-title Popcornee
			v-spacer
			v-btn(icon disabled)
				v-icon mdi-account-circle
		//- Navigation Drawer
		v-navigation-drawer(app :value='$store.state.drawer' width='310' disable-resize-watcher)
			template(v-slot:prepend)
				.pa-2
					v-text-field(
						v-model='query'
						type='search'
						@keyup.enter.native='startSearch'
						@focus='$event.target.select()'
						:loading='search.fetching'
						autocomplete='off'
						clearable
						solo
						hide-details
						single-line
						:background-color='$vuetify.theme.dark ? "grey darken-4" : "grey lighten-3"')
						template(v-slot:prepend-inner)
							v-btn(:disabled='query == "" || query == null || query == search.query' icon @click='startSearch')
								v-icon mdi-magnify
			v-window(v-model='drawerWindow')
				v-window-item(value='nav')
					v-list(nav)
						v-list-item(nuxt to='/')
							v-list-item-content
								v-list-item-title Root
						v-list-item(nuxt to='/movies/discover')
							v-list-item-content
								v-list-item-title Discover Movies
						v-list-item(nuxt to='/series/discover')
							v-list-item-content
								v-list-item-title Discover Series
				v-window-item(value='search')
					v-scroll-y-transition
						v-list.pt-0(v-show='search.results.length > 0')
							v-skeleton-loader(v-for='(media, index) in search.results' :key='media.id' :loading='search.loading' type='list-item-avatar-three-line' tile)
								v-divider(v-if='index != 0' :key='index')
								//- Series
								v-list-item(v-if='media.media_type == "tv"' @click='dialog = false' three-line nuxt :to='`/series/${media.id}`')
									v-list-item-avatar(tile width='41' height='63')
										img(v-if='media.poster_path' :src='$store.getters.imgURL(media.poster_path, "poster", 0)')
										v-icon(v-else style='opacity: .25') mdi-image-off
									v-list-item-content
										v-list-item-title.font-weight-bold {{media.name || media.original_name}}
										v-list-item-subtitle.overline.font-weight-bold(v-if='media.first_air_date') Since {{new Date(media.first_air_date).toLocaleDateString("en-US", {year: "numeric", month: "short"})}}
										v-list-item-subtitle {{media.overview}}
								//- Movie
								v-list-item(v-else-if='media.media_type == "movie"' @click='dialog = false' three-line nuxt :to='`/movies/${media.id}`')
									v-list-item-avatar(tile width='41' height='63')
										img(v-if='media.poster_path' :src='$store.getters.imgURL(media.poster_path, "poster", 0)')
										v-icon(v-else style='opacity: .25') mdi-image-off
									v-list-item-content
										v-list-item-title.font-weight-bold {{media.title || media.original_title}}
										v-list-item-subtitle.overline.font-weight-bold(v-if='media.release_date') {{new Date(media.release_date).toLocaleDateString("en-US", {year: "numeric", month: "short"})}}
										v-list-item-subtitle {{media.overview}}
								//- Person
								v-list-group(v-else-if='media.media_type == "person"')
									template(v-slot:activator)
										v-list-item-avatar
											v-img(v-if='media.profile_path' :src='$store.getters.imgURL(media.profile_path, "profile", 1)')
											v-icon(v-else style='opacity: .25') mdi-account-circle
										v-list-item-content
											v-list-item-title.font-weight-bold {{media.name}} 
											v-list-item-subtitle.overline {{media.known_for_department}}
											v-list-item-subtitle
												v-btn(icon x-small @click='dialog = false' nuxt :to='`/people/${media.id}`')
													v-icon(small style='opacity: .75') mdi-dots-horizontal-circle
									template(v-for='(mMedia,mIndex) in media.known_for')
										//- Series
										v-list-item(v-if='mMedia.media_type == "tv"' two-line :key='mMedia.id' @click='dialog = false' nuxt :to='`/series/${mMedia.id}`')
											v-list-item-avatar(tile width='41' height='63')
												img(v-if='mMedia.poster_path' :src='$store.getters.imgURL(mMedia.poster_path, "poster", 0)')
												v-icon(v-else style='opacity: .25') mdi-image-off
											v-list-item-content
												v-list-item-title.font-weight-bold {{mMedia.name || mMedia.original_name}}
												v-list-item-subtitle.overline.font-weight-bold(v-if='mMedia.first_air_date') Since {{new Date(mMedia.first_air_date).toLocaleDateString("en-US", {year: "numeric", month: "short"})}}
												v-list-item-subtitle {{mMedia.overview}}
										//- Movie
										v-list-item(v-else-if='mMedia.media_type == "movie"' two-line :key='mMedia.id' @click='dialog = false' nuxt :to='`/movies/${mMedia.id}`')
											v-list-item-avatar(tile width='41' height='63')
												img(v-if='mMedia.poster_path' :src='$store.getters.imgURL(mMedia.poster_path, "poster", 0)')
												v-icon(v-else style='opacity: .25') mdi-image-off
											v-list-item-content
												v-list-item-title.font-weight-bold {{mMedia.title || mMedia.original_title}}
												v-list-item-subtitle.overline.font-weight-bold(v-if='mMedia.release_date') {{new Date(mMedia.release_date).toLocaleDateString("en-US", {year: "numeric", month: "short"})}}
												v-list-item-subtitle {{mMedia.overview}}
					v-scroll-y-transition
						.py-3(v-show='search.noResult')
							p.text-center.overline
								span Found nothing for  
								span.font-italic "{{search.query}}"
			template(v-slot:append)
				v-fade-transition
					.pa-6(v-show='drawerWindow == "nav"')
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
			drawerWindow: "nav",
			query: "",
			search: {
				query: "",
				fetching: false,
				loading: false,
				noResult: false,
				results: []
			}
		}),
		computed: {
			collapsed: ({ $route }) =>
				$route.path != "/" && $route.path.split("/")[2] != "discover"
		},
		watch: {
			query(newVal, oldVal) {
				if (newVal == "" || newVal == null) this.drawerWindow = "nav";
				else this.drawerWindow = "search";
			}
		},
		methods: {
			async startSearch() {
				if (this.query != "" && this.query != null)
					try {
						this.search.loading = true;
						this.search.fetching = true;
						let response = await this.$api.tmdb(["search", "multi"], {
							query: this.query
						});
						this.search.query = this.query;
						this.search.fetching = "success";
						this.search.noResult = false;
						this.search.results = response.results;
						if (response.results.length == 0) throw new Error();
					} catch (error) {
						this.search.fetching = "error";
						this.search.noResult = true;
					} finally {
						this.search.loading = false;
						setTimeout(_ => (this.search.fetching = false), 2000);
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
</style>

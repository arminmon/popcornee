<template lang="pug">
  v-navigation-drawer.rounded.elevation-24(
    v-model='drawer'
    app
    temporary
    floating
    :class='{ "my-4": $vuetify.breakpoint.mdAndUp, "my-2": $vuetify.breakpoint.smAndDown, "mx-4": $vuetify.breakpoint.mdAndUp && drawer, "mx-2": $vuetify.breakpoint.smAndDown && drawer }'
    :overlay-color='$vuetify.theme.dark ? "grey darken-4" : "grey lighten-4"'
    overlay-opacity='.75'
    :width='$vuetify.breakpoint.smAndDown ? 310 : 360'
    :height='`calc(100vh - ${$vuetify.breakpoint.smAndDown ? "16" : "32"}px)`'
    :right='$vuetify.rtl'
    disable-resize-watcher)
    v-progress-linear(absolute top height='3' :active='progress.active' :value='progress.value' :color='progress.color' :indeterminate='progress.active && progress.value == 0 && progress.color != "error"')
    template(v-slot:prepend)
      v-text-field.pt-0.mt-0(
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
        full-width
        flat
        height='67'
        hide-details
        single-line
        )
        template(v-slot:prepend-inner)
          v-btn.mx-1(icon @click='search.showModes = !search.showModes')
            v-scale-transition(leave-absolute)
              v-icon(v-show='!search.showModes') {{search.mode.icon}}
            v-scroll-y-reverse-transition(leave-absolute)
              v-icon(v-show='search.showModes') mdi-chevron-up
        template(v-slot:append)
          v-fade-transition
            v-btn.mx-1(v-show='search.query != null && search.query != ""' icon @click='search.query = null')
              v-icon mdi-close
      v-expand-transition
        v-list(v-show='search.showModes')
          v-list-item-group(v-model='search.mode.value' mandatory)
            v-list-item(v-for='mode in search.modes' :key='mode.value' :value='mode.value' @click='search.mode= mode; search.showModes = false; startSearch()')
              v-list-item-icon
                v-icon {{mode.icon}}
              v-list-item-content
                v-list-item-title {{mode.title}}
          v-divider
    v-window(v-model='window' vertical)
      v-window-item(value='nav')
        //- Navigation List
        v-list(nav)
          template(v-for='nav in navs')
            v-list-group(v-if='nav.subNavs' :key='nav.title' :group='nav.group' :prepend-icon='nav.icon' :color='undefined' no-action :value='true')
              template(v-slot:activator)
                v-list-item-title {{nav.title}}
              v-list-item(v-for='subNav in nav.subNavs' :key='nav.group + subNav.title' nuxt :to='subNav.to')
                v-list-item-icon
                  v-icon {{subNav.icon}}
                v-list-item-content
                  v-list-item-title {{subNav.title}}
            v-list-item(v-else :key='nav.title' nuxt :to='nav.to')
              v-list-item-icon
                v-icon {{nav.icon}}
              v-list-item-content
                v-list-item-title {{nav.title}}
      v-window-item(value='search')
        //- Search Tools
        v-expand-transition
          .overline.text-center.pa-2(v-show='(search.results.length > 0 && search.loading == false) && (search.query != searched.query || search.mode.value != searched.mode.value)')
            span Results for
            span.font-italic.font-weight-bold "{{searched.query}}"
            span in {{searched.mode.title}}
            v-icon.d-block(small) mdi-chevron-down
        v-scroll-y-transition
          v-list.pt-0(v-show='search.results.length > 0 && search.loading == false')
            template(v-for='(result, index) in search.results')
              v-divider(v-if='index != 0' :key='index' inset)
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
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: (_) => ({
    navs: [
      {
        title: 'Home Sweet Home',
        icon: 'mdi-home-variant',
        to: '/',
      },
      {
        title: 'Movies',
        icon: 'mdi-movie-open',
        group: 'movies',
        subNavs: [
          {
            title: 'Discover',
            icon: 'mdi-filter-variant',
            to: '/discover/movies',
          },
          {
            title: 'Upcoming',
            icon: 'mdi-chart-line-variant',
            to: '/movies/upcoming',
          },
          {
            title: 'Popular',
            icon: 'mdi-star-circle',
            to: '/movies/popular',
          },
          {
            title: 'Top Rated',
            icon: 'mdi-star',
            to: '/movies/top-rated',
          },
        ],
      },
      {
        title: 'Series',
        icon: 'mdi-television-classic',
        group: 'series',
        subNavs: [
          {
            title: 'Discover',
            icon: 'mdi-filter-variant',
            to: '/discover/series',
          },
          {
            title: 'Airing Today',
            icon: 'mdi-calendar-today',
            to: '/series/airing-today',
          },
          {
            title: 'Popular',
            icon: 'mdi-star-circle',
            to: '/series/popular',
          },
          {
            title: 'Top Rated',
            icon: 'mdi-star',
            to: '/series/top-rated',
          },
        ],
      },
    ],
    search: {
      query: '',
      loading: false,
      results: [],
      showModes: false,
      mode: {
        value: 'multi',
        title: 'Movies, Series & People',
        icon: 'mdi-magnify',
      },
      modes: [
        {
          value: 'multi',
          title: 'Movies, Series & People',
          icon: 'mdi-magnify',
        },
        { value: 'movie', title: 'Movies', icon: 'mdi-movie-open' },
        { value: 'tv', title: 'Series', icon: 'mdi-television-classic' },
        {
          value: 'collection',
          title: 'Collections',
          icon: 'mdi-checkbox-multiple-blank',
        },
        { value: 'person', title: 'People', icon: 'mdi-account-box' },
      ],
    },
    searched: {
      query: '',
      mode: '',
    },
  }),
  computed: {
    ...mapGetters(['progress']),
    drawer: {
      get: ({ $store }) => $store.state.drawer,
      set(val) {
        this.$store.commit('SET_DRAWER', val)
      },
    },
    window() {
      return this.search.query !== '' &&
        this.search.query !== null &&
        this.searched.query !== ''
        ? 'search'
        : 'nav'
    },
  },
  created() {
    this.$on('toggleDrawer', (_) => {
      this.toggleDrawer()
    })
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    },
    async startSearch() {
      if (this.search.query !== '' && this.search.query != null)
        try {
          this.search.loading = true
          const response = await this.$api.tmdb.get(
            `search/${this.search.mode.value}`,
            {
              params: {
                query: this.search.query,
              },
            }
          )
          this.searched.query = this.search.query
          this.searched.mode = this.search.mode
          this.search.loading = 'success'
          this.search.results = response.results
          if (response.results.length === 0) throw new Error('empty')
        } catch (e) {
          this.search.fetching = 'error'
        } finally {
          this.search.loading = false
        }
    },
  },
}
</script>

<template lang="pug">
  v-main.pt-0
    v-img#hero.v-img--blurred(
      :aspect-ratio='10'
      :src='$store.getters.imgURL(movie.backdrop_path, "backdrop", 0)'
      gradient='to top, rgba(var(--v-bg--rgb),1) 15%, rgba(var(--v-bg--rgb),.7) 100%'
      )
      template(v-slot:placeholder)
        v-row.pa-3.ma-0.fill-height(justify='end' align='start')
          v-progress-circular(indeterminate style='opacity: .25')
      v-container.py-12(:class='{ "pb-0": $vuetify.breakpoint.xsOnly }')
        v-row.py-6(align='center' justify='center')
          v-col(align-self='center')
            h1.display-1.font-weight-bold {{movie.title || movie.original_title}}
            h3.subtitle-1.font-weight-light.font-italic(v-if='movie.tagline') – {{movie.tagline}}
            p(v-if='movie.overview') {{movie.overview}}
            .d-block
              h2.subtitle-1.d-inline(v-if='movie.release_date')
                span.font-weight-bold {{new Date(movie.release_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}}
                span.font-weight-light(v-if='movie.status')  ({{movie.status}})
              h2.subtitle-1.font-weight-light(v-else) (N/A)
              releases-dialog(:releases='movie.release_dates.results' v-if='movie.release_date && movie.release_dates.results.length > 0')
            .mx-n1.py-2
              v-chip.ma-1(v-for='genre in movie.genres' :key='genre.id' :small='$vuetify.breakpoint.smAndDown' outlined nuxt :to='{ path: "/discover/movies", query: { with_genres: genre.id } }') {{genre.name}}
            .d-block(v-if='movie.vote_average > 0')
              v-rating.d-inline(:value='movie.vote_average/2' length='5' half-increments readonly :dense='$vuetify.breakpoint.mdAndDown' open-delay='300' color='orange' :background-color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-5"')
              .d-inline.overline.px-2
                span.font-weight-bold {{movie.vote_average}}
                span /10
            v-btn.mt-6(v-if='!getTab("Cast").disabled' height='100' text nuxt :to='getTab("Cast").to' exact :block='$vuetify.breakpoint.smAndDown')
              .mx-n2
                v-avatar.elevation-3.mx-2(v-for='person in movie.credits.cast.slice(0, $vuetify.breakpoint.smAndDown ? 3 : 4)' :key='person.credit_id' :size='$vuetify.breakpoint.smAndDown ? 65 : 78')
                  v-img(v-if='person.profile_path' :src='$store.getters.imgURL(person.profile_path, "profile", 1)' aspect-ratio='1' :lazy-src='$store.getters.imgURL(person.profile_path, "profile", 0)')
                  span.headline(v-else) {{person.name.split(" ")[0][0]}}{{person.name.split(" ")[1][0]}}
                v-avatar.mx-2(v-if='movie.credits.cast.length - ($vuetify.breakpoint.smAndDown ? 3 : 4) > 0' :size='$vuetify.breakpoint.smAndDown ? 65 : 78')
                  span.title +{{movie.credits.cast.length - ($vuetify.breakpoint.smAndDown ? 3 : 4)}}
          v-col(cols='12' sm='4' v-if='movie.poster_path')
            v-hover(v-slot:default='{ hover }')
              v-card(elevation='15')
                v-img(:src='$store.getters.imgURL(movie.poster_path, "poster", 4)' :lazy-src='$store.getters.imgURL(movie.poster_path, "poster", 0)' :aspect-ratio='2/3')
                  template(v-slot:placeholder)
                    v-row.pa-3.ma-0.fill-height(justify='center' align='center')
                      v-progress-circular(indeterminate)
                  v-row.pa-3.ma-0.fill-height(justify='center' align='end')
                    v-fab-transition
                      v-btn(v-show='hover' fab small :href='`${$store.getters.imgURL(movie.poster_path,"poster",6)}`' target='_blank')
                        v-icon mdi-download
    v-sheet#tabs(tile elevation='0')
      v-container.py-0(:class='{ "px-0": $vuetify.breakpoint.xsOnly }')
        v-tabs(show-arrows grow center-active icons-and-text background-color="transparent")
          v-tabs-slider
          v-tab(v-for='tab in tabs' :key='tab.title' nuxt :to='tab.to' :exact='tab.exact' v-if='!tab.disabled')
            span {{tab.title}}
            v-icon {{tab.icon}}
    v-sheet(tile elevation='0')
      nuxt-child(:key='$route.path' :movie='movie')
</template>

<script>
export default {
  scrollTo: 'top',
  validate: ({ params }) => /^\d+$/.test(params.movieID),
  asyncData: async ({ $axios, params }) => {
    let movie = await $axios.$get(`movie/${params.movieID}`, {
      params: {
        append_to_response: [
          'credits',
          'keywords',
          'external_ids',
          'videos',
          'recommendations',
          'similar',
          'release_dates',
          'reviews',
        ].join(','),
      },
    })
    if (movie.release_dates && movie.release_dates.results.length > 0)
      movie.release_dates.results.sort((a, b) =>
        a.iso_3166_1 > b.iso_3166_1 ? 1 : -1
      )
    movie.collection = null
    if (movie.belongs_to_collection) {
      movie.collection = await $axios.$get(
        `collection/${movie.belongs_to_collection.id}`
      )
      delete movie.belongs_to_collection
    }

    const tabs = [
      {
        title: 'Info',
        to: `/movies/${params.movieID}`,
        icon: 'mdi-information-variant',
        exact: true,
      },
      {
        title: 'Cast',
        to: `/movies/${params.movieID}/cast`,
        icon: 'mdi-account-box-multiple',
        disabled: movie.credits.cast.length < 1,
      },
      {
        title: 'Crew',
        to: `/movies/${params.movieID}/crew`,
        icon: 'mdi-account-group',
        disabled: movie.credits.crew.length < 1,
      },
      {
        title: 'Videos',
        to: `/movies/${params.movieID}/videos`,
        icon: 'mdi-filmstrip-box-multiple',
        disabled: movie.videos.total_results < 1,
      },
      {
        title: 'Reviews',
        to: `/movies/${params.movieID}/reviews`,
        icon: 'mdi-android-messages',
        disabled: movie.reviews.total_results < 1,
      },
      {
        title: 'Similar',
        to: `/movies/${params.movieID}/similar`,
        icon: 'mdi-approximately-equal-box',
        disabled: movie.similar.total_results < 1,
      },
    ]

    return { movie, tabs }
  },
  fetch: async ({ store }) => {
    await store.dispatch('FETCH_CONFIGS')
    await store.dispatch('FETCH_GENRES')
  },
  head() {
    return {
      title: `${this.title} (${this.releaseDate})${
        this.movie.tagline ? ' – ' + this.movie.tagline : ''
      }`,
    }
  },
  computed: {
    title() {
      return this.movie.title || this.movie.original_title
    },
    releaseDate() {
      return this.movie.release_date
        ? new Date(this.movie.release_date).toLocaleDateString('en-US', {
            year: 'numeric',
          })
        : 'n/a'
    },
  },
  methods: {
    getTab(title) {
      return this.tabs.find((item) => item.title === title)
    },
  },
  mounted() {
    this.$store.commit('COLLAPSE_APP_BAR', true)
  },
}
</script>

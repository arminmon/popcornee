<template lang="pug">
div
  v-container.pa-0
    v-row.py-4
      v-col(align-self='center')
        h1.display-1.font-weight-bold {{season.name}}
        p(v-if='season.overview') {{season.overview}}
        .d-block
          h2.subtitle-1.d-inline(v-if='season.air_date')
            span.font-weight-bold {{new Date(season.air_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
          h2.subtitle-1(v-else) (N/A)
      v-col(cols='12' sm='3' :class='{ "px-12": $vuetify.breakpoint.smAndDown }' v-if='season.poster_path')
        v-hover(v-slot:default='{ hover }')
          v-card(elevation='15')
            v-img(:src='$store.getters.imgURL(season.poster_path, "poster", 4)' :lazy-src='$store.getters.imgURL(season.poster_path, "poster", 0)' :aspect-ratio='2/3')
              template(v-slot:placeholder)
                v-row.pa-3.ma-0.fill-height(justify='center' align='center')
                  v-progress-circular(indeterminate)
              v-row.pa-3.ma-0.fill-height(justify='center' align='end')
                v-fab-transition
                  v-btn(v-show='hover' fab small :href='`${$store.getters.imgURL(season.poster_path,"poster",6)}`' target='_blank')
                    v-icon mdi-download
    v-tabs(show-arrows grow center-active icons-and-text background-color="transparent")
      v-tabs-slider
      v-tab(v-for='tab in tabs' :key='tab.title' nuxt :to='tab.to' exact v-if='!tab.disabled')
        span {{tab.title}}
        v-icon {{tab.icon}}
    nuxt-child(:key='$route.params.seasonNum' :season='season')
</template>

<script>
export default {
  scrollTo: '#seasons',
  validate: ({ params }) => /^\d+$/.test(params.seasonNum),
  asyncData: async ({ $axios, params, store }) => {
    const season = await $axios.$get(
      `tv/${params.seriesID}/season/${params.seasonNum}`,
      {
        params: {
          append_to_response: ['credits', 'external_ids', 'videos'].join(','),
        },
      }
    )

    const tabs = [
      {
        title: 'Episodes',
        to: `/series/${params.seriesID}/seasons/${params.seasonNum}/episodes`,
        icon: 'mdi-format-list-bulleted',
      },
      {
        title: 'Cast',
        to: `/series/${params.seriesID}/seasons/${params.seasonNum}/cast`,
        icon: 'mdi-account-box-multiple',
        disabled: season.credits.cast.length < 1,
      },
      {
        title: 'Crew',
        to: `/series/${params.seriesID}/seasons/${params.seasonNum}/crew`,
        icon: 'mdi-account-group',
        disabled: season.credits.crew.length < 1,
      },
      {
        title: 'Videos',
        to: `/series/${params.seriesID}/seasons/${params.seasonNum}/videos`,
        icon: 'mdi-filmstrip-box-multiple',
        disabled: season.videos.total_results < 1,
      },
    ]

    return { season, tabs }
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

<template lang="pug">
	v-main.pt-0
		v-img#hero.v-img--blurred(
			:aspect-ratio='10'
			:src='$store.getters.imgURL(series.backdrop_path, "backdrop", 0)'
			:lazy-src='$store.getters.imgURL(series.backdrop_path, "backdrop", 0)'
			:gradient='$utils.gradient("to top", [{ alpha: "1", pos: "15%" }, { alpha: ".7", pos: "100%" }])'
			)
			template(v-slot:placeholder)
				v-row.pa-3.ma-0.fill-height(justify='end' align='start')
					v-progress-circular(indeterminate style='opacity: .25')
			v-container.py-12(:class='{ "pb-0": $vuetify.breakpoint.xsOnly }')
				v-row.py-6(align='center' justify='center')
					v-col(align-self='center')
						h1.display-1.font-weight-bold {{series.name || series.original_name}}
						p(v-if='series.overview') {{series.overview}}
						.d-block
							h2.subtitle-1.d-inline(v-if='series.first_air_date')
								span.font-weight-bold {{new Date(series.first_air_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
								span(v-if='series.status' :class='{ "red--text": series.status.toLowerCase() == "canceled", "blue--text": series.status.toLowerCase() == "ended" }')  ({{series.status}})
							h2.subtitle-1.font-weight-light(v-else) (N/A)
						v-btn.overline(text small nuxt :to='getTab("Seasons").to') {{series.number_of_episodes}} {{series.number_of_episodes > 1 ? "Episodes" : "Episode"}} in {{series.number_of_seasons}} {{series.number_of_seasons > 1 ? "Seasons" : "Season"}}
						.mx-n1.py-2
							v-chip.ma-1(v-for='genre in series.genres' :key='genre.id' :small='$vuetify.breakpoint.smAndDown' outlined nuxt :to='{ path: "/discover/series", query: {with_genres: genre.id}}') {{genre.name}}
						.d-block(v-if='series.vote_average > 0')
							v-rating.d-inline(:value='series.vote_average/2' length='5' half-increments readonly :dense='$vuetify.breakpoint.mdAndDown' open-delay='300' color='orange' :background-color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-5"')
							.d-inline.overline.px-2
								span.font-weight-bold {{series.vote_average}}
								span /10
						v-btn.mt-6(v-if='!getTab("Cast").disabled' height='100' text nuxt :to='getTab("Cast").to' exact :block='$vuetify.breakpoint.smAndDown')
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
										v-row.pa-3.ma-0.fill-height(justify='center' align='center')
											v-progress-circular(indeterminate)
									v-row.pa-3.ma-0.fill-height(justify='center' align='end')
										v-fab-transition
											v-btn(v-show='hover' fab small :href='`${$store.getters.imgURL(series.poster_path,"poster",6)}`' target='_blank')
												v-icon mdi-download
		v-sheet#tabs(tile elevation='0')
			v-container.py-0(:class='{ "px-0": $vuetify.breakpoint.xsOnly }')
				v-tabs(show-arrows grow center-active icons-and-text background-color="transparent")
					v-tabs-slider
					v-tab(v-for='tab in tabs' :key='tab.title' nuxt :to='tab.to' :exact='tab.exact' v-if='!tab.disabled')
						span {{tab.title}}
						v-icon {{tab.icon}}
		nuxt-child(:key='$route.path' :series='series')
</template>

<script>
export default {
  scrollTo: 'top',
  validate: ({ params }) => /^\d+$/.test(params.seriesID),
  asyncData: async ({ $axios, params, store }) => {
    const series = await $axios.$get(`tv/${params.seriesID}`, {
      params: {
        append_to_response: [
          'credits',
          'keywords',
          'external_ids',
          'videos',
          'recommendations',
          'similar',
          'reviews',
          'content_ratings',
        ].join(','),
      },
    })

    const tabs = [
      {
        title: 'Info',
        to: `/series/${params.seriesID}`,
        icon: 'mdi-information-variant',
        exact: true,
      },
      {
        title: 'Seasons',
        to: `/series/${params.seriesID}/seasons`,
        icon: 'mdi-cards-variant',
      },
      {
        title: 'Cast',
        to: `/series/${params.seriesID}/cast`,
        icon: 'mdi-account-box-multiple',
        disabled: series.credits.cast.length < 1,
      },
      {
        title: 'Crew',
        to: `/series/${params.seriesID}/crew`,
        icon: 'mdi-account-group',
        disabled: series.credits.crew.length < 1,
      },
      {
        title: 'Videos',
        to: `/series/${params.seriesID}/videos`,
        icon: 'mdi-filmstrip-box-multiple',
        disabled: series.videos.total_results < 1,
      },
      {
        title: 'Reviews',
        to: `/series/${params.seriesID}/reviews`,
        icon: 'mdi-android-messages',
        disabled: series.reviews.total_results < 1,
      },
      {
        title: 'Similar',
        to: `/series/${params.seriesID}/similar`,
        icon: 'mdi-approximately-equal-box',
        disabled: series.similar.total_results < 1,
      },
    ]

    return { series, tabs }
  },
  fetch: async ({ store }) => {
    await store.dispatch('FETCH_CONFIGS')
    await store.dispatch('FETCH_GENRES')
  },
  head() {
    return {
      title: `${this.title} (${this.airDate})${
        this.series.tagline ? ' – ' + this.series.tagline : ''
      }`,
    }
  },
  computed: {
    title() {
      return this.series.name || this.series.original_name
    },
    airDate() {
      return this.series.first_air_date
        ? new Date(this.series.first_air_date).toLocaleDateString('en-US', {
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

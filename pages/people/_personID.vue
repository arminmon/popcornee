<template lang="pug">
	v-main.pt-0
		v-img#hero(
			:aspect-ratio='10'
			src='/null.png'
			:gradient='$utils.gradient("to top", [{ alpha: "1", pos: "15%" }, { alpha: ".7", pos: "100%" }])'
			)
			template(v-slot:placeholder)
				v-row.pa-3.ma-0.fill-height(justify='end' align='start')
					v-progress-circular(indeterminate style='opacity: .25')
			v-container.py-12(:class='{ "pb-0": $vuetify.breakpoint.xsOnly }')
				v-row.py-6(align='center' justify='center')
					v-col(v-if='person.profile_path' cols='12' sm='3' order='last' order-sm='first' :class='{ "px-12": $vuetify.breakpoint.smAndDown }')
						v-hover(v-slot:default='{ hover }')
							v-card(elevation='15')
								v-img(:src='$store.getters.imgURL(person.profile_path, "profile", 2)' :lazy-src='$store.getters.imgURL(person.profile_path, "profile", 2)' :aspect-ratio='2/3')
									template(v-slot:placeholder)
										v-row.pa-3.ma-0.fill-height(justify='center' align='center')
											v-progress-circular(indeterminate)
									v-row.pa-3.ma-0.fill-height(justify='center' align='end')
										v-fab-transition
											v-btn(v-show='hover' fab small :href='`${$store.getters.imgURL(person.profile_path,"profile",3)}`' target='_blank')
												v-icon mdi-download
					v-col(align-self='center')
						h1.display-1.font-weight-bold {{person.name}}
						h2.subtitle-1.my-2(v-if='person.birthday')
							span.font-weight-bold {{new Date(person.birthday).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
							span.font-weight-light(v-if='person.place_of_birth')  ({{person.place_of_birth}})
						h2.subtitle-1.my-2(v-if='person.deathday')
							span.font-weight-bold {{new Date(person.deathday).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
							span.font-weight-light  (Deceased)
						p(v-if='person.biography' v-html='person.biography')
		v-sheet#tabs(tile elevation='0')
			v-container.py-0(:class='{ "px-0": $vuetify.breakpoint.xsOnly }')
				v-tabs(show-arrows grow center-active icons-and-text background-color="transparent")
					v-tabs-slider
					v-tab(v-for='tab in tabs' :key='tab.title' nuxt :to='tab.to' exact v-if='!tab.disabled')
						span {{tab.title}}
						v-icon {{tab.icon}}
		nuxt-child(:key='$route.path' :person='person')
</template>

<script>
export default {
  scrollTo: 'top',
  validate({ params }) {
    return /^\d+$/.test(params.personID)
  },
  asyncData: async ({ $axios, params }) => {
    const person = await $axios.$get(`person/${params.personID}`, {
      params: {
        append_to_response: [
          'movie_credits',
          'tv_credits',
          'external_ids',
          'images',
        ].join(','),
      },
    })

    const tabs = [
      {
        title: 'Info',
        to: `/people/${params.personID}`,
        icon: 'mdi-information-variant',
      },
      {
        title: 'Movies',
        to: `/people/${params.personID}/movies`,
        icon: 'mdi-movie-open',
        disabled:
          person.movie_credits.cast.length < 1 &&
          person.movie_credits.crew.length < 1,
      },
      {
        title: 'Series',
        to: `/people/${params.personID}/series`,
        icon: 'mdi-television-classic',
        disabled:
          person.tv_credits.cast.length < 1 &&
          person.tv_credits.crew.length < 1,
      },
      {
        title: 'Images',
        to: `/people/${params.personID}/images`,
        icon: 'mdi-image-multiple',
        disabled: person.images.profiles.length < 1,
      },
    ]

    return { person, tabs }
  },
  fetch: async ({ store }) => {
    await store.dispatch('FETCH_CONFIGS')
    await store.dispatch('FETCH_GENRES')
  },
  head() {
    return {
      title: this.person.name,
    }
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

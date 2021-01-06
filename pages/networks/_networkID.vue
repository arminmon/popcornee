<template lang="pug">
	v-main.pt-0
		v-img#hero(
			:aspect-ratio='10'
			src='/null.png'
			:gradient='$utils.gradient("to top", [{ alpha: "1", pos: "0%" }, { alpha: "0", pos: "100%" }])'
			)
			template(v-slot:placeholder)
				v-row.pa-3.ma-0.fill-height(justify='end' align='start')
					v-progress-circular(indeterminate style='opacity: .25')
			v-container.py-12
				v-row.py-4(align='center' justify='center')
					v-col(cols='12' sm='3' :order='$vuetify.breakpoint.xsOnly ? "last" : "first"' v-if='network.images.logos[0].file_path')
						v-img(:src='$store.getters.imgURL(network.images.logos[0].file_path, "logo", 4)' :lazy-src='$store.getters.imgURL(network.images.logos[0].file_path, "logo", 4)')
					v-col.px-6(cols='12' :sm='network.images.logos[0].file_path ? 9 : 12')
						h1.display-1 {{network.name}}
		v-sheet#tabs(tile elevation='0')
			v-container.py-0(:class='{ "px-0": $vuetify.breakpoint.xsOnly }')
				v-tabs(show-arrows grow center-active icons-and-text background-color="transparent")
					v-tabs-slider
					v-tab(v-for='tab in tabs' :key='tab.title' nuxt :to='tab.to' :exact='tab.exact' v-if='!tab.disabled')
						span {{tab.title}}
						v-icon {{tab.icon}}
		nuxt-child(:key='$route.path' :network='network')
</template>

<script>
export default {
  scrollTo: 'top',
  validate: ({ params }) => /^\d+$/.test(params.networkID),
  asyncData: async ({ $axios, params }) => {
    const network = await $axios.$get(`network/${params.networkID}`, {
      params: { append_to_response: ['images'].join(',') },
    })

    const tabs = [
      {
        title: 'Info',
        to: `/networks/${params.networkID}`,
        icon: 'mdi-information-variant',
        exact: true,
      },
      {
        title: 'Images',
        to: `/networks/${params.networkID}/images`,
        icon: 'mdi-image-multiple',
        disabled: this.network.images.logos.length < 1,
      },
    ]

    return { network, tabs }
  },
  fetch: async ({ store }) => {
    await store.dispatch('FETCH_CONFIGS')
  },
  head() {
    return {
      title: this.network.name,
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

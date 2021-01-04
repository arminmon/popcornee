<template lang="pug">
	v-main.pt-0
		v-img(
			:aspect-ratio='10'
			src='/null.png'
			:gradient='$utils.gradient("to top", [{ alpha: "1", pos: "0%" }, { alpha: "0", pos: "100%" }])'
			)
			template(v-slot:placeholder)
				v-row.pa-3.ma-0.fill-height(justify='start' align='start')
					v-progress-circular(indeterminate style='opacity: .25')
			v-container.py-12(:class='{ "pb-0": $vuetify.breakpoint.xsOnly }')
				v-row.py-4(align='center' justify='center')
					v-col(cols='12' sm='3' :order='$vuetify.breakpoint.xsOnly ? "last" : "first"' v-if='company.logo_path')
						v-img(:src='$store.getters.imgURL(company.logo_path, "logo", 4)')
					v-col(cols='12' :sm='company.logo_path ? 9 : 12')
						h1.display-1 {{company.name}}
						p(v-if='company.description' v-html='company.description')
		v-sheet(tile elevation='0')
			v-container.py-0(:class='{ "px-0": $vuetify.breakpoint.xsOnly }')
				v-tabs#tabs(v-model='tab' show-arrows grow center-active icons-and-text background-color="transparent")
					v-tabs-slider
					v-tab(v-for='tab in tabs' :key='tab.to' nuxt replace :to='tab.to' v-if='!tab.disabled')
						span {{tab.title}}
						v-icon {{tab.icon}}
		v-tabs-items(v-model='tab')
			//- Info Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__info')
				//- Info Table
				v-container
					v-simple-table.py-6.info-table
						tbody
							tr(v-if='company.headquarters')
								td.text-right.caption.font-weight-light Headquarters
								td {{company.headquarters}}
							tr(v-if='company.origin_country')
								td.text-right.caption.font-weight-light Country of Origin
								td
									v-chip {{company.origin_country}}
			//- Images ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__images' v-if='company.images.logos.length > 0')
				v-container
					v-row(dense justify='center')
						v-col(v-for='image in company.images.logos' :key='image.file_path' cols='6' sm='4' md='3' lg='2' xl='1')
							v-hover(v-slot:default='{ hover }')
								v-card.pa-3(hover :href='`${$store.getters.imgURL(image.file_path,"logo",6)}`' target='_blank')
									v-img(:src='$store.getters.imgURL(company.logo_path, "logo", 3)' :lazy-src='$store.getters.imgURL(company.logo_path, "logo", 0)' contain aspect-ratio='1')
										template(v-slot:placeholder)
											v-row.pa-3.ma-0.fill-height(justify='center' align='center')
												v-progress-circular(indeterminate)
										v-row.pa-3.ma-0.fill-height(justify='center' align='center')
											v-fab-transition
												v-btn(v-show='hover' fab small)
													v-icon mdi-download
</template>

<script>
export default {
  validate: ({ params }) =>
    /^\d+$/.test(String(params.companyID).split('-')[0]),
  asyncData: ({ app, params, error }) =>
    app.$api.tmdb
      .get(`company/${String(params.companyID).split('-')[0]}`, {
        params: { append_to_response: 'images' },
      })
      .then((res) => ({ company: res }))
      .catch((e) => error(e)),
  data: (_) => ({
    tab: null,
  }),
  fetch: async ({ store }) => {
    await store.dispatch('FETCH_CONFIGS')
  },
  head() {
    return {
      title: this.company.name,
    }
  },
  computed: {
    tabs() {
      return [
        {
          title: 'Info',
          to: '#tab__info',
          icon: 'mdi-information-variant',
        },
        {
          title: 'Images',
          to: '#tab__images',
          icon: 'mdi-image-multiple',
          disabled: this.company.images.logos.length < 1,
        },
      ]
    },
  },
  mounted() {
    this.$store.commit('COLLAPSE_APP_BAR', true)
    if (this.$route.hash === '') this.$router.replace({ hash: '#tab__info' })
  },
}
</script>

<template lang="pug">
	v-main.pt-0
		v-img#hero(
			:aspect-ratio='10'
			:src='$store.getters.imgURL(collection.backdrop_path, "backdrop", 2)'
			:lazy-src='$store.getters.imgURL(collection.backdrop_path, "backdrop", 0)'
			gradient='to top, rgba(var(--v-bg--rgb),1) 15%, rgba(var(--v-bg--rgb),.7) 100%'
			)
			template(v-slot:placeholder)
				v-row.pa-3.ma-0.fill-height(justify='end' align='start')
					v-progress-circular(indeterminate style='opacity: .25')
			v-container.py-12(:class='{ "pb-0": $vuetify.breakpoint.xsOnly }')
				v-row.py-6(align='center' justify='center')
					v-col(align-self='center')
						h1.display-1.font-weight-bold {{collection.name}}
						p(v-if='collection.overview') {{collection.overview}}
					v-col(cols='12' sm='4' v-if='collection.poster_path')
						v-hover(v-slot:default='{ hover }')
							v-card(elevation='15')
								v-img(:src='$store.getters.imgURL(collection.poster_path, "poster", 4)' :lazy-src='$store.getters.imgURL(collection.poster_path, "poster", 0)' :aspect-ratio='2/3')
									template(v-slot:placeholder)
										v-row.pa-3.ma-0.fill-height(justify='center' align='center')
											v-progress-circular(indeterminate)
									v-row.pa-3.ma-0.fill-height(justify='center' align='end')
										v-fab-transition
											v-btn(v-show='hover' fab small :href='`${$store.getters.imgURL(collection.poster_path,"poster",6)}`' target='_blank')
												v-icon mdi-download
		//- Collection
		v-sheet(elevation='0')
			v-container(fluid)
				media-iterator(:media='collection.parts' default-view='wide')
</template>

<script>
export default {
  scrollTo: 'top',
  validate: ({ params }) => /^\d+$/.test(params.collectionID),
  asyncData: async ({ $axios, params }) => {
    const collection = await $axios
      .$get(`collection/${params.collectionID}`)
      .then((res) => ({ collection: res }))

    return collection
  },
  fetch: async ({ store }) => {
    await store.dispatch('FETCH_CONFIGS')
    await store.dispatch('FETCH_GENRES')
  },
  head() {
    return {
      title: this.collection.name,
    }
  },
  mounted() {
    this.$store.commit('COLLAPSE_APP_BAR', true)
  },
}
</script>

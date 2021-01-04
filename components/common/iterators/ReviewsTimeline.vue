<template lang="pug">
	v-container
		v-timeline.py-6(dense align-top)
			v-timeline-item(v-for='review in reviews.results' :key='review.id' icon='mdi-account')
				v-card(:color='$vuetify.theme.dark ? "grey darken-4" : "grey lighten-3"')
					v-card-title
						.title.font-weight-bold {{review.author}}
					v-card-text
						blockquote.blockquote.pa-0
							p {{review.content}}
		.text-center(v-if='reviews.total_pages > 1')
			v-pagination(:value='reviews.page' :length='reviews.total_pages')
</template>

<script>
export default {
  props: {
    reviews: { type: Object, default: undefined },
  },
}
</script>

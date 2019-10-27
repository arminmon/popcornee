<template lang="pug">
	v-container
		v-timeline.py-6(dense align-top)
			v-timeline-item(v-for='review in reviews.results' :key='review.id' hide-dot)
				v-card(elevation='15' :color='$vuetify.theme.dark ? "grey darken-4" : "white"')
					v-card-title
						v-list-item.grow
							v-list-item-avatar(color='primary')
								v-icon.elevation-3 mdi-account
							v-list-item-content
								v-list-item-title {{review.author}}
					v-card-text
						blockquote.blockquote.pa-2.pb-0 {{review.content}}
		.text-center(v-if='reviews.total_pages > 1')
			v-pagination(:value='reviews.page' :length='reviews.total_pages')
</template>

<script>
	export default {
		props: {
			reviews: Object
		}
	};
</script>
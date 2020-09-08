<template lang="pug">
	v-main
		v-container
			v-row.pb-12(align='center' justify='center')
				v-card
					v-card-title What are you trying to discover?
					v-card-text.text-center
						v-btn(text x-large nuxt to='discover/movies') Movies
						span.mx-2 or
						v-btn(text x-large nuxt to='discover/series') Series
</template>

<script>
export default {
	mounted() {
		this.$store.commit('SET_DRAWER', false)
		this.$store.commit('COLLAPSE_APP_BAR', false)
	},
	head: {
		title: 'Discover'
	}
}
</script>

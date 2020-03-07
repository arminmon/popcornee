<template lang="pug">
	v-content
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
		head: {
			title: "Discover"
		},
		mounted() {
			this.$store.commit("SET_DRAWER", false);
			this.$store.commit("COLLAPSE_APP_BAR", false);
		}
	};
</script>
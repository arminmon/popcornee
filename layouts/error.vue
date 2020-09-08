<template lang="pug">
	v-main
		v-container
			v-row.pb-12(align='center' justify='center')
				v-card(color='error' elevation='16')
					v-card-title.justify-center
						span.display-4.font-weight-black {{error.statusCode}}
					v-card-text.text-center.title {{error.message}}
					v-card-actions
						v-spacer
						v-btn(text nuxt to='/')
							v-icon(left) mdi-home-import-outline
							| Go Home
</template>

<script>
export default {
	props: {
		error: {
			type: Object,
			default: null
		}
	},
	head() {
		return { title: `ERROR ${this.error.statusCode}` }
	}
}
</script>

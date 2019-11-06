<template lang="pug">
	v-content
		v-container.fill-height
			v-row.pb-12(align='center' justify='center')
				v-card(color='error')
					v-card-title
						span.display-4.font-weight-black {{error.statusCode}}
					v-card-text.title {{error.message}}
					v-card-actions
						v-spacer
						v-btn(text to='/' nuxt)
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
			const title =
				this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
			return {
				title
			};
		}
	};
</script>
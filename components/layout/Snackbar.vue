<template lang="pug">
	v-snackbar(v-model='value' :color='color' :timeout='0') {{text}}
</template>

<script>
	export default {
		data: _ => ({
			value: false
		}),
		computed: {
			text: ({ $store }) =>
				$store.state.snackbar.text
					? $store.state.snackbar.text
					: $store.state.snackbar,
			color: ({ $store }) =>
				$store.state.snackbar.color ? $store.state.snackbar.color : undefined
		},
		watch: {
			text(val) {
				this.value = true;
				setTimeout(_ => (this.value = false), 3000);
			},
			value(val) {
				if (!val) this.$store.commit("SET_SNACKBAR", {});
			}
		}
	};
</script>
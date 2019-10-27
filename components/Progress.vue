<template lang="pug">
	v-bottom-sheet(v-model='active' eager attach='#popcornee-app' origin='bottom center' hide-overlay persistent)
		v-progress-linear(:active='active' :color='color' height='6' :rounded='false' :value='value' :indeterminate='starting')
</template>

<script>
	export default {
		data: () => ({
			active: false,
			value: 0,
			color: "primary"
		}),
		computed: {
			starting() {
				return this.active && this.value == 0 && this.color != "error";
			}
		},
		methods: {
			start() {
				this.color = "primary";
				this.active = true;
			},
			finish() {
				this.active = false;
			},
			increase(num) {
				this.value = num;
			},
			fail() {
				this.color = "error";
			}
		}
	};
</script>
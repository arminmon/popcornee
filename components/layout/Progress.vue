<template lang="pug">
</template>

<script>
export default {
	methods: {
		start() {
			this.$store.commit('SET_PROGRESS_COLOR', 'primary')
			this.$store.commit('SET_PROGRESS_ACTIVE', true)
		},
		finish() {
			this.$store.commit('SET_PROGRESS_ACTIVE', false)
		},
		increase(num) {
			this.$store.commit('SET_PROGRESS_VALUE', num)
		},
		fail() {
			this.$store.commit('SET_PROGRESS_COLOR', 'error')
		}
	}
}
</script>

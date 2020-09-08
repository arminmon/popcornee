<template lang="pug">
	v-hover(v-slot:default='{ hover }')
		v-card(hover :href='site.link' target='_blank')
			v-img(:src='site.img' :aspect-ratio='480/360' contain)
				template(v-slot:placeholder)
					v-row.pa-3.ma-0.fill-height(justify='start' align='start')
						v-progress-circular(indeterminate style='opacity: .25')
				v-overlay(:value='hover' absolute z-index='4' :color='site.color' opacity='0.75')
					v-icon(size='85') mdi-youtube
			v-list-item
				v-list-item-title.font-weight-bold.text-wrap {{video.name}}
</template>

<script>
export default {
	props: {
		video: { type: Object, default: undefined }
	},
	computed: {
		site() {
			let site = {}
			switch (this.video.site) {
				case 'YouTube':
					site = {
						link: `https://www.youtube.com/watch?v=${this.video.key}`,
						img: `https://img.youtube.com/vi/${this.video.key}/0.jpg`,
						color: '#ff0000'
					}
					break
				case 'Vimeo':
					site = {
						link: `https://www.youtube.com/watch?v=${this.video.key}`,
						img: '/null.png',
						color: '#1ab7ea'
					}
					break
			}
			return site
		}
	}
}
</script>

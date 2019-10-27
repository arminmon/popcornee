<template lang="pug">
	v-hover(v-slot:default='{ hover }')
		v-card(hover :color='$vuetify.theme.dark ? "grey darken-4" : "grey lighten-3"' :href='site.link' target='_blank')
			v-img(:src='site.img' :aspect-ratio='480/360' contain :gradient='$utils.gradient("to top", [{alpha: ".95", pos: "0%"}, {alpha: "0", pos: "75%"}])')
				template(v-slot:placeholder)
					v-row.fill-height.ma-0.pa-3(justify='start' align='start')
						v-progress-circular(indeterminate style='opacity: .25')
				v-container.fill-height(fluid)
					v-row.fill-height(align='end' no-gutters)
						v-col(cols='12')
							v-list-item(flat)
								v-list-item-content
									v-list-item-title.font-weight-bold.text-wrap {{video.name}}
			v-overlay(:value='hover' absolute z-index='4' :color='site.color' opacity='0.6')
				v-icon(size='85') mdi-youtube

</template>

<script>
	export default {
		props: {
			video: Object
		},
		computed: {
			site() {
				switch (this.video.site) {
					case "YouTube":
						return {
							link: `https://www.youtube.com/watch?v=${this.video.key}`,
							img: `https://img.youtube.com/vi/${this.video.key}/0.jpg`,
							color: "#ff0000"
						};
					case "Vimeo":
						return {
							link: `https://www.youtube.com/watch?v=${this.video.key}`,
							img: "/null.png",
							color: "#1ab7ea"
						};
				}
			}
		}
	};
</script>
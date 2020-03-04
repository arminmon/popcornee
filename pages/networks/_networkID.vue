<template lang="pug">
	v-content.pt-0
		v-img(
			:aspect-ratio='10'
			src='/null.png'
			:gradient='$utils.gradient("to top", [{ alpha: "1", pos: "0%" }, { alpha: "0", pos: "100%" }])'
			)
			template(v-slot:placeholder)
				.d-flex.pa-3.fill-height.justify-start.align-start
					v-progress-circular(indeterminate style='opacity: .25')
			v-container.py-12
				v-row.py-4(align='center' justify='center')
					v-col(cols='12' sm='3' :order='$vuetify.breakpoint.xsOnly ? "last" : "first"' v-if='network.images.logos[0].file_path')
						v-img(:src='$store.getters.imgURL(network.images.logos[0].file_path, "logo", 4)' :lazy-src='$store.getters.imgURL(network.images.logos[0].file_path, "logo", 4)')
					v-col.px-6(cols='12' :sm='network.images.logos[0].file_path ? 9 : 12')
						h1.display-1 {{network.name}}
		v-sheet(tile elevation='0')
			v-container.py-0(:class='{ "px-0": $vuetify.breakpoint.xsOnly }')
				v-tabs#tabs(v-model='tab' show-arrows grow center-active icons-and-text background-color="transparent")
					v-tabs-slider
					v-tab(v-for='tab in tabs' :key='tab.to' nuxt replace :to='tab.to' v-if='!tab.disabled')
						span {{tab.title}}
						v-icon {{tab.icon}}
		v-tabs-items(v-model='tab')
			//- Info Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__info')
				//- Info Table
				v-container
					v-simple-table.py-6.info-table
						tbody
							tr(v-if='network.headquarters')
								td.text-right.caption.font-weight-light Headquarters
								td {{network.headquarters}}
							tr(v-if='network.origin_country')
								td.text-right.caption.font-weight-light Country of Origin
								td 
									v-chip {{network.origin_country}}
				//- Images ——————————————————————————————————————————————————————————————————————————— -//
				v-tab-item(value='tab__images' v-if='network.images.logos.length > 0')
					v-container
						v-row(dense justify='center')
							v-col(v-for='image in network.images.logos' :key='image.file_path' cols='6' sm='4' md='3' lg='2' xl='1')
								v-hover(v-slot:default='{ hover }')
									v-card.pa-3(hover :href='`${$store.getters.imgURL(image.file_path,"logo",6)}`' target='_blank')
										v-img(:src='$store.getters.imgURL(image.file_path, "logo", 3)' :lazy-src='$store.getters.imgURL(image.file_path, "logo", 0)' contain aspect-ratio='1')
											template(v-slot:placeholder)
												.d-flex.pa-3.fill-height.justify-center.align-center
													v-progress-circular(indeterminate)
											v-container.fill-height.align-end.justify-center(fluid)
												v-fab-transition
													v-btn(v-show='hover' fab small)
														v-icon mdi-download
</template>

<script>
	export default {
		validate: ({ params }) =>
			/^\d+$/.test(String(params.networkID).split("-")[0]),
		fetch: async ({ store }) => {
			await store.dispatch("FETCH_CONFIGS");
		},
		asyncData: ({ app, params, error }) =>
			app.$api.tmdb
				.get(`network/${String(params.networkID).split("-")[0]}`, {
					params: { append_to_response: "images" }
				})
				.then(res => ({ network: res }))
				.catch(e => error(e)),
		head() {
			return {
				title: this.network.name
			};
		},
		data: _ => ({
			tab: null
		}),
		computed: {
			tabs() {
				return [
					{
						title: "Info",
						to: "#tab__info",
						icon: "mdi-information-variant"
					},
					{
						title: "Images",
						to: "#tab__images",
						icon: "mdi-image-multiple",
						disabled: this.network.images.logos.length < 1
					}
				];
			}
		},
		mounted() {
			this.$store.commit("COLLAPSE_APP_BAR", true);
			if (this.$route.hash == "") this.$router.replace({ hash: "#tab__info" });
		}
	};
</script>

<template lang="pug">
	v-content.pt-0
		v-img(src='/null.png' :gradient='$utils.gradient("to top", [{ alpha: "1", pos: "0%" }, { alpha: ".55", pos: "100%" }])')
			template(v-slot:placeholder)
				v-row.fill-height.ma-0.pa-3(justify='start' align='start')
					v-progress-circular(indeterminate style='opacity: .25')
			.d-flex.flex-column
				v-container.pt-12
					v-row.pt-12.pb-6(align='center' justify='center')
						v-col(cols='12' sm='3' :order='$vuetify.breakpoint.xsOnly ? "last" : "first"' v-if='company.logo_path')
							v-img(:src='$store.getters.imgURL(company.logo_path, "logo", 4)')
						v-col.px-6(cols='12' :sm='company.logo_path ? 9 : 12')
							h1.display-1 {{company.name}}
							p(v-if='company.description' v-html='company.description')
				v-container.py-0(:class='{ "px-0": $vuetify.breakpoint.xsOnly }')
					v-tabs#tabs(v-model='tab' show-arrows grow center-active background-color="transparent")
						v-tab(v-for='tab in tabs' :key='tab.title' v-if='!tab.disabled' :to='tab.to' nuxt replace)
							v-icon(:left='$vuetify.breakpoint.smAndUp') {{tab.icon}}
							span(v-if='$vuetify.breakpoint.smAndUp') {{tab.title}}
		v-tabs-items(v-model='tab')
			//- Info Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--info')
				//- Info Table
				v-container
					v-simple-table.py-6.info-table
						tbody
							tr(v-if='company.headquarters')
								td.text-right.caption.font-weight-light Headquarters
								td {{company.headquarters}}
							tr(v-if='company.origin_country')
								td.text-right.caption.font-weight-light Country of Origin
								td 
									v-chip {{company.origin_country}}
			//- Images ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--images' v-if='company.images.logos.length > 0')
				v-container
					v-row(dense justify='center')
						v-col(v-for='image in company.images.logos' :key='image.file_path' cols='6' sm='4' md='3' lg='2' xl='1')
							v-hover(v-slot:default='{ hover }')
								v-card.pa-3(hover :href='`${$store.getters.imgURL(image.file_path,"logo",6)}`' target='_blank')
									v-img(:src='$store.getters.imgURL(company.logo_path, "logo", 3)' :lazy-src='$store.getters.imgURL(company.logo_path, "logo", 0)' contain aspect-ratio='1')
										template(v-slot:placeholder)
											v-row.fill-height.ma-0.pa-3(justify='center' align='center')
												v-progress-circular(indeterminate)
										v-container.fill-height.align-end.justify-center(fluid)
											v-fab-transition
												v-btn(v-show='hover' fab small)
													v-icon mdi-download
</template>

<script>
	export default {
		validate({ params }) {
			return /^\d+$/.test(params.companyID);
		},
		fetch: async ({ store }) => {
			await store.dispatch("FETCH_CONFIGS");
		},
		asyncData: ({ app, params }) =>
			app.$api
				.tmdb(["company", params.companyID], { append_to_response: "images" })
				.then(response => ({ company: response }))
				.catch(error => console.error(error)),
		head() {
			return {
				title: this.company.name
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
						to: "#tab--info",
						icon: "mdi-information-variant"
					},
					{
						title: "Images",
						to: "#tab--images",
						icon: "mdi-image-multiple",
						disabled: this.company.images.logos.length < 1
					}
				];
			}
		},
		mounted() {
			if (this.$route.hash == "") this.$router.replace({ hash: "#tab--info" });
		}
	};
</script>
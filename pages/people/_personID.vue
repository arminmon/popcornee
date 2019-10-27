<template lang="pug">
	v-content.pt-0
		v-img(:aspect-ratio='10' src='/null.png' :gradient='$utils.gradient("to top", [{ alpha: "1", pos: "50px" }, { alpha: ".55", pos: "100%" }])')
			template(v-slot:placeholder)
				v-row.fill-height.ma-0.pa-3(justify='start' align='start')
					v-progress-circular(indeterminate style='opacity: .25')
			.d-flex.flex-column.fill-height
				v-container.fill-height.pt-12
					v-row.fill-height.pt-12.pb-6(align='center' justify='center')
						v-col(cols='12' sm='3' v-if='person.profile_path')
							v-hover(v-slot:default='{ hover }')
								v-card(elevation='15')
									v-img(:src='$store.getters.imgURL(person.profile_path, "profile", 2)' :lazy-src='$store.getters.imgURL(person.profile_path, "profile", 2)' :aspect-ratio='2/3')
										template(v-slot:placeholder)
											v-row.fill-height.ma-0.pa-3(justify='center' align='center')
												v-progress-circular(indeterminate)
										v-container.fill-height.align-end.justify-center(fluid)
											v-fab-transition
												v-btn(v-show='hover' fab small :href='`${$store.getters.imgURL(person.profile_path,"profile",3)}`' target='_blank')
													v-icon mdi-download
						v-col.px-6(cols='12' :sm='person.profile_path ? 9 : 12')
							h1.display-1 {{person.name}}
							p(v-if='person.biography' v-html='person.biography')
							h2.subtitle-1(v-if='person.birthday')
								span.font-weight-bold {{new Date(person.birthday).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
								span.font-weight-light(v-if='person.place_of_birth')  ({{person.place_of_birth}})
							h2.subtitle-1(v-if='person.deathday')
								span.font-weight-bold {{new Date(person.deathday).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
								span.font-weight-light  (Deceased)
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
							tr(v-if='person.known_for_department')
								td.text-right.caption.font-weight-light Known for Department
								td {{person.known_for_department}}
							tr(v-if='person.birthday')
								td.text-right.caption.font-weight-light Date of Birth
								td {{new Date(person.birthday).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
							tr(v-if='person.place_of_birth')
								td.text-right.caption.font-weight-light Place of Birth
								td {{person.place_of_birth}}
							tr(v-if='person.deathday')
								td.text-right.caption.font-weight-light Date of Birth
								td {{new Date(person.deathday).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
							tr(v-if='person.also_known_as.length > 0')
								td.text-right.caption.font-weight-light Also Known as
								td
									.mx-n1
										v-chip.ma-1(v-for='name in person.also_known_as' :key='name') {{name}}
			//- Movies ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--movies' v-if='!tabs.movies.disabled')
				v-container(fluid)
					v-data-iterator(:items='[person.movie_credits.cast, person.movie_credits.crew]' :options='{ tab: 0, view: "narrow" }' disable-pagination hide-default-footer)
						template(v-slot:header='props')
							v-toolbar(flat)
								v-btn-toggle(v-model='props.options.tab' mandatory)
									v-btn(v-if='props.items[0].length > 0') Cast
									v-btn(v-if='props.items[1].length > 0') Crew
								v-spacer
								v-btn-toggle(v-model='props.options.view' mandatory)
									v-btn(v-for='(view, key) of $utils.media.views' :key='key' :value='key')
										v-icon(:class='view.class') {{view.icon}}
						template(v-slot:default='props')
							v-tabs-items(v-model='props.options.tab')
								v-tab-item(v-if='props.items[0].length > 0')
									v-row(:dense='$vuetify.breakpoint.xsOnly')
										v-col(v-for='item in props.items[0]' :key='item.credit_id' v-bind='$utils.media.views[props.options.view].breakpoints')
											.ps-3.d-block.caption.text-truncate
												span.overline.font-weight-light.text-lowercase {{item.character ? `as ${item.character}` : "N/A"}}
											v-scale-transition
												media-card(:media='item' :view='props.options.view')
								v-tab-item(v-if='props.items[1].length > 0')
									v-row(:dense='$vuetify.breakpoint.xsOnly')
										v-col(v-for='item in props.items[1]' :key='item.credit_id' v-bind='$utils.media.views[props.options.view].breakpoints')
											.ps-3.d-block.caption.text-truncate
												span.overline.font-weight-light.text-lowercase {{item.job ? `as ${item.job}` : "N/A"}}
											v-scale-transition
												media-card(:media='item' :view='props.options.view')
			//- Series ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--series' v-if='!tabs.series.disabled')
				v-container(fluid)
					v-data-iterator(:items='[person.tv_credits.cast, person.tv_credits.crew]' :options='{ tab: 0, view: "narrow" }' disable-pagination hide-default-footer)
						template(v-slot:header='props')
							v-toolbar(flat)
								v-btn-toggle(v-model='props.options.tab' mandatory)
									v-btn(v-if='props.items[0].length > 0') Cast
									v-btn(v-if='props.items[1].length > 0') Crew
								v-spacer
								v-btn-toggle(v-model='props.options.view' mandatory)
									v-btn(v-for='(view, key) of $utils.media.views' :key='key' :value='key')
										v-icon(:class='view.class') {{view.icon}}
						template(v-slot:default='props')
							v-tabs-items(v-model='props.options.tab')
								v-tab-item(v-if='props.items[0].length > 0')
									v-row(:dense='$vuetify.breakpoint.xsOnly')
										v-col(v-for='item in props.items[0]' :key='item.credit_id' v-bind='$utils.media.views[props.options.view].breakpoints')
											.ps-3.d-block.caption.text-truncate
												span.overline.font-weight-light.text-lowercase {{item.character ? `as ${item.character}` : "N/A"}}
											v-scale-transition
												media-card(:media='item' :view='props.options.view')
								v-tab-item(v-if='props.items[1].length > 0')
									v-row(:dense='$vuetify.breakpoint.xsOnly')
										v-col(v-for='item in props.items[1]' :key='item.credit_id' v-bind='$utils.media.views[props.options.view].breakpoints')
											.ps-3.d-block.caption.text-truncate
												span.overline.font-weight-light.text-lowercase {{item.job ? `as ${item.job}` : "N/A"}}
											v-scale-transition
												media-card(:media='item' :view='props.options.view')
			//- Images ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab--images' v-if='!tabs.images.disabled')
				v-container
					v-row(dense justify='center')
						v-col(v-for='image in person.images.profiles' :key='image.file_path' cols='6' sm='4' md='3' lg='2' xl='1')
							v-hover(v-slot:default='{ hover }')
								v-card(hover :href='`${$store.getters.imgURL(image.file_path,"profile",3)}`' target='_blank')
									v-img(:src='$store.getters.imgURL(image.file_path, "profile", 1)' :lazy-src='$store.getters.imgURL(image.file_path, "profile", 0)' :aspect-ratio='2/3')
										template(v-slot:placeholder)
											v-row.fill-height.ma-0.pa-3(justify='center' align='center')
												v-progress-circular(indeterminate)
										v-container.fill-height.align-end.justify-center(fluid)
											v-fab-transition
												v-btn(v-show='hover' fab small)
													v-icon mdi-download
</template>

<script>
	import MediaCard from "~/components/cards/MediaCard";
	export default {
		components: {
			MediaCard
		},
		validate({ params }) {
			return /^\d+$/.test(params.personID);
		},
		fetch: async ({ store }) => {
			await store.dispatch("FETCH_CONFIGS");
			await store.dispatch("FETCH_GENRES");
		},
		asyncData: ({ app, params }) =>
			app.$api
				.tmdb(["person", params.personID], {
					append_to_response: [
						"movie_credits",
						"tv_credits",
						"external_ids",
						"images"
					].join()
				})
				.then(response => ({ person: response }))
				.catch(error => console.error(error)),
		head() {
			return {
				title: this.person.name
			};
		},
		data: _ => ({
			tab: "tab--info"
		}),
		computed: {
			tabs() {
				return {
					info: {
						title: "Info",
						to: "#tab--info",
						icon: "mdi-information-variant"
					},
					movies: {
						title: "Movies",
						to: "#tab--movies",
						icon: "mdi-movie-open",
						disabled:
							this.person.movie_credits.cast.length < 1 &&
							this.person.movie_credits.crew.length < 1
					},
					series: {
						title: "Series",
						to: "#tab--series",
						icon: "mdi-television-classic",
						disabled:
							this.person.tv_credits.cast.length < 1 &&
							this.person.tv_credits.crew.length < 1
					},
					images: {
						title: "Images",
						to: "#tab--images",
						icon: "mdi-image-multiple",
						disabled: this.person.images.profiles.length < 1
					}
				};
			}
		},
		mounted() {
			if (this.$route.hash == "") this.$router.replace({ hash: "#tab--info" });
		}
	};
</script>
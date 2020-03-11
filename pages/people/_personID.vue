<template lang="pug">
	v-content.pt-0
		v-img(
			:aspect-ratio='10'
			src='/null.png'
			:gradient='$utils.gradient("to top", [{ alpha: "1", pos: "15%" }, { alpha: ".7", pos: "100%" }])'
			)
			template(v-slot:placeholder)
				v-row.pa-3.ma-0.fill-height(justify='end' align='start')
					v-progress-circular(indeterminate style='opacity: .25')
			v-container.py-12(:class='{ "pb-0": $vuetify.breakpoint.xsOnly }')
				v-row.py-6(align='center' justify='center')
					v-col(v-if='person.profile_path' cols='12' sm='3' order='last' order-sm='first' :class='{ "px-12": $vuetify.breakpoint.smAndDown }')
						v-hover(v-slot:default='{ hover }')
							v-card(elevation='15')
								v-img(:src='$store.getters.imgURL(person.profile_path, "profile", 2)' :lazy-src='$store.getters.imgURL(person.profile_path, "profile", 2)' :aspect-ratio='2/3')
									template(v-slot:placeholder)
										v-row.pa-3.ma-0.fill-height(justify='center' align='center')
											v-progress-circular(indeterminate)
									v-row.pa-3.ma-0.fill-height(justify='center' align='end')
										v-fab-transition
											v-btn(v-show='hover' fab small :href='`${$store.getters.imgURL(person.profile_path,"profile",3)}`' target='_blank')
												v-icon mdi-download
					v-col(align-self='center')
						h1.display-1.font-weight-bold {{person.name}}
						h2.subtitle-1.my-2(v-if='person.birthday')
							span.font-weight-bold {{new Date(person.birthday).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
							span.font-weight-light(v-if='person.place_of_birth')  ({{person.place_of_birth}})
						h2.subtitle-1.my-2(v-if='person.deathday')
							span.font-weight-bold {{new Date(person.deathday).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
							span.font-weight-light  (Deceased)
						p(v-if='person.biography' v-html='person.biography')
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
			v-tab-item(value='tab__movies' v-if='!tabs.movies.disabled')
				v-container(fluid)
					v-data-iterator(:items='[person.movie_credits.cast, person.movie_credits.crew]' :options='{ tab: 0, view: "narrow" }' disable-pagination hide-default-footer)
						template(v-slot:header='props')
								v-btn-toggle(v-model='props.options.tab' mandatory)
							v-toolbar(flat color='transparent')
									v-btn(v-if='props.items[0].length > 0') Cast
									v-btn(v-if='props.items[1].length > 0') Crew
								v-spacer
								v-btn-toggle(v-model='props.options.view' mandatory)
									v-btn(v-for='(view, key) of $utils.media.views' :key='key' :value='key')
										v-icon(:class='view.class') {{view.icon}}
						template(v-slot:default='props')
							v-tabs-items(v-model='props.options.tab')
								v-tab-item(v-if='props.items[0].length > 0')
									v-row(dense :no-gutters='$vuetify.breakpoint.smAndDown' justify='center')
										v-col(v-for='item in props.items[0]' :key='item.credit_id' v-bind='$utils.media.views[props.options.view].breakpoints')
											media-card(:media='item' :view='props.options.view')
												template(v-slot:details)
													p.ma-0.overline.text-none(v-if='item.character') 
														span.font-weight-thin as 
														| {{item.character}}
								v-tab-item(v-if='props.items[1].length > 0')
									v-row(dense :no-gutters='$vuetify.breakpoint.smAndDown' justify='center')
										v-col(v-for='item in props.items[1]' :key='item.credit_id' v-bind='$utils.media.views[props.options.view].breakpoints')
											media-card(:media='item' :view='props.options.view')
												template(v-slot:details)
													p.ma-0.overline.text-none(v-if='item.job') 
														span.font-weight-thin as 
														| {{item.job}}
			//- Series ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__series' v-if='!tabs.series.disabled')
				v-container(fluid)
					v-data-iterator(:items='[person.tv_credits.cast, person.tv_credits.crew]' :options='{ tab: 0, view: "narrow" }' disable-pagination hide-default-footer)
						template(v-slot:header='props')
								v-btn-toggle(v-model='props.options.tab' mandatory)
							v-toolbar(flat color='transparent')
									v-btn(v-if='props.items[0].length > 0') Cast
									v-btn(v-if='props.items[1].length > 0') Crew
								v-spacer
								v-btn-toggle(v-model='props.options.view' mandatory)
									v-btn(v-for='(view, key) of $utils.media.views' :key='key' :value='key')
										v-icon(:class='view.class') {{view.icon}}
						template(v-slot:default='props')
							v-tabs-items(v-model='props.options.tab')
								v-tab-item(v-if='props.items[0].length > 0')
									v-row(dense :no-gutters='$vuetify.breakpoint.smAndDown' justify='center')
										v-col(v-for='item in props.items[0]' :key='item.credit_id' v-bind='$utils.media.views[props.options.view].breakpoints')
											media-card(:media='item' :view='props.options.view')
												template(v-slot:details)
													p.ma-0.overline.text-none(v-if='item.character') 
														span.font-weight-thin as 
														| {{item.character}}
								v-tab-item(v-if='props.items[1].length > 0')
									v-row(dense :no-gutters='$vuetify.breakpoint.smAndDown' justify='center')
										v-col(v-for='item in props.items[1]' :key='item.credit_id' v-bind='$utils.media.views[props.options.view].breakpoints')
											media-card(:media='item' :view='props.options.view')
												template(v-slot:details)
													p.ma-0.overline.text-none(v-if='item.job') 
														span.font-weight-thin as 
														| {{item.job}}
			//- Images ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__images' v-if='!tabs.images.disabled')
				v-container
					v-row(dense justify='center')
						v-col(v-for='image in person.images.profiles' :key='image.file_path' cols='6' sm='4' md='3' lg='2' xl='1')
							v-hover(v-slot:default='{ hover }')
								v-card(hover :href='`${$store.getters.imgURL(image.file_path,"profile",3)}`' target='_blank')
									v-img(:src='$store.getters.imgURL(image.file_path, "profile", 1)' :lazy-src='$store.getters.imgURL(image.file_path, "profile", 0)' :aspect-ratio='2/3')
										template(v-slot:placeholder)
											v-row.pa-3.ma-0.fill-height(justify='center' align='center')
												v-progress-circular(indeterminate)
										v-row.pa-3.ma-0.fill-height(justify='center' align='center')
											v-fab-transition
												v-btn(v-show='hover' fab small)
													v-icon mdi-download
</template>

<script>
	import MediaCard from "~/components/shared/cards/MediaCard";
	export default {
		components: {
			MediaCard
		},
		validate({ params }) {
			return /^\d+$/.test(String(params.personID).split("-")[0]);
		},
		fetch: async ({ store }) => {
			await store.dispatch("FETCH_CONFIGS");
			await store.dispatch("FETCH_GENRES");
		},
		asyncData: ({ app, params, error }) =>
			app.$api.tmdb
				.get(`person/${String(params.personID).split("-")[0]}`, {
					params: {
						append_to_response: [
							"movie_credits",
							"tv_credits",
							"external_ids",
							"images"
						].join()
					}
				})
				.then(res => ({ person: res }))
				.catch(e => error(e)),
		head() {
			return {
				title: this.person.name
			};
		},
		data: _ => ({
			tab: null
		}),
		computed: {
			tabs() {
				return {
					info: {
						title: "Info",
						to: "#tab__info",
						icon: "mdi-information-variant"
					},
					movies: {
						title: "Movies",
						to: "#tab__movies",
						icon: "mdi-movie-open",
						disabled:
							this.person.movie_credits.cast.length < 1 &&
							this.person.movie_credits.crew.length < 1
					},
					series: {
						title: "Series",
						to: "#tab__series",
						icon: "mdi-television-classic",
						disabled:
							this.person.tv_credits.cast.length < 1 &&
							this.person.tv_credits.crew.length < 1
					},
					images: {
						title: "Images",
						to: "#tab__images",
						icon: "mdi-image-multiple",
						disabled: this.person.images.profiles.length < 1
					}
				};
			}
		},
		mounted() {
			this.$store.commit("COLLAPSE_APP_BAR", true);
			if (this.$route.hash == "") this.$router.replace({ hash: "#tab__info" });
		}
	};
</script>

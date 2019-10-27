<template lang="pug">
	v-hover(v-slot:default='{ hover }')
		v-card(
			:elevation='selected ? 0 : hover ? 15 : 5'
			:color='$vuetify.theme.dark ? "grey darken-4" : "grey lighten-3"'
			:disabled='disabled || selected'
			:flat='selected'
			:loading='loading'
			nuxt
			:to='`/${media.first_air_date ? "series" : "movies"}/${media.id}`'
			)
			v-img(
				eager
				:aspect-ratio='aspectRatio'
				:src='$store.getters.imgURL(backDrop.path, backDrop.type, backDrop.size)'
				:lazy-src='$store.getters.imgURL(backDrop.path, backDrop.type, 0)'
				:gradient='$utils.gradient(gradient.dir, gradient.points)'
				)
				template(v-slot:placeholder)
					v-row.fill-height.ma-0.pa-3(justify='start' align='start')
						v-progress-circular(indeterminate style='opacity: .25')
				v-container(fluid fill-height)
					v-row.fill-height
						v-col(:align-self='$vuetify.breakpoint.xsOnly && view == "wide" ? "center" : "end"' :class='{"py-0": $vuetify.breakpoint.smAndDown}')
							h1.ms-1.title.font-weight-bold(:class='[$vuetify.breakpoint.xsOnly ? "subtitle-1" : "title"]') {{media.title || media.original_title || media.name || media.original_name}}
							h2.subtitle-2.font-weight-thin(:class='[$vuetify.breakpoint.xsOnly ? "caption" : "subtitle-2"]')
								span (
								span(v-if='media.first_air_date') Since 
								span.font-weight-regular {{media.release_date || media.first_air_date ? new Date(media.release_date || media.first_air_date).toLocaleDateString("en-US", {year: "numeric", month: "short"}) : "n/a"}}
								span )
							v-expand-transition(v-if='media.vote_average > 0')
								v-rating(v-show='hover || view == "wide"' :value='media.vote_average/2' length='5' half-increments readonly dense small open-delay='300')
							v-expand-transition(v-if='media.genre_ids.length > 0')
								.mx-n1(v-show='view == "wide" || hover || ($vuetify.breakpoint.mdAndUp && view != "narrow")')
									v-chip.ma-1(v-for='(id, index) in media.genre_ids' :key='index' :small='$vuetify.breakpoint.smAndUp' :x-small='$vuetify.breakpoint.xsOnly' outlined) {{$store.getters.genreName(id)}}
						v-col.py-0(v-show='view == "wide" && media.poster_path' cols='4' sm='5' justify-self='end' align-self='center')
							v-card(:elevation='hover || selected ? 1 : 10')
								v-img(:aspect-ratio='2/3' :src='$store.getters.imgURL(media.poster_path, "poster", 3)' :lazy-src='$store.getters.imgURL(media.poster_path, "poster", 0)')
									template(v-slot:placeholder)
										v-row.fill-height.ma-0.pa-3(justify='center' align='center')
											v-progress-circular(indeterminate)
</template>

<script>
	export default {
		props: {
			media: Object,
			view: { type: String, default: "narrow" },
			selected: { type: Boolean, default: false },
			disabled: { type: Boolean, default: false },
			loading: { type: Boolean, default: false }
		},
		data: _ => ({
			aspectRatio: 2 / 3,
			backDrop: { path: null, type: "poster", size: 0 },
			gradient: {
				dir: "",
				points: []
			}
		}),
		computed: {
			breakpoint: ({ $vuetify }) => $vuetify.breakpoint.name
		},
		watch: {
			breakpoint: {
				handler(val) {
					this.updateUI();
				},
				immediate: true
			},
			view: {
				handler(val) {
					this.updateUI();
				},
				immediate: true
			}
		},
		methods: {
			updateUI() {
				this.backDrop = { path: null, type: "poster", size: 0 };
				let gradient = {
					dir: "",
					points: []
				};
				switch (this.view) {
					case "square":
						this.aspectRatio = 1;
						if (this.media.backdrop_path)
							this.backDrop = {
								path: this.media.backdrop_path,
								type: "backdrop",
								size: 1
							};
						this.gradient = {
							dir: "to top right",
							points: [{ alpha: ".98", pos: "0%" }, { alpha: "0", pos: "75%" }]
						};
						break;
					case "narrow":
						this.aspectRatio = 2 / 3;
						if (this.media.poster_path)
							this.backDrop = {
								path: this.media.poster_path,
								type: "poster",
								size: 3
							};
						this.gradient = {
							dir: "30deg",
							points: [{ alpha: ".95", pos: "0%" }, { alpha: "0", pos: "75%" }]
						};
						break;
					case "wide":
						this.aspectRatio = 1.618;
						if (this.media.backdrop_path)
							this.backDrop = {
								path: this.media.backdrop_path,
								type: "backdrop",
								size: 1
							};
						this.gradient = {
							dir: this.$vuetify.breakpoint.xsOnly ? "to right" : "to top right",
							points: [
								{
									alpha: ".9",
									pos: this.$vuetify.breakpoint.xsOnly ? "0%" : "20%"
								},
								{ alpha: "0", pos: "100%" }
							]
						};
						break;
				}
			}
		}
	};
</script>
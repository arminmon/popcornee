<template lang="pug">
	v-hover(v-slot:default='{ hover }' :disabled='$vuetify.breakpoint.smAndDown')
		v-card.media-card(
			flat
			nuxt
			:to='`/${media.first_air_date ? "series" : "movies"}/${media.id}-${$utils.slugify(String(media.title || media.original_title || media.name || media.original_name))}#tab__info`'
			:active-class='$vuetify.theme.dark ? "grey darken-4" : "grey lighten-3"'
			:disabled='disabled'
			:color='hover || selected ? $vuetify.theme.dark ? "grey darken-4" : "grey lighten-3" : "transparent"')
			v-container(fluid :class='{ "pa-3": $vuetify.breakpoint.mdAndUp && !dense, "pa-1": dense || $vuetify.breakpoint.smAndDown }')
				v-row(no-gutters align-content='center')
					v-col(:cols='view == "narrow" ? 12 : 6')
						v-card(elevation='12')
							v-img(v-if='media.poster_path' :aspect-ratio='2/3' width='100%' :src='$store.getters.imgURL(media.poster_path, "poster", 3)' :lazy-src='$store.getters.imgURL(media.poster_path, "poster", 0)')
								template(v-slot:placeholder)
									.d-flex.pa-3.fill-height.justify-start.align-start
										v-progress-circular(indeterminate)
								v-overlay(:value='hover && view == "narrow"' absolute opacity='0.92' :color='$vuetify.theme.dark ? "grey darken-4" : "grey lighten-3"' :light='$vuetify.theme.light' :dark='$vuetify.theme.dark')
									v-container(fluid)
										v-row(dense justify='center')
											v-col.flex-grow-0.flex-shrink-0(justify-self='space-around' v-for='(id, index) in media.genre_ids' :key='index')
												v-chip(:x-small='$store.state.drawer' :small='!$store.state.drawer' outlined) {{$store.getters.genreName(id)}}
										v-row(dense justify='center')
											v-col.flex-grow-0.flex-shrink-0(justify-self='center')
												v-rating(:value='media.vote_average/2' length='5' half-increments readonly dense small color='orange' :background-color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-5"')
							v-responsive(v-else :aspect-ratio='2/3')
								.d-flex.pa-3.fill-height.justify-start.align-start
									v-icon(disabled large) mdi-image-off
					v-col.px-1(:cols='view == "narrow" ? 12 : 6' :class='{ "pt-3": view == "narrow", "ps-3": view == "wide", "py-5": view == "wide" }')
						v-list-item.pa-0
							v-list-item-content.pa-0
								v-list-item-title.font-weight-bold(:class='{ "text-wrap": view == "wide" }') {{media.title || media.original_title || media.name || media.original_name}}
								v-list-item-subtitle.overline
									span.font-weight-light(v-if='media.first_air_date') Since 
									span.font-weight-regular {{media.release_date || media.first_air_date ? new Date(media.release_date || media.first_air_date).toLocaleDateString("en-US", {year: "numeric", month: "short"}) : "n/a"}}
								v-rating(v-show='view == "wide"' v-if='media.vote_average' :value='media.vote_average/2' length='5' half-increments readonly dense x-small color='orange' :background-color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-5"')
								p.media-card--overview.caption.pa-1(v-show='view == "wide"') {{media.overview}}
								.mx-n1(v-show='view == "wide"' v-if='media.genre_ids.length > 0')
									v-chip.ma-1(v-for='(id, index) in media.genre_ids' :key='index' :small='$vuetify.breakpoint.mdAndUp && !$store.state.drawer' :x-small='$vuetify.breakpoint.smAndDown || $store.state.drawer' outlined) {{$store.getters.genreName(id)}}
						slot(name='details')
</template>

<script>
	export default {
		props: {
			media: Object,
			view: { type: String, default: "narrow" },
			dense: { type: Boolean, default: false },
			selected: { type: Boolean, default: false },
			disabled: { type: Boolean, default: false }
		}
	};
</script>

<style lang="scss">
	.media-card {
		p.media-card--overview {
			display: -webkit-box;
			overflow-wrap: break-word;
			text-overflow: ellipsis;
			overflow: hidden;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
		}
	}
</style>
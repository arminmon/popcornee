<template lang="pug">
	v-timeline(dense align-top)
		v-timeline-item(right hide-dot)
			v-toolbar(flat dense v-if='episodes.length > 0 || guestStarsAvailable || stillImageAvailable')
				.overline {{episodes.length}} {{episodes.length > 1 ? "Episodes" : "Episode"}}
				v-spacer
				v-btn-toggle(v-model='toggles' borderless multiple)
					v-btn(value='guestStars' v-if='guestStarsAvailable')
						v-icon mdi-account-star
					v-btn(value='stillImage' v-if='stillImageAvailable')
						v-icon mdi-image
					v-divider(vertical v-if='episodes.length > 0')
					v-btn(value='sortDesc' v-if='episodes.length > 0')
						v-icon mdi-sort-descending
		v-data-iterator(:items='episodes' :sort-desc='toggles.includes("sortDesc")' sort-by='episode_number' disable-pagination hide-default-footer)
			template(v-slot:no-data)
				v-timeline-item(right hide-dot)
					p No episode available.
			template(v-slot:default='{ items }')
				v-timeline-item.mb-8(v-for='episode in items' :key='episode.id' right fill-dot)
					template(v-slot:icon)
						v-avatar.font-weight-bold(:class='{ "black--text": $vuetify.theme.dark, "white--text": !$vuetify.theme.dark }') {{episode.episode_number}}
					.headline.font-weight-bold {{episode.name}}
					.overline {{new Date(episode.air_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
					p.body-2.mt-3(v-if='episode.overview') {{episode.overview}}
					v-expand-transition
						v-container.pt-0(v-show='toggles.includes("guestStars")' :class='{ "px-0": $vuetify.breakpoint.smAndDown }')
							v-subheader {{episode.guest_stars.length > 0 ? "Guest Stars" : "No Guest Stars"}}
							v-row(no-gutters v-if='episode.guest_stars.length > 0')
								v-col(v-for='person in episode.guest_stars' :key='person.id' cols='4' sm='3' md='2' xl='1')
									v-tooltip(top)
										template(v-slot:activator='{ on, value }')
											v-card.pa-2(flat v-on='on' nuxt :to='`/people/${person.id}-${$utils.slugify(String(person.name))}#tab__info`' :color='value ? $vuetify.theme.dark ? "grey darken-4" : "grey lighten-3" : "transparent"')
												.d-flex
													v-avatar.elevation-3(width='100%' height='auto')
														v-img(v-if='person.profile_path' :src='$store.getters.imgURL(person.profile_path, "profile", 1)' aspect-ratio='1' :lazy-src='$store.getters.imgURL(person.profile_path, "profile", 0)')
														v-responsive.align-center(v-else aspect-ratio='1')
															.headline.mx-auto {{person.name.split(" ")[0][0]}}{{person.name.split(" ")[1][0]}}
												v-list-item.px-0.text-center(dense v-if='person.character')
													v-list-item-content.pb-0
														v-list-item-subtitle.font-weight-light as
														v-list-item-subtitle {{person.character}}
										span {{person.name}}
					v-expand-transition
						v-card(v-show='toggles.includes("stillImage")')
							v-img(:src='$store.getters.imgURL(episode.still_path, "still", 3)' :lazy-src='$store.getters.imgURL(episode.still_path, "still", 0)' :aspect-ratio='episode.still_path ? 300/169 : 10')
								template(v-slot:placeholder)
									.d-flex.pa-3.fill-height.justify-start.align-start
										v-progress-circular(indeterminate)
								.d-flex.fill-height.align-center.justify-center.pa-3(v-if='episode.still_path == null')
									v-icon.d-flex(style='opacity: .25') mdi-image-off
</template>

<script>
export default {
	props: {
		episodes: {
			type: Array,
			default: []
		},
		seasonNum: null
	},
	data: _ => ({
		toggles: [],
		dialog: false
	}),
	computed: {
		guestStarsAvailable() {
			return this.episodes.some(episode => episode.guest_stars.length > 0);
		},
		stillImageAvailable() {
			return this.episodes.some(episode => episode.still_path != null);
		}
	}
};
</script>

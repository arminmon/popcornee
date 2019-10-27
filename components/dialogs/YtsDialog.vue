<template lang="pug">
	v-dialog(v-model='dialog' eager scrollable origin='top center' :width='$vuetify.breakpoint.mdAndUp ? "50%" : "100%"')
		template(v-slot:activator='{ on }')
			v-btn(text v-on='on')
				span {{$vuetify.breakpoint.mdAndUp ? "YIFY Torrents" : "YTS"}}
		v-card
			v-card-text(:class='{"px-2": $vuetify.breakpoint.smAndDown}')
				v-list(dense two-line)
					template(v-for='(torrent, index) in torrents')
						v-divider(v-if='index != 0')
						v-list-item(:key='torrent.id')
							v-list-item-content
								v-list-item-title.text-capitalize {{torrent.quality}} {{torrent.type}}
								v-list-item-subtitle.overline
									span.font-italic.me-3 {{torrent.size}}
									span {{torrent.seeds}} Seeds | {{torrent.peers}} Peers
							v-list-item-action
								v-btn(icon :href='torrent.url' download)
									v-icon mdi-download
			v-card-actions
				v-spacer
				v-btn(text @click='dialog = false') Close
</template>

<script>
	export default {
		props: {
			torrents: Array
		},
		data: _ => ({
			dialog: false
		})
	};
</script>
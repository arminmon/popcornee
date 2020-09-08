<template lang="pug">
	v-dialog(v-model='dialog' scrollable max-width='375')
		template(v-slot:activator='{ on: dialog }')
			v-tooltip(:right='!$vuetify.rtl' :left='$vuetify.rtl')
				template(v-slot:activator='{ on: tooltip }')
					v-btn.ms-1(v-on='{ ...tooltip, ...dialog }' icon)
						v-icon mdi-theater
				span View All Releases
		v-card
			v-card-title
				v-select(v-model='window' style='width:300px' :items='releases'  item-text='iso_3166_1' item-value='iso_3166_1' hide-details flat single-line solo)
			v-card-text
				v-window(:value='window')
					v-window-item(v-for='country in releases' :value='country.iso_3166_1' :key='country.iso_3166_1')
						v-list(two-line)
							v-list-item(v-for='(release, index) in country.release_dates' :key='index' :three-line='release.notes')
								v-list-item-content
									v-list-item-title {{release.type | ReleaseType}}
									v-list-item-subtitle {{new Date(release.release_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
									v-list-item-subtitle(v-if='release.notes') {{release.note}}
								v-list-item-action(v-if='release.certification')
									v-chip(label small color='info') {{release.certification}}
</template>

<script>
export default {
	filters: {
		ReleaseType: (index) => {
			switch (index) {
				case 1:
					return 'Premiere'
				case 2:
					return 'Theatrical (limited)'
				case 3:
					return 'Theatrical'
				case 4:
					return 'Digital'
				case 5:
					return 'Physical'
				case 6:
					return 'TV'
				default:
					return 'Unknown Release'
			}
		}
	},
	props: {
		releases: {
			type: Array,
			default: () => []
		}
	},
	data: (_) => ({
		dialog: false,
		window: 'US'
	}),
	mounted() {
		if (this.releases.length > 0) this.window = this.releases[0].iso_3166_1
		for (const release of this.releases)
			if (release.iso_3166_1 === 'US') {
				this.window = 'US'
				break
			}
	}
}
</script>

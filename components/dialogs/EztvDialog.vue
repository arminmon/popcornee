<template lang="pug">
	v-dialog(v-model='dialog' eager scrollable origin='top center' :width='$vuetify.breakpoint.mdAndUp ? "50%" : "100%"' v-if='count > 0')
		template(v-slot:activator='{ on }')
			v-btn(text v-on='on')
				span {{$vuetify.breakpoint.mdAndUp ? "EZTV Torrents" : "EZTV"}}
		v-card(:loading='loading')
			v-card-text(:class='{"px-2": $vuetify.breakpoint.smAndDown}')
				v-list(dense two-line)
					template(v-for='(torrent, index) in torrents')
						v-divider(v-if='index != 0')
						v-list-item(:key='torrent.id')
							v-list-item-action.me-3
								v-chip(label)
									span.font-weight-light S
									span.font-weight-bold.me-1 {{torrent.season.padStart(2, "0")}}
									span.font-weight-light E
									span.font-weight-bold {{torrent.episode.padStart(2, "0")}}
							v-list-item-content
								v-list-item-title {{torrent.title}}
								v-list-item-subtitle.overline
									span.font-italic.me-3 {{torrent.size_bytes | humanReadableBytes}}
									span.text-uppercase.me-3 {{torrent.filename | fileType}}
									span {{torrent.seeds}} Seeds | {{torrent.peers}} Peers
							v-list-item-action
								v-menu(open-on-hover offset-x nudge-left left)
									template(v-slot:activator="{ on }")
										v-btn(icon :href='torrent.torrent_url' v-on='on')
											v-icon mdi-download
									v-list(dense)
										v-list-item(:href='torrent.torrent_url' download)
											v-list-item-content
												v-list-item-title Torrent
										v-list-item(:href='torrent.magnet_url')
											v-list-item-content
												v-list-item-title Magnet
											
				v-pagination(v-model='page' :length='pagesCount' v-if='count > 0 && pagesCount > 1')
			v-card-actions
				v-spacer
				v-btn(text @click='dialog = false') Close
</template>

<script>
	export default {
		props: {
			imdbID: String
		},
		data: _ => ({
			dialog: false,
			loading: true,
			page: 1,
			limit: 30,
			count: 0,
			torrents: []
		}),
		computed: {
			pagesCount() {
				return this.count > 0 ? Math.ceil(this.count / this.limit) : 1;
			}
		},
		watch: {
			page(val) {
				if (this.count > 0 && this.page <= this.pagesCount) this.fetchTorrents();
			}
		},
		methods: {
			async fetchTorrents() {
				try {
					this.loading = true;
					let response = await this.$api.eztv({
						imdb_id: this.imdbID.substring(2),
						page: this.page,
						limit: this.limit
					});
					this.loading = "success";
					this.count = response.torrents_count;
					this.torrents = response.torrents;
				} catch (error) {
					this.loading = "error";
				} finally {
					setTimeout(_ => (this.loading = false), 1000);
				}
			}
		},
		filters: {
			humanReadableBytes(size) {
				if (size < 1024) return size + " B";
				let i = Math.floor(Math.log(size) / Math.log(1024));
				let num = size / Math.pow(1024, i);
				let round = Math.round(num);
				num = round < 10 ? num.toFixed(2) : round < 100 ? num.toFixed(1) : round;
				return `${num} ${"KMGTPEZY"[i - 1]}B`;
			},
			fileType: filename => filename.split(".").pop()
		},
		mounted() {
			this.fetchTorrents();
		}
	};
</script>
<template lang="pug">
	v-data-iterator(:items='[...items, ...results]' :loading='loading' disable-pagination hide-default-footer)
		template(v-slot:header='props' v-if='!hideHeader')
			v-card(flat :color='flatHeader ? "transparent" : null')
				v-toolbar(:flat='flatHeader' :color='flatHeader ? "transparent" : null' :class='{ "mb-2": $store.state.drawer || $vuetify.breakpoint.smAndDown || dense }')
					v-toolbar-title(v-if='title != ""') {{title}}
					slot(name='header-prepend')
					v-spacer
					v-btn-toggle(v-model='view' mandatory v-if='!hideViews' v-show='$vuetify.breakpoint.mdAndUp')
						v-btn(v-for='(view, key) of $utils.media.views' :key='key' :value='key')
							v-icon(:class='view.class') {{view.icon}}
					v-btn(fab small @click='changeView' v-if='!hideViews' v-show='$vuetify.breakpoint.smAndDown')
						v-icon(:class='$utils.media.views[view].class') {{$utils.media.views[view].icon}}
					slot(name='header-append')
		template(v-slot:default='props')
			v-row(:dense='$store.state.drawer || $vuetify.breakpoint.smAndDown || dense')
				v-col(v-for='item in props.items' :key='item.id' v-bind='$utils.media.views[view].breakpoints')
					v-scale-transition
						media-card(:media='item' :view='view')
				v-col.d-flex.justify-center.align-center.py-3(v-if='resource')
					v-btn(@click='fetchMore' :loading='fetching' :disabled='page >= totalPages' large :block='$vuetify.breakpoint.smAndDown')
						span.overline(v-if='page >= totalPages && !fetching') That's all.
						span(v-else) Fetch More
</template>

<script>
	import MediaCard from "~/components/cards/MediaCard";
	export default {
		components: {
			MediaCard
		},
		props: {
			media: {
				type: null
			},
			defaultView: {
				type: String,
				default: "wide"
			},
			dense: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: ""
			},
			flatHeader: {
				type: Boolean,
				default: false
			},
			hideHeader: {
				type: Boolean,
				default: false
			},
			hideViews: {
				type: Boolean,
				default: false
			},
			resource: null,
			query: null,
			loading: {
				type: Boolean,
				default: false
			}
		},
		data: _ => ({
			fetching: false,
			view: "wide",
			results: [],
			page: 1,
			totalPages: 1
		}),
		methods: {
			async fetchMore() {
				try {
					this.fetching = true;
					this.page++;
					let response = await this.$api.tmdb(this.resource, {
						...this.query,
						page: this.page
					});
					this.results = [...this.results, ...response.results];
				} catch (error) {
					this.page--;
					console.error(error);
				} finally {
					this.fetching = false;
				}
			},
			changeView() {
				switch (this.view) {
					case "wide":
						this.view = "square";
						break;
					case "square":
						this.view = "narrow";
						break;
					case "narrow":
						this.view = "wide";
						break;
				}
			},
			reset() {
				this.view = this.defaultView;
				this.page = this.media.results ? this.media.page : 1;
				this.totalPages = this.media.results ? this.media.total_pages : 1;
				this.results = [];
			}
		},
		computed: {
			items() {
				return this.media.results ? this.media.results : this.media;
			}
		},
		mounted() {
			this.reset();
		}
	};
</script>
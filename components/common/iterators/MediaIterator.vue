<template lang="pug">
	v-data-iterator(:items='[...items, ...results]' disable-pagination hide-default-footer)
		template(v-slot:header='props' v-if='!hideHeader')
			v-toolbar.mb-2(flat color='transparent')
				v-toolbar-title(v-if='title != ""') {{title}}
				slot(name='header-prepend')
				v-spacer
				v-btn-toggle(v-model='view' borderless mandatory :dense='$vuetify.breakpoint.smAndDown' v-if='!hideViews')
					v-btn(v-for='(view, key) of $utils.media.views' :key='key' :value='key')
						v-icon(:class='view.class') {{view.icon}}
				slot(name='header-append')
		template(v-slot:default='{ items }')
			v-row(dense :no-gutters='$vuetify.breakpoint.smAndDown' :justify='justify' :align='align')
				v-col(v-for='item in items' :key='item.id' v-bind='$utils.media.views[view].breakpoints')
					media-card(:media='item' :view='view' :dense='dense')
				v-col.py-3.text-center(cols='12' v-if='resource')
					v-btn(@click='fetchMore' :loading='fetching' :disabled='page >= totalPages' rounded large :block='$vuetify.breakpoint.smAndDown')
						span.overline(v-if='page >= totalPages && !fetching') That's all.
						span(v-else) Fetch More
					v-divider.my-3(v-if='page >= totalPages && !fetching')
</template>

<script>
import MediaCard from '~/components/common/cards/MediaCard'
export default {
  components: {
    MediaCard,
  },
  props: {
    media: {
      type: Object,
      default: undefined,
    },
    defaultView: {
      type: String,
      default: 'narrow',
    },
    dense: {
      type: Boolean,
      default: false,
    },
    justify: {
      type: String,
      default: 'center',
    },
    align: {
      type: String,
      default: 'center',
    },
    title: {
      type: String,
      default: '',
    },
    hideHeader: {
      type: Boolean,
      default: false,
    },
    hideViews: {
      type: Boolean,
      default: false,
    },
    resource: { type: String, default: null },
    query: { type: Object, default: null },
  },
  data: (_) => ({
    fetching: false,
    view: 'narrow',
    results: [],
    page: 1,
    totalPages: 1,
  }),
  computed: {
    items() {
      return this.media.results ? this.media.results : this.media
    },
  },
  mounted() {
    this.reset()
  },
  methods: {
    async fetchMore() {
      try {
        this.fetching = true
        this.page++
        const response = await this.$axios.$get(this.resource, {
          params: {
            ...this.query,
            page: this.page,
          },
        })
        this.results = [...this.results, ...response.results]
      } catch (e) {
        this.page--
      } finally {
        this.fetching = false
      }
    },
    reset() {
      this.view = this.defaultView
      this.page = this.media.results ? this.media.page : 1
      this.totalPages = this.media.results ? this.media.total_pages : 1
      this.results = []
    },
  },
}
</script>

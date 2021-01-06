<template lang="pug">
  v-container(fluid)
    v-data-iterator(:items='[person.tv_credits.cast, person.tv_credits.crew]' :options='{ tab: 0, view: "narrow" }' disable-pagination hide-default-footer)
      template(v-slot:header='props')
        v-toolbar(flat color='transparent')
          v-btn-toggle(v-model='props.options.tab' borderless mandatory)
            v-btn(v-if='props.items[0].length > 0') Cast
            v-btn(v-if='props.items[1].length > 0') Crew
          v-spacer
          v-btn-toggle(v-model='props.options.view' borderless mandatory)
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
</template>

<script>
export default {
  scrollTo: '#tabs',
  props: {
    person: {
      type: Object,
      required: true,
    },
  },
}
</script>

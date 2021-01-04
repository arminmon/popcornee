<template lang="pug">
  v-app-bar(
    app
    fixed
    :elevate-on-scroll='!appBarCollapsed'
    :collapse='appBarCollapsed'
    :clipped-left='!$vuetify.rtl'
    :clipped-right='$vuetify.rtl'
    :right='$vuetify.rtl'
    :left='!$vuetify.rtl'
    )
    v-app-bar-nav-icon(@click='toggleDrawer')
    v-toolbar-title.font-weight-bold {{title}}
    v-progress-linear(absolute bottom height='3' :active='progress.active' :value='progress.value' :color='progress.color' :indeterminate='progress.active && progress.value == 0 && progress.color != "error"')
    v-spacer
    v-btn(icon @click='switchTheme')
      v-icon {{$vuetify.theme.dark ? "mdi-brightness-5" : "mdi-brightness-3"}}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    title: {
      type: String,
      default: 'POPCORNEE',
    },
  },
  computed: {
    ...mapGetters(['progress', 'appBarCollapsed']),
  },
  methods: {
    toggleDrawer() {
      this.$emit('toggleDrawer')
    },
    switchTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
  },
}
</script>

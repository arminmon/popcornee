<template lang="pug">
  v-container
    v-row
      v-col(cols='12' md='auto')
        v-card
          v-navigation-drawer(permanent floating :width='$vuetify.breakpoint.mdAndUp ? 275 : "100%"' :color='$vuetify.theme.dark ? "grey darken-4" : "grey lighten-3"')
            v-btn(large block depressed tile @click='showList = !showList' v-show='$vuetify.breakpoint.smAndDown')
              span Select a Season
              v-icon(right) {{ showList ? "mdi-chevron-up" : "mdi-chevron-down"}}
            v-expand-transition
              v-list(rounded v-show='showList || $vuetify.breakpoint.mdAndUp')
                v-data-iterator(:items='series.seasons' :sort-desc='toggles.includes("sortDesc")' sort-by='season_number' disable-pagination hide-default-footer)
                  template(v-slot:header='props')
                    v-subheader(v-if='props.items.length > 1')
                      span {{series.seasons[0].name == 'Specials' ? `${props.items.length - 1} ${props.items.length > 1 ? "Seasons" : "Season"} + Specials` : `${props.items.length} ${props.items.length > 1 ? "Seasons" : "Season"}`}}
                      v-spacer
                      v-btn-toggle(v-model='toggles' borderless dense multiple)
                        v-btn(value='sortDesc')
                          v-icon mdi-sort-descending
                    v-divider.my-2(v-if='props.items.length > 1')
                  template(v-slot:default='props')
                    v-list
                      v-list-item(v-for='season in props.items' :key='season.id' nuxt :to='`/series/${series.id}/seasons/${season.season_number}/episodes`' :class='{ "order-last": season.season_number == 0 }' active-class='font-weight-bold')
                        v-list-item-avatar.font-weight-thin(horizontal v-if='season.season_number != 0') {{season.season_number.toString().padStart(2, "0")}}
                        v-list-item-content
                          v-list-item-title {{season.name}}
      v-col#seasons
        nuxt-child(:key='$route.path' :seasons='series.seasons')
</template>

<script>
export default {
  scrollTo: '#tabs',
  props: {
    series: {
      type: Object,
      required: true,
    },
  },
  data: (_) => ({
    toggles: [],
    showList: true,
  }),
}
</script>

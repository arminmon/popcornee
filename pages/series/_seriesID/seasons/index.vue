<template lang="pug">
  v-data-iterator(:items='seasons' sort-by='season_number' disable-pagination hide-default-footer)
    template(v-slot:default='props')
      v-row.mt-n1(dense justify='center')
        v-col(v-for='season in props.items' :key='season.id' cols='6' sm='6' md='4' lg='3' xl='2' :class='{ "order-last": season.name == "Specials" }')
          v-hover(v-slot:default='{ hover }')
            v-card(flat nuxt :to='`/series/${$route.params.seriesID}/seasons/${season.season_number}/episodes`' :active-class='$vuetify.theme.dark ? "grey darken-4" : "grey lighten-3"' :color='hover ? $vuetify.theme.dark ? "grey darken-4" : "grey lighten-3" : "transparent"')
              v-container.pa-3(fluid)
                v-row(no-gutters align-content='center')
                  v-col.px-1(cols='12')
                    v-list-item.pa-0(two-line)
                      v-list-item-content.pa-0
                        v-list-item-title.font-weight-bold
                          span {{season.name}}
                        v-list-item-subtitle.overline.font-weight-regular
                          span(v-if='season.air_date') {{new Date(season.air_date).toLocaleDateString("en-US", {year: "numeric", month: "long"})}}
                          span.font-weight-light(v-else) (n/a)
                        v-list-item-subtitle.overline
                          span.font-weight-black.me-1 {{season.episode_count}}
                          span {{season.episode_count > 1 ? "Episodes" : "Episode"}}
                  v-col(cols='12')
                    v-card(elevation='12')
                      v-img(v-if='season.poster_path' :aspect-ratio='2/3' width='100%' :src='$store.getters.imgURL(season.poster_path, "poster", 3)' :lazy-src='$store.getters.imgURL(season.poster_path, "poster", 0)')
                        template(v-slot:placeholder)
                          v-row.pa-3.ma-0.fill-height(justify='start' align='start')
                            v-progress-circular(indeterminate)
                      v-responsive(v-else :aspect-ratio='2/3')
                        v-row.pa-3.ma-0.fill-height(justify='start' align='start')
                          v-icon(disabled large) mdi-image-off
</template>

<script>
export default {
  scrollTo: '#tabs',
  props: {
    seasons: {
      type: Array,
      reqiured: true,
    },
  },
}
</script>

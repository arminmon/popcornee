<template lang="pug">
	v-container
		v-row
			v-col(cols='12' md='auto')
				v-card(:loading='loading')
					v-navigation-drawer(permanent floating :width='$vuetify.breakpoint.mdAndUp ? 275 : "100%"' :color='$vuetify.theme.dark ? "grey darken-4" : "grey lighten-3"')
						v-btn(large block depressed tile @click='showList = !showList' v-show='$vuetify.breakpoint.smAndDown')
							span Select a Season
							v-icon(right) {{ showList ? "mdi-chevron-up" : "mdi-chevron-down"}}
						v-expand-transition
							v-list(rounded v-show='showList || $vuetify.breakpoint.mdAndUp')
								v-data-iterator(:items='seasons' :sort-desc='toggles.includes("sortDesc")' sort-by='season_number' disable-pagination hide-default-footer)
									template(v-slot:header='props')
										v-subheader(v-if='props.items.length > 1')
											span {{seasons[0].name == 'Specials' ? `${props.items.length - 1} ${props.items.length > 1 ? "Seasons" : "Season"} + Specials` : `${props.items.length} ${props.items.length > 1 ? "Seasons" : "Season"}`}}
											v-spacer
											v-btn-toggle(v-model='toggles' borderless dense multiple)
												v-btn(value='sortDesc')
													v-icon mdi-sort-descending
										v-divider.my-2(v-if='props.items.length > 1')
									template(v-slot:default='props')
										v-list-item-group(v-model='selected')
											v-list-item(v-for='season in props.items' :key='season.id' :value='season.season_number.toString()' :class='{ "order-last": season.season_number == 0 }' active-class='font-weight-bold')
												v-list-item-avatar.font-weight-thin(horizontal v-if='season.season_number != 0') {{season.season_number.toString().padStart(2, "0")}}
												v-list-item-content
													v-list-item-title {{season.name}}
			v-col
				v-window(v-model='window')
					v-window-item(value='index')
						v-data-iterator(:items='seasons' :sort-desc='toggles.includes("sortDesc")' sort-by='season_number' disable-pagination hide-default-footer)
							template(v-slot:default='props')
								v-row.mt-n1(dense justify='center')
									v-col(v-for='season in props.items' :key='season.id' cols='6' sm='6' md='4' lg='3' xl='2' :class='{ "order-last": season.name == "Specials" }')
										v-hover(v-slot:default='{ hover }')
											v-card(flat @click='selected = season.season_number.toString(); showList = false' :active-class='$vuetify.theme.dark ? "grey darken-4" : "grey lighten-3"' :color='hover ? $vuetify.theme.dark ? "grey darken-4" : "grey lighten-3" : "transparent"')
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
					v-window-item#season-page(value='season' eager)
						season-page(:seasonNum='selected' v-on:changeLoadingState='loading = $event' v-on:changeWindow='window = $event')
</template>

<script>
import SeasonPage from '~/components/series/SeasonPage'
export default {
  components: {
    SeasonPage,
  },
  props: {
    seasons: {
      type: Array,
      default: () => [],
    },
  },
  data: (_) => ({
    window: 'index',
    toggles: [],
    showList: true,
    loading: false,
  }),
  computed: {
    selected: {
      get: ({ $route }) =>
        $route.query && $route.query.season ? $route.query.season : null,
      set(num) {
        this.$router.replace({ hash: '#tab__seasons', query: { season: num } })
      },
    },
  },
  mounted() {
    if (this.seasons.length === 1) this.selected = 1
  },
}
</script>

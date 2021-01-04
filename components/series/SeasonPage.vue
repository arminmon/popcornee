<template lang="pug">
	v-container.pa-0(v-if='season')
		v-row.py-4
			v-col(align-self='center')
				h1.display-1.font-weight-bold {{season.name}}
				p(v-if='season.overview') {{season.overview}}
				.d-block
					h2.subtitle-1.d-inline(v-if='season.air_date')
						span.font-weight-bold {{new Date(season.air_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
					h2.subtitle-1(v-else) (N/A)
			v-col(cols='12' sm='3' :class='{ "px-12": $vuetify.breakpoint.smAndDown }' v-if='season.poster_path')
				v-hover(v-slot:default='{ hover }')
					v-card(elevation='15')
						v-img(:src='$store.getters.imgURL(season.poster_path, "poster", 4)' :lazy-src='$store.getters.imgURL(season.poster_path, "poster", 0)' :aspect-ratio='2/3')
							template(v-slot:placeholder)
								v-row.pa-3.ma-0.fill-height(justify='center' align='center')
									v-progress-circular(indeterminate)
							v-row.pa-3.ma-0.fill-height(justify='center' align='end')
								v-fab-transition
									v-btn(v-show='hover' fab small :href='`${$store.getters.imgURL(season.poster_path,"poster",6)}`' target='_blank')
										v-icon mdi-download
		v-tabs(show-arrows grow center-active icons-and-text background-color="transparent")
			v-tabs-slider
			v-tab(v-for='tabLink in tabs' :key='tabLink.to' @click='tab = tabLink.to' v-if='!tabLink.disabled')
				span {{tabLink.title}}
				v-icon {{tabLink.icon}}
		v-tabs-items(v-model='tab')
			//- Episodes Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__episodes')
				episodes-timeline(:episodes='season.episodes')
			//- Cast Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__cast' v-if='!tabs.cast.disabled')
				cast-iterator(:cast='season.credits.cast')
			//- Crew Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__crew' v-if='!tabs.crew.disabled')
				crew-table(:crew='season.credits.crew')
			//- Videos Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__videos' v-if='!tabs.videos.disabled')
				videos-grid(:videos='season.videos')
</template>

<script>
import EpisodesTimeline from '~/components/series/EpisodesTimeline'
import CastIterator from '~/components/common/iterators/CastIterator'
import CrewTable from '~/components/common/iterators/CrewTable'
import VideosGrid from '~/components/common/iterators/VideosGrid'
export default {
  components: {
    EpisodesTimeline,
    CastIterator,
    CrewTable,
    VideosGrid,
  },
  props: {
    seasonNum: {
      type: String,
      default: null,
    },
  },
  data: (_) => ({
    tab: 'tab__episodes',
    season: null,
  }),
  computed: {
    tabs() {
      return {
        episodes: {
          title: 'Episodes',
          to: 'tab__episodes',
          icon: 'mdi-format-list-bulleted',
        },
        cast: {
          title: 'Cast',
          to: 'tab__cast',
          icon: 'mdi-account-box-multiple',
          disabled: this.season.credits.cast.length < 1,
        },
        crew: {
          title: 'Crew',
          to: 'tab__crew',
          icon: 'mdi-account-group',
          disabled: this.season.credits.crew.length < 1,
        },
        videos: {
          title: 'Videos',
          to: 'tab__videos',
          icon: 'mdi-filmstrip-box-multiple',
          disabled: this.season.videos.total_results < 1,
        },
      }
    },
  },
  watch: {
    seasonNum: {
      async handler(seasonNum) {
        try {
          if (seasonNum !== null) {
            this.$emit('changeLoadingState', true)
            this.season = await this.$api.tmdb.get(
              `tv/${this.$store.state.series.id}/season/${seasonNum}`,
              {
                params: {
                  append_to_response: [
                    'credits',
                    'external_ids',
                    'videos',
                  ].join(),
                },
              }
            )
            this.$emit('changeLoadingState', 'success')
            this.$emit('changeWindow', 'season')
            this.$utils.scrollTo('#season-page', 10)
          } else {
            this.$emit('changeWindow', 'index')
            this.season = null
          }
        } catch (e) {
          this.$emit('changeLoadingState', 'error')
        } finally {
          setTimeout((_) => this.$emit('changeLoadingState', false), 1000)
        }
      },
      immediate: true,
    },
  },
}
</script>

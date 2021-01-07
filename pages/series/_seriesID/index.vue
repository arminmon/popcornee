<template lang="pug">
div
  v-container
    v-simple-table.py-6.info-table
      tbody
        tr(v-if='series.original_name')
          td.text-right.caption.font-weight-light Original Name
          td {{series.original_name}}
        tr(v-if='series.original_language')
          td.text-right.caption.font-weight-light Original Language
          td
            v-avatar.text-uppercase(size='32' :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"') {{series.original_language}}
        tr(v-if='series.origin_country.length > 0')
          td.text-right.caption.font-weight-light Origin {{series.episode_run_time.length > 1 ? "Countries" : "Country"}}
          td
            .mx-n1
              v-avatar.ma-1.text-uppercase(v-for='(country, index) in series.origin_country' :key='index' size='32' :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"') {{country}}
        tr(v-if='series.type')
          td.text-right.caption.font-weight-light Type
          td {{series.type}}
        tr(v-if='series.status')
          td.text-right.caption.font-weight-light Status
          td
            span {{series.status}}
        tr(v-if='series.number_of_seasons > 0')
          td.text-right.caption.font-weight-light Number of Seasons
          td
            v-chip(pill) {{series.number_of_seasons}}
        tr(v-if='series.number_of_episodes > 0')
          td.text-right.caption.font-weight-light Number of Episodes
          td
            v-chip(pill) {{series.number_of_episodes}}
        tr(v-if='series.first_air_date')
          td.text-right.caption.font-weight-light First Air Date
          td {{new Date(series.first_air_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
        tr(v-if='series.last_air_date')
          td.text-right.caption.font-weight-light Last Air Date
          td {{new Date(series.last_air_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
        tr(v-if='series.episode_run_time.length > 0')
          td.text-right.caption.font-weight-light Episode {{series.episode_run_time.length > 1 ? "Runtimes" : "Runtime"}}
          td
            .mx-n1
              v-chip.ma-1(v-for='(runtime, index) in series.episode_run_time' :key='index' pill) {{runtime}}ʹ
        tr(v-if='series.content_ratings.results.length > 0')
          td.text-right.caption.font-weight-light Content {{series.content_ratings.results.length > 1 ? "Ratings" : "Rating"}}
          td
            .mx-n1
              v-chip.ma-1(pill v-for='rating in series.content_ratings.results' :key='rating.iso_3166_1')
                v-avatar.text-uppercase(left :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"') {{rating.iso_3166_1}}
                | {{rating.rating}}
        tr(v-if='series.production_companies.length > 0')
          td.text-right.caption.font-weight-light Production {{series.production_companies.length > 1 ? "Companies" : "Company"}}
          td
            .mx-n1
              v-chip.ma-1(pill v-for='company in series.production_companies' :key='company.id' :to='`/companies/${company.id}`' nuxt)
                v-avatar(v-if='$vuetify.breakpoint.mdAndUp && company.logo_path' left :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"')
                  v-img(:src='$store.getters.imgURL(company.logo_path, "logo", 0)' contain)
                | {{company.name}}
        tr(v-if='series.created_by.length > 0')
          td.text-right.caption.font-weight-light Created By
          td
            .mx-n1
              v-chip.ma-1(pill v-for='person in series.created_by' :key='person.credit_id')
                v-avatar(v-if='$vuetify.breakpoint.smAndUp && person.profile_path' left :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"')
                  v-img(:src='$store.getters.imgURL(person.profile_path, "profile", 0)')
                | {{person.name}}
        tr(v-if='series.networks.length > 0')
          td.text-right.caption.font-weight-light {{series.networks.length > 1 ? "Networks" : "Network"}}
          td
            .mx-n1
              v-chip.ma-1(pill v-for='network in series.networks' :key='network.id' :to='`/networks/${network.id}`' nuxt)
                v-avatar(v-if='$vuetify.breakpoint.mdAndUp && network.logo_path' left :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"')
                  v-img(:src='$store.getters.imgURL(network.logo_path, "logo", 0)' contain)
                | {{network.name}}
        tr(v-if='series.homepage || series.external_ids.imdb_id || series.external_ids.twitter_id || series.external_ids.facebook_id || series.external_ids.instagram_id')
          td.text-right.caption.font-weight-light External Links
          td
            v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='series.homepage' target='_blank' v-if='series.homepage')
              v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-home-circle
              span(v-show='$vuetify.breakpoint.mdAndUp') Homepage
            v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='`https://www.imdb.com/title/${series.external_ids.imdb_id}`' target='_blank' v-if='series.external_ids.imdb_id')
              v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-database
              span(v-show='$vuetify.breakpoint.mdAndUp') IMdb
            v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='`https://twitter.com/${series.external_ids.twitter_id}`' target='_blank' v-if='series.external_ids.twitter_id')
              v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-twitter
              span(v-show='$vuetify.breakpoint.mdAndUp') Twitter
            v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='`https://www.facebook.com/${series.external_ids.facebook_id}`' target='_blank' v-if='series.external_ids.facebook_id')
              v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-facebook
              span(v-show='$vuetify.breakpoint.mdAndUp') Facebook
            v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='`https://www.instagram.com/${series.external_ids.instagram_id}`' target='_blank' v-if='series.external_ids.instagram_id')
              v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-instagram
              span(v-show='$vuetify.breakpoint.mdAndUp') Instagram
  //- Recommendations
  v-container(fluid v-if='series.recommendations.total_results > 0')
    media-iterator(:media='series.recommendations' title='You may also like' :resource='`tv/${series.id}/recommendations`')
  //- Keywords
  v-container(v-if='series.keywords.results')
    .px-2
      .text-center.pb-6.mx-n3
        v-chip.text-uppercase.ma-3(v-for='keyword in series.keywords.results' :key='keyword.id' label outlined small nuxt :to='{ path: "/discover/series", query: {with_keywords: keyword.id}}') {{keyword.name}}
</template>

<script>
export default {
  props: {
    series: {
      type: Object,
      default: null,
      reqiured: true,
    },
  },
}
</script>

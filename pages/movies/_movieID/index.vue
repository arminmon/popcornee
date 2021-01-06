<template lang="pug">
div
  v-container
    v-simple-table.py-6.info-table
      tbody
        tr(v-if='movie.original_title')
          td.text-right.caption.font-weight-light Original Title
          td {{movie.original_title}}
        tr(v-if='movie.original_language')
          td.text-right.caption.font-weight-light Original Language
          td
            v-avatar.text-uppercase(size='32' :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"') {{movie.original_language}}
        tr(v-if='movie.spoken_languages.length > 0')
          td.text-right.caption.font-weight-light Spoken {{movie.spoken_languages.length > 1 ? "Languages" : "Language"}}
          td
            .mx-n1
              v-chip.ma-1(pill v-for='language in movie.spoken_languages' :key='language.iso_639_1')
                v-avatar.text-uppercase(v-if='$vuetify.breakpoint.mdAndUp' left :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"') {{language.iso_639_1}}
                | {{language.name}}
        tr(v-if='movie.runtime > 0')
          td.text-right.caption.font-weight-light Runtime
          td
            v-chip(pill) {{movie.runtime}}ʹ
        tr(v-if='movie.status')
          td.text-right.caption.font-weight-light Status
          td
            span {{movie.status}}
        tr(v-if='movie.release_date')
          td.text-right.caption.font-weight-light Release Date
          td {{new Date(movie.release_date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
        tr(v-if='movie.production_companies.length > 0')
          td.text-right.caption.font-weight-light Production {{movie.production_companies.length > 1 ? "Companies" : "Company"}}
          td
            .mx-n1
              v-chip.ma-1(pill v-for='company in movie.production_companies' :key='company.id' :to='`/companies/${company.id}`' nuxt)
                v-avatar(v-if='$vuetify.breakpoint.mdAndUp && company.logo_path' left :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"')
                  v-img(:src='$store.getters.imgURL(company.logo_path, "logo", 0)' contain)
                | {{company.name}}
        tr(v-if='movie.production_countries.length > 0')
          td.text-right.caption.font-weight-light Production {{movie.production_countries.length > 1 ? "Countries" : "Country"}}
          td
            .mx-n1
              v-chip.ma-1(pill v-for='country in movie.production_countries' :key='country.iso_3166_1')
                v-avatar.text-uppercase(v-if='$vuetify.breakpoint.mdAndUp' left :color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-3"') {{country.iso_3166_1}}
                | {{country.name}}
        tr(v-if='movie.budget > 0')
          td.text-right.caption.font-weight-light Budget
          td ${{movie.budget.toLocaleString()}}
        tr(v-if='movie.revenue > 0')
          td.text-right.caption.font-weight-light Revenue
          td ${{movie.revenue.toLocaleString()}}
        tr(v-if='movie.homepage || movie.external_ids.imdb_id || movie.external_ids.twitter_id || movie.external_ids.facebook_id || movie.external_ids.instagram_id')
          td.text-right.caption.font-weight-light External Links
          td
            v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='movie.homepage' target='_blank' v-if='movie.homepage')
              v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-home-circle
              span(v-show='$vuetify.breakpoint.mdAndUp') Homepage
            v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='`https://www.imdb.com/title/${movie.external_ids.imdb_id}`' target='_blank' v-if='movie.external_ids.imdb_id')
              v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-database
              span(v-show='$vuetify.breakpoint.mdAndUp') IMdb
            v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='`https://twitter.com/${movie.external_ids.twitter_id}`' target='_blank' v-if='movie.external_ids.twitter_id')
              v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-twitter
              span(v-show='$vuetify.breakpoint.mdAndUp') Twitter
            v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='`https://www.facebook.com/${movie.external_ids.facebook_id}`' target='_blank' v-if='movie.external_ids.facebook_id')
              v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-facebook
              span(v-show='$vuetify.breakpoint.mdAndUp') Facebook
            v-btn(text :icon='$vuetify.breakpoint.smAndDown' :href='`https://www.instagram.com/${movie.external_ids.instagram_id}`' target='_blank' v-if='movie.external_ids.instagram_id')
              v-icon(:left='$vuetify.breakpoint.mdAndUp') mdi-instagram
              span(v-show='$vuetify.breakpoint.mdAndUp') Instagram
  //- Collection
  v-container(fluid v-if='movie.collection')
    media-iterator(:media='{results: movie.collection.parts}' :title='movie.collection.name' justify='center' default-view='narrow' hide-views)
      template(v-slot:header-append)
        v-btn(text nuxt :to='`/movies/collections/${movie.collection.id}`') {{$vuetify.breakpoint.mdAndUp ? "View Collection" : "View"}}
  //- Recommendations
  v-container(fluid v-if='movie.recommendations.total_results > 0')
    media-iterator(:media='movie.recommendations' title='You may also like' :resource='`movie/${movie.id}/recommendations`')
  //- Keywords
  v-container(v-if='movie.keywords.keywords')
    .px-2
      .text-center.pb-6.mx-n2
        v-chip.text-uppercase.ma-2(v-for='keyword in movie.keywords.keywords' :key='keyword.id' label outlined small nuxt :to='{ path: "/discover/movies", query: {with_keywords: keyword.id}}') {{keyword.name}}
</template>

<script>
export default {
  scrollTo: 'top',
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template lang="pug">
	v-main.pt-0
		v-img.v-img--blurred(
			:aspect-ratio='10'
			:src='$store.getters.imgURL(movie.backdrop_path, "backdrop", 0)'
			:lazy-src='$store.getters.imgURL(movie.backdrop_path, "backdrop", 0)'
			:gradient='$utils.gradient("to top", [{ alpha: "1", pos: "15%" }, { alpha: ".7", pos: "100%" }])'
			)
			template(v-slot:placeholder)
				v-row.pa-3.ma-0.fill-height(justify='end' align='start')
					v-progress-circular(indeterminate style='opacity: .25')
			v-container.py-12(:class='{ "pb-0": $vuetify.breakpoint.xsOnly }')
				v-row.py-6(align='center' justify='center')
					v-col(align-self='center')
						h1.display-1.font-weight-bold {{movie.title || movie.original_title}}
						h3.subtitle-1.font-weight-light.font-italic(v-if='movie.tagline') – {{movie.tagline}}
						p(v-if='movie.overview') {{movie.overview}}
						.d-block
							h2.subtitle-1.d-inline(v-if='movie.release_date')
								span.font-weight-bold {{new Date(movie.release_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}}
								span.font-weight-light(v-if='movie.status')  ({{movie.status}})
							h2.subtitle-1.font-weight-light(v-else) (N/A)
							releases-dialog(:releases='movie.release_dates.results' v-if='movie.release_date && movie.release_dates.results.length > 0')
						.mx-n1.py-2
							v-chip.ma-1(v-for='genre in movie.genres' :key='genre.id' :small='$vuetify.breakpoint.smAndDown' outlined nuxt :to='{ path: "/discover/movies", query: { with_genres: genre.id } }') {{genre.name}}
						.d-block(v-if='movie.vote_average > 0')
							v-rating.d-inline(:value='movie.vote_average/2' length='5' half-increments readonly :dense='$vuetify.breakpoint.mdAndDown' open-delay='300' color='orange' :background-color='$vuetify.theme.dark ? "grey darken-1" : "grey lighten-5"')
							.d-inline.overline.px-2
								span.font-weight-bold {{movie.vote_average}}
								span /10
						v-btn.mt-6(v-if='!tabs.cast.disabled' height='100' text nuxt replace to='#tab__cast' :block='$vuetify.breakpoint.smAndDown')
							.mx-n2
								v-avatar.elevation-3.mx-2(v-for='person in movie.credits.cast.slice(0, $vuetify.breakpoint.smAndDown ? 3 : 4)' :key='person.credit_id' :size='$vuetify.breakpoint.smAndDown ? 65 : 78')
									v-img(v-if='person.profile_path' :src='$store.getters.imgURL(person.profile_path, "profile", 1)' aspect-ratio='1' :lazy-src='$store.getters.imgURL(person.profile_path, "profile", 0)')
									span.headline(v-else) {{person.name.split(" ")[0][0]}}{{person.name.split(" ")[1][0]}}
								v-avatar.mx-2(v-if='movie.credits.cast.length - ($vuetify.breakpoint.smAndDown ? 3 : 4) > 0' :size='$vuetify.breakpoint.smAndDown ? 65 : 78')
									span.title +{{movie.credits.cast.length - ($vuetify.breakpoint.smAndDown ? 3 : 4)}}
					v-col(cols='12' sm='4' v-if='movie.poster_path')
						v-hover(v-slot:default='{ hover }')
							v-card(elevation='15')
								v-img(:src='$store.getters.imgURL(movie.poster_path, "poster", 4)' :lazy-src='$store.getters.imgURL(movie.poster_path, "poster", 0)' :aspect-ratio='2/3')
									template(v-slot:placeholder)
										v-row.pa-3.ma-0.fill-height(justify='center' align='center')
											v-progress-circular(indeterminate)
									v-row.pa-3.ma-0.fill-height(justify='center' align='end')
										v-fab-transition
											v-btn(v-show='hover' fab small :href='`${$store.getters.imgURL(movie.poster_path,"poster",6)}`' target='_blank')
												v-icon mdi-download
		v-sheet(tile elevation='0')
			v-container.py-0(:class='{ "px-0": $vuetify.breakpoint.xsOnly }')
				v-tabs#tabs(v-model='tab' show-arrows grow center-active icons-and-text background-color="transparent")
					v-tabs-slider
					v-tab(v-for='tab in tabs' :key='tab.to' nuxt replace :to='tab.to' v-if='!tab.disabled')
						span {{tab.title}}
						v-icon {{tab.icon}}
		v-tabs-items(v-model='tab')
			//- Info Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__info')
				//- Info Table
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
										v-chip.ma-1(pill v-for='company in movie.production_companies' :key='company.id' :to='`/companies/${company.id}-${$utils.slugify(String(company.name))}#tab__info`' nuxt)
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
					media-iterator(:media='movie.collection.parts' :title='movie.collection.name' justify='center' default-view='narrow' hide-views)
						template(v-slot:header-append)
							v-btn(text nuxt :to='`/movies/collections/${movie.collection.id}-${$utils.slugify(String(movie.collection.name))}`') {{$vuetify.breakpoint.mdAndUp ? "View Collection" : "View"}}
				//- Recommendations
				v-container(fluid v-if='movie.recommendations.total_results > 0')
					media-iterator(:media='movie.recommendations' title='You may also like' :resource='`movie/${movie.id}/recommendations`')
				//- Keywords
				v-container(v-if='movie.keywords.keywords')
					.px-2
						.text-center.pb-6.mx-n2
							v-chip.text-uppercase.ma-2(v-for='keyword in movie.keywords.keywords' :key='keyword.id' label outlined small nuxt :to='{ path: "/discover/movies", query: {with_keywords: keyword.id}}') {{keyword.name}}
			//- Cast Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__cast' v-if='!tabs.cast.disabled')
				cast-iterator(:cast='movie.credits.cast')
			//- Crew Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__crew' v-if='!tabs.crew.disabled')
				crew-table(:crew='movie.credits.crew')
			//- Videos Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__videos' v-if='!tabs.videos.disabled')
				videos-grid(:videos='movie.videos')
			//- Reviews Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__reviews' v-if='!tabs.reviews.disabled')
				reviews-timeline(:reviews='movie.reviews')
			//- Similar Tab ——————————————————————————————————————————————————————————————————————————— -//
			v-tab-item(value='tab__similar' v-if='!tabs.similar.disabled')
				v-container(fluid)
					media-iterator(:media='movie.similar' title='Similar Movies' :resource='`movie/${movie.id}/similar`')
</template>

<script>
export default {
  validate: ({ params }) => /^\d+$/.test(String(params.movieID).split('-')[0]),
  asyncData: ({ app, params, error }) =>
    app.$api.tmdb
      .get(`movie/${String(params.movieID).split('-')[0]}`, {
        params: {
          append_to_response: [
            'credits',
            'keywords',
            'external_ids',
            'videos',
            'recommendations',
            'similar',
            'release_dates',
            'reviews',
          ].join(),
        },
      })
      .then(async (res) => {
        if (res.release_dates && res.release_dates.results.length > 0)
          res.release_dates.results.sort((a, b) =>
            a.iso_3166_1 > b.iso_3166_1 ? 1 : -1
          )
        res.collection = null
        if (res.belongs_to_collection) {
          res.collection = await app.$api.tmdb.get(
            `collection/${res.belongs_to_collection.id}`
          )
          delete res.belongs_to_collection
        }
        return { movie: res }
      })
      .catch((e) => error(e)),
  data: (_) => ({
    tab: null,
  }),
  fetch: async ({ store }) => {
    await store.dispatch('FETCH_CONFIGS')
    await store.dispatch('FETCH_GENRES')
  },
  head() {
    return {
      title: `${this.movie.title || this.movie.original_title} (${
        this.movie.release_date
          ? new Date(this.movie.release_date).toLocaleDateString('en-US', {
              year: 'numeric',
            })
          : 'n/a'
      })${this.movie.tagline ? ' – ' + this.movie.tagline : ''}`,
    }
  },
  computed: {
    tabs() {
      return {
        info: {
          title: 'Info',
          to: '#tab__info',
          icon: 'mdi-information-variant',
        },
        cast: {
          title: 'Cast',
          to: '#tab__cast',
          icon: 'mdi-account-box-multiple',
          disabled: this.movie.credits.cast.length < 1,
        },
        crew: {
          title: 'Crew',
          to: '#tab__crew',
          icon: 'mdi-account-group',
          disabled: this.movie.credits.crew.length < 1,
        },
        videos: {
          title: 'Videos',
          to: '#tab__videos',
          icon: 'mdi-filmstrip-box-multiple',
          disabled: this.movie.videos.total_results < 1,
        },
        reviews: {
          title: 'Reviews',
          to: '#tab__reviews',
          icon: 'mdi-android-messages',
          disabled: this.movie.reviews.total_results < 1,
        },
        similar: {
          title: 'Similar',
          to: '#tab__similar',
          icon: 'mdi-approximately-equal-box',
          disabled: this.movie.similar.total_results < 1,
        },
      }
    },
    visibleCast: ({ $vuetify }) =>
      $vuetify.breakpoint.mdAndDown
        ? 4 - 1
        : $vuetify.breakpoint.lgOnly
        ? 6 - 1
        : 12 - 1,
  },
  mounted() {
    this.$store.commit('COLLAPSE_APP_BAR', true)
    if (this.$route.hash === '') this.$router.replace({ hash: '#tab__info' })
  },
}
</script>

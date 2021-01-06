<template lang="pug">
	v-container
		v-data-iterator(:items='cast' item-key='credit_id' :search='search' no-results-text='No one was found!' disable-pagination hide-default-footer)
			template(v-slot:header)
				v-toolbar.mb-2(flat color='transparent')
					v-text-field(v-model='search' append-icon='mdi-account-search' label='Search Actors/Actresses & Characters' single-line hide-details clearable)
					v-spacer
			template(v-slot:default='{ items }')
				masonry.mx-n2(:cols="{ 600: 2, 960: 3, 1265: 4, 1905: 5, default: 6 }" gutter='0')
					div.mx-2.my-4(v-for='person in items' :key='person.credit_id')
						v-card(hover nuxt :to='`/people/${person.id}`' :color='$vuetify.theme.dark ? "grey darken-3" : "grey lighten-3"')
							v-card-text.text-center
								v-avatar(size='100')
									v-img(v-if='person.profile_path' :src='$store.getters.imgURL(person.profile_path, "profile", 1)' :lazy-src='$store.getters.imgURL(person.profile_path, "profile", 0)' :aspect-ratio='186/278')
										template(v-slot:placeholder)
											v-row.pa-3.ma-0.fill-height(justify='start' align='start')
												v-progress-circular(indeterminate style='opacity: .25')
									v-icon(v-else x-large disabled :class='{ "darken-2": $vuetify.theme.dark, "lighten-3": !$vuetify.theme.dark }') mdi-account
								.title {{person.name}}
								.subtitle-2.font-weight-thin as
								.subtitle-1 {{person.character}}
			template(v-slot:no-results)
				.pa-3.text-center
					v-icon(x-large disabled) mdi-account-question
					br
					v-btn(text @click='search = ""') Clear Search
</template>

<script>
export default {
  props: {
    cast: { type: Array, default: () => [] },
  },
  data() {
    return {
      search: '',
      keys: ['name', 'character'],
    }
  },
}
</script>

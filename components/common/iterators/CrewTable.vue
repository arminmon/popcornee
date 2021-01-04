<template lang="pug">
	v-container
		v-data-table(:items='crew' item-key='credit_id' fixed-header :headers='headers' :search='search' no-results-text='No one was found!')
			template(v-slot:top)
				v-toolbar.mb-2(flat color='transparent')
					v-text-field(v-model='search' append-icon='mdi-account-search' label='Search Crew, Jobs & Departments' single-line hide-details clearable)
					v-spacer
			template(v-slot:item.avatar='{ item }')
				nuxt-link(:to='`/people/${item.id}-${$utils.slugify(String(item.name))}#tab__info`')
					v-avatar.elevation-2.my-4(:size='$vuetify.breakpoint.xsOnly ? 48 : 64' :tile='$vuetify.breakpoint.xsOnly')
						v-img(v-if='item.profile_path' :src='$store.getters.imgURL(item.profile_path, "profile", 1)' :lazy-src='$store.getters.imgURL(item.profile_path, "profile", 0)')
							template(v-slot:placeholder)
								v-row.pa-3.ma-0.fill-height(justify='center' align='center')
									v-progress-circular(indeterminate)
						v-icon(v-else large) mdi-account-circle
			template(v-slot:no-results)
				.pa-3.text-center
					v-icon(x-large disabled) mdi-account-question
					br
					v-btn(text @click='search = ""') Clear Search
</template>

<script>
export default {
  props: {
    crew: { type: Array, default: () => [] },
  },
  data() {
    return {
      search: '',
      headers: [
        {
          text: '',
          value: 'avatar',
          align: 'right',
          sortable: false,
        },
        {
          text: 'Name',
          value: 'name',
          sortable: true,
        },
        {
          text: 'Job',
          value: 'job',
          sortable: true,
        },
        {
          text: 'Department',
          value: 'department',
          sortable: true,
        },
      ],
    }
  },
}
</script>

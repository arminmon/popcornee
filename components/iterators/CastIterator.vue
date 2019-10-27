<template lang="pug">
	v-container
		v-data-iterator(:items='cast' item-key='credit_id' :search='search' no-results-text='No one was found!' disable-pagination hide-default-footer)
			template(v-slot:header)
				v-toolbar(flat color='transparent')
					v-toolbar-title Cast
					v-spacer
					v-text-field(v-model='search' append-icon='mdi-account-search' label='Search Actors/Actresses & Characters' single-line hide-details clearable)
			template(v-slot:default='props')
				v-row(:dense='$store.state.drawer || $vuetify.breakpoint.smAndDown')
					v-col(v-for='person in props.items' :key='person.credit_id' cols='6' sm='4' md='3' lg='2' xl='1')
						person-card(:person='person')
			template(v-slot:no-results)
				.pa-3.text-center
					v-icon(x-large disabled) mdi-account-question
					br
					v-btn(text @click='search = ""') Clear Search
</template>

<script>
	import PersonCard from "~/components/cards/PersonCard";
	export default {
		components: {
			PersonCard
		},
		props: {
			cast: Array
		},
		data() {
			return {
				search: "",
				keys: ["name", "character"]
			};
		}
	};
</script>
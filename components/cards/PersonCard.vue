<template lang="pug">
	v-card(hover :color='$vuetify.theme.dark ? "grey darken-4" : "grey lighten-3"' nuxt :to='`/people/${person.id}`')
		v-img(:src='$store.getters.imgURL(person.profile_path, "profile", 1)' :lazy-src='$store.getters.imgURL(person.profile_path, "profile", 0)' :aspect-ratio='186/278' :gradient='$utils.gradient("to top", [{alpha: ".8", pos: "15%"}, {alpha: "0", pos: "50%"}])')
			template(v-slot:placeholder)
				v-row.fill-height.ma-0.pa-3(justify='start' align='start')
					v-progress-circular(indeterminate style='opacity: .25')
			v-container.fill-height(fluid)
				v-row.fill-height(no-gutters)
					v-col(v-if='person.profile_path == null' cols='12' align-self='start')
						v-icon(style='opacity: .25') mdi-image-off
					v-col(cols='12' align-self='end')
						v-list-item.pa-0(flat)
							v-list-item-content.pa-0
								v-list-item-title.text-wrap {{person.name}}
								v-list-item-subtitle.text-wrap(v-if='person.character')
									span.font-weight-thin as 
									| {{person.character}}
</template>

<script>
	export default {
		props: {
			person: Object
		}
	};
</script>
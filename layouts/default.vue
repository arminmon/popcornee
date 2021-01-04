<template lang="pug">
	v-app(id='popcornee-app')
		//- Application Bar
		app-bar(@toggleDrawer="$refs.appDrawer.$emit('toggleDrawer')")
		//- Navigation Drawer
		app-drawer(ref='appDrawer')
		//- Content
		nuxt.
		//- Footer
		app-footer
</template>

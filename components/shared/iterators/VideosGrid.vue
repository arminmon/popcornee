<template lang="pug">
	div
		v-container(v-for='(type, key, index) in videos.types' :key='type.title')
			v-divider(v-if='index != 0')
			v-subheader {{type.title}}
			v-row(:dense='$store.state.drawer')
				v-col(cols='12' sm='6' md='6' lg='4' xl='3' v-for='video in type.results' :key='video.id' v-if='video.site == "YouTube"')
					video-card(:video='video')
</template>

<script>
	import VideoCard from "~/components/shared/cards/VideoCard";
	export default {
		components: {
			VideoCard
		},
		props: {
			videos: Object
		}
	};
</script>
<template lang="pug">
  videos-grid(:videos='season.videos')
</template>

<script>
export default {
  scrollTo: '#seasons',
  props: {
    season: {
      type: Object,
      reqiured: true,
    },
  },
}
</script>

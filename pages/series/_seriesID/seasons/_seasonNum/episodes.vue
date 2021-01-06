<template lang="pug">
  episodes-timeline(:episodes='season.episodes')
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

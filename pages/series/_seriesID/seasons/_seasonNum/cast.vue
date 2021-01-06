<template lang="pug">
  cast-iterator(:cast='season.credits.cast')
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

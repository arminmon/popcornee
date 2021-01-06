<template lang="pug">
  crew-table(:crew='season.credits.crew')
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

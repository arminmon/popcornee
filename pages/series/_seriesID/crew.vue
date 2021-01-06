<template lang="pug">
  crew-table(:crew='series.credits.crew')
</template>

<script>
export default {
  scrollTo: '#tabs',
  props: {
    series: {
      type: Object,
      required: true,
    },
  },
}
</script>

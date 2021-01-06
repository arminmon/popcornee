<template lang="pug">
  cast-iterator(:cast='series.credits.cast')
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

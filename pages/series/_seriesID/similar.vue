<template lang="pug">
  v-container(fluid)
    media-iterator(:media='series.similar' title='Similar Series' :resource='`tv/${series.id}/similar`')
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

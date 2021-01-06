<template lang="pug">
  reviews-timeline(:reviews='series.reviews')
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

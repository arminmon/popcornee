<template lang="pug">
  videos-grid(:videos='series.videos')
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

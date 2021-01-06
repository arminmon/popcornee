<template lang="pug">
  videos-grid(:videos='movie.videos')
</template>

<script>
export default {
  scrollTo: '#tabs',
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
}
</script>

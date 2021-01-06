<template lang="pug">
  reviews-timeline(:reviews='movie.reviews')
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

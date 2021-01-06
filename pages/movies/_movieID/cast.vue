<template lang="pug">
  cast-iterator(:cast='movie.credits.cast')
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

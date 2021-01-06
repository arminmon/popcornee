<template lang="pug">
  v-container(fluid)
    media-iterator(:media='movie.similar' title='Similar Movies' :resource='`movie/${movie.id}/similar`')
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

<template lang="pug">
  crew-table(:crew='movie.credits.crew')
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

<template lang="pug">
  
</template>

<script>
export default {
  async fetch({ params, redirect }) {
    await redirect(
      `/series/${params.seriesID}/seasons/${params.seasonNum}/episodes`
    )
  },
}
</script>

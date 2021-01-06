<template lang="pug">
  v-container
    v-row(dense justify='center')
      v-col(v-for='image in company.images.logos' :key='image.file_path' cols='6' sm='4' md='3' lg='2' xl='1')
        v-hover(v-slot:default='{ hover }')
          v-card.pa-3(hover :href='`${$store.getters.imgURL(image.file_path,"logo",6)}`' target='_blank')
            v-img(:src='$store.getters.imgURL(company.logo_path, "logo", 3)' :lazy-src='$store.getters.imgURL(company.logo_path, "logo", 0)' contain aspect-ratio='1')
              template(v-slot:placeholder)
                v-row.pa-3.ma-0.fill-height(justify='center' align='center')
                  v-progress-circular(indeterminate)
              v-row.pa-3.ma-0.fill-height(justify='center' align='center')
                v-fab-transition
                  v-btn(v-show='hover' fab small)
                    v-icon mdi-download
</template>

<script>
export default {
  scrollTo: '#tabs',
  props: {
    company: {
      type: Object,
      required: true,
    },
  },
}
</script>

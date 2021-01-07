<template lang="pug">
  v-container
    v-simple-table.py-6.info-table
      tbody
        tr(v-if='network.headquarters')
          td.text-right.caption.font-weight-light Headquarters
          td {{network.headquarters}}
        tr(v-if='network.origin_country')
          td.text-right.caption.font-weight-light Country of Origin
          td
            v-chip {{network.origin_country}}
</template>

<script>
export default {
  props: {
    network: {
      type: Object,
      required: true,
    },
  },
}
</script>

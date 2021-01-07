<template lang="pug">
  v-container
    v-simple-table.py-6.info-table
      tbody
        tr(v-if='company.headquarters')
          td.text-right.caption.font-weight-light Headquarters
          td {{company.headquarters}}
        tr(v-if='company.origin_country')
          td.text-right.caption.font-weight-light Country of Origin
          td
            v-chip {{company.origin_country}}
</template>

<script>
export default {
  props: {
    company: {
      type: Object,
      required: true,
    },
  },
}
</script>

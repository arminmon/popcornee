<template lang="pug">
  v-container
    v-simple-table.py-6.info-table
      tbody
        tr(v-if='person.known_for_department')
          td.text-right.caption.font-weight-light Known for Department
          td {{person.known_for_department}}
        tr(v-if='person.birthday')
          td.text-right.caption.font-weight-light Date of Birth
          td {{new Date(person.birthday).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
        tr(v-if='person.place_of_birth')
          td.text-right.caption.font-weight-light Place of Birth
          td {{person.place_of_birth}}
        tr(v-if='person.deathday')
          td.text-right.caption.font-weight-light Date of Birth
          td {{new Date(person.deathday).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}}
        tr(v-if='person.also_known_as.length > 0')
          td.text-right.caption.font-weight-light Also Known as
          td
            .mx-n1
              v-chip.ma-1(v-for='name in person.also_known_as' :key='name') {{name}}
</template>

<script>
export default {
  scrollTo: '#tabs',
  props: {
    person: {
      type: Object,
      required: true,
    },
  },
}
</script>

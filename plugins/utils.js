export default function ({ $vuetify }, inject) {
  const media = {
    views: {
      narrow: {
        icon: 'mdi-view-agenda',
        class: 'mdi-rotate-90',
        breakpoints: {
          cols: 6,
          sm: 4,
          md: 3,
          lg: 2,
          xl: 2,
        },
      },
      wide: {
        icon: 'mdi-view-agenda',
        breakpoints: {
          cols: 12,
          sm: 12,
          md: 6,
          lg: 4,
          xl: 2,
        },
      },
    },
  }
  inject('utils', { media })
}

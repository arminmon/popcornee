export default function ({ $vuetify }, inject) {
  const gradient = (dir = '', stops = []) =>
    dir !== '' && stops.length > 0
      ? `${dir}, ${stops
          .map(
            (stop) =>
              `rgba(${$vuetify.theme.dark ? '30,30,30' : '255,255,255'},${
                stop.alpha
              }) ${stop.pos}`
          )
          .join()}`
      : null

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
  inject('utils', { gradient, media })
}

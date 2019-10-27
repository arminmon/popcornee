export default function({ $vuetify }, inject) {
	const utils = {
		gradient: (dir = '', stops = []) => (dir != '' && stops.length > 0 ? `${dir}, ${stops.map((stop) => `rgba(${$vuetify.theme.dark ? '66,66,66' : '255,255,255'},${stop.alpha}) ${stop.pos}`).join()}` : null),
		media: {
			views: {
				wide: {
					icon: 'mdi-view-agenda',
					breakpoints: {
						cols: 12,
						sm: 12,
						md: 6,
						lg: 6,
						xl: 4
					}
				},
				square: {
					icon: 'mdi-view-grid',
					breakpoints: {
						cols: 6,
						sm: 6,
						md: 4,
						lg: 3,
						xl: 2
					}
				},
				narrow: {
					icon: 'mdi-view-agenda',
					class: 'mdi-rotate-90',
					breakpoints: {
						cols: 6,
						sm: 6,
						md: 4,
						lg: 3,
						xl: 2
					}
				}
			}
		}
	}
	inject('utils', utils)
}

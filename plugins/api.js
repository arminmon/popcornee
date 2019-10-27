export default function({ $axios, env }, inject) {
	const api = {
		tmdb: (resource, params = null) =>
			new Promise(async (resolve, reject) => {
				let defaults = {
					api_key: process.env.TMDB_API_KEY || env.TMDB_API_KEY,
					include_adult: false,
					language: 'en-US'
				}
				try {
					let response = await $axios.$get(resource.join('/'), { params: { ...params, ...defaults } })
					if (response.videos) {
						let videos = {
							total_results: response.videos.results.length,
							types: {}
						}
						if (response.videos.results.length > 0) {
							let videoType = null
							for (let video of response.videos.results) {
								videoType = video.type.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
								if (videos.types[videoType] == null) videos.types[videoType] = { title: video.type, results: [] }
								videos.types[videoType].results.push(video)
							}
						}
						response.videos = videos
					}
					resolve(response)
				} catch (error) {
					reject(error)
				}
			}),
		yts: (imdbID) =>
			new Promise(async (resolve, reject) => {
				try {
					let response = await $axios.$get('https://yts.lt/api/v2/list_movies.json', { params: { query_term: imdbID } })
					if (response.status == 'ok') resolve(response.data)
					else throw new Error(response.status_message)
				} catch (error) {
					reject(error)
				}
			}),
		eztv: (params) =>
			new Promise(async (resolve, reject) => {
				try {
					let response = await $axios.$get('https://eztv.io/api/get-torrents', { params })
					resolve(response)
				} catch (error) {
					reject(error)
				}
			})
	}
	inject('api', api)
}

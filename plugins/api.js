import axios from 'axios'

export default function ({ env, error }, inject) {
  // The Movie Database
  const tmdb = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
  })
  tmdb.interceptors.request.use((config) => {
    if (!config.params) config.params = {}
    config.params.api_key = process.env.TMDB_API_KEY || env.TMDB_API_KEY
    config.params.include_adult = false
    config.params.language = 'en-US'
    return config
  })
  tmdb.interceptors.response.use(
    (res) => {
      const data = res.data
      if (data.videos) {
        const videos = {
          total_results: data.videos.results.length,
          types: {},
        }
        if (data.videos.results.length > 0) {
          let videoType = null
          for (const video of data.videos.results) {
            videoType = video.type
              .toLowerCase()
              .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
            if (videos.types[videoType] == null)
              videos.types[videoType] = { title: video.type, results: [] }
            videos.types[videoType].results.push(video)
          }
        }
        data.videos = videos
      }
      return data
    },
    (e) => error(e)
  )

  inject('api', { tmdb })
}

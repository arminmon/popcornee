export default function ({ $axios, $config: { apiKey }, error }) {
  $axios.onRequest((req) => {
    if (!req.params) req.params = {}
    req.params.api_key = apiKey
    req.params.include_adult = false
    req.params.language = 'en-US'

    return req
  })

  $axios.onResponse((res) => {
    if (res.data && res.data.videos) {
      const data = res.data
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
      res.data.videos = videos
    }

    return res
  })

  $axios.onError((err) => {
    console.error('AXIOS', err)
    error(err)
  })
}

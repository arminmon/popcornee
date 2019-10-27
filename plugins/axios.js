export default function({ $axios, error }) {
	$axios.onError((e) => {
		throw error({
			statusCode: !e.response ? 'Server who?' : e.response.status,
			message: !e.response ? 'Use a VPN/Proxy maybe?!' : e.response.data.status_message
		})
	})
}

import ky, { Options } from 'ky'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export const api = ky.create({
	prefixUrl: baseURL,
	timeout: 10000,
	hooks: {
		beforeRequest: [
			(request) => {
				// Attach auth header if available via cookies or other mechanism later
				return request
			},
		],
		afterResponse: [
			(request, options, response) => {
				if (response.status === 401) {
					// 클라이언트 환경에서만 리다이렉트
					if (typeof window !== 'undefined') {
						window.location.href = '/login'
					}
				}
				return response
			},
		],
	},
	credentials: 'include',
}) as typeof ky

export type ApiOptions = Options

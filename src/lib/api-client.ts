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
	},
}) as typeof ky

export type ApiOptions = Options

import ky, { Options } from 'ky'
import { redirect } from 'next/navigation'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// 클라이언트 전용 ky 인스턴스
export const api = ky.create({
	prefixUrl: baseURL,
	timeout: 10000,
	hooks: {
		afterResponse: [
			(request, options, response) => {
				if (response.status === 401) {
					if (typeof window !== 'undefined') {
						window.location.href = '/login'
						return
					}

					return redirect('/login')
				}
				return response
			},
		],
	},
	credentials: 'include',
}) as typeof ky

export type ApiOptions = Options

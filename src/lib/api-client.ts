import ky, { Options } from 'ky'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// 클라이언트 전용 ky 인스턴스
export const api = ky.create({
	prefixUrl: baseURL,
	timeout: 10000,
	hooks: {
		afterResponse: [
			(request, options, response) => {
				if (response.status === 401) {
					// 서버 사이드(SSR)에서는 리다이렉트를 수행하지 않음 (브라우저 쿠키 없음 이슈)
					if (typeof window === 'undefined') {
						console.log('[API] Server-side 401 Unauthorized (Returning empty list for SSR)')
						// 401 에러를 던지지 않기 위해 빈 배열을 담은 정상 응답(200)으로 위조하여 반환
						// 클라이언트 Hydration 이후 다시 fetch되어 정상 데이터가 로드됨
						return new Response(JSON.stringify([]), {
							status: 200,
							headers: { 'Content-Type': 'application/json' },
						})
					}

					// 클라이언트 사이드에서만 리다이렉트
					console.log('[API] 401 Unauthorized: Redirecting to login')
					window.location.href = '/login'
					return
				}
				return response
			},
		],
	},
	credentials: 'include',
}) as typeof ky

export type ApiOptions = Options

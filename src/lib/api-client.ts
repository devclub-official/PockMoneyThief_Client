import ky, { Options } from 'ky'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// 클라이언트 전용 ky 인스턴스
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

// 서버 전용 ky 인스턴스
// export const serverKy = ky.create({
// 	prefixUrl: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '',
// 	timeout: 10000,
// 	hooks: {
// 		beforeRequest: [
// 			async (request) => {
// 				// Next.js 서버에서 쿠키 forwarding
// 				const { cookies } = await import('next/headers')
// 				const cookieStore = await cookies()
// 				const cookieHeader = cookieStore.toString()
// 				console.log('cookieHeader', cookieHeader)
// 				if (cookieHeader) {
// 					request.headers.set('Cookie', cookieHeader)
// 				}
// 				return request
// 			},
// 		],
// 		afterResponse: [
// 			(request, options, response) => {
// 				if (response.status === 401) {
// 					// 서버 환경에서는 redirect 함수 사용
// 					const { redirect } = require('next/navigation')
// 					redirect('/login')
// 				}
// 				return response
// 			},
// 		],
// 	},
// 	credentials: 'include',
// }) as typeof ky

export type ApiOptions = Options

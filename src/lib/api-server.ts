import ky from 'ky'
import type { RaffleListResponse } from '@/types'
// import type { MyRaffle, ParticipatedRaffle } from '@/types/dashboard'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

const serverApi = ky.create({
	prefixUrl: baseURL,
	timeout: 10000,
})

// 서버 컴포넌트용 API 함수들 (React Query 없이 직접 호출)
export const serverApiClient = {
	// 추첨 목록 조회 (서버에서 prefetch)
	getRaffles: async (): Promise<RaffleListResponse> => {
		try {
			// 백엔드 서버가 없으면 에러가 발생하고 catch로 이동
			const response = await serverApi.get('raffles').json<RaffleListResponse>()
			return response
		} catch (error) {
			console.error('Failed to fetch raffles:', error)
			// 에러 시 빈 배열 반환
			return { items: [] }
		}
	},

	// getMyRaffles: async (): Promise<MyRaffle[]> => {
	// 	try {
	// 		return await serverApi.get('raffles/my').json<MyRaffle[]>()
	// 	} catch (error) {
	// 		console.error('Failed to fetch my raffles:', error)
	// 		return []
	// 	}
	// },

	// getParticipatedRaffles: async (): Promise<ParticipatedRaffle[]> => {
	// 	try {
	// 		return await serverApi.get('raffles/participated').json<ParticipatedRaffle[]>()
	// 	} catch (error) {
	// 		console.error('Failed to fetch participated raffles:', error)
	// 		return []
	// 	}
	// },
}

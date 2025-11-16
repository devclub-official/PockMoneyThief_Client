import ky from 'ky'
import type { RaffleListResponse } from '@/types'
import type { MyRaffleSelfResultResponse, MyWinsResponse } from '@/types'
import type { MyRaffle, ParticipatedRaffle } from '@/types/dashboard'

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

	/**
	 * 특정 추첨의 내 결과 (모의 API 사용)
	 * GET http://127.0.0.1:3658/m1/1084646-1073890-default/my/raffles/{raffleId}/result
	 */
	getMyRaffleSelfResult: async (raffleId: string): Promise<MyRaffleSelfResultResponse> => {
		try {
			const res = await serverApi
				.get(`my/raffles/${raffleId}/result`)
				.json<MyRaffleSelfResultResponse>()
			return res
		} catch (error) {
			console.error('Failed to fetch my raffle self result (mock):', error)
			// 실패 시 최소 필드만 채워 반환
			return {
				raffleId,
				raffleName: '',
				status: 'PUBLISHED',
				myParticipation: {
					participantId: '',
					displayName: '',
					joinedAt: new Date().toISOString(),
				},
				isWinner: false,
				winInfo: null,
				shippingRequired: false,
				shippingSubmitted: false,
			}
		}
	},

	/**
	 * 내 당첨 목록 (모의 API 사용)
	 * GET http://127.0.0.1:3658/m1/1084646-1073890-default/my/raffles/wins
	 */
	getMyWins: async (): Promise<MyWinsResponse> => {
		try {
			const res = await serverApi.get('my/raffles/wins').json<MyWinsResponse>()
			return res
		} catch (error) {
			console.error('Failed to fetch my wins (mock):', error)
			return { wins: [] }
		}
	},

	/**
	 * 내가 등록한 추첨 목록 (모의 API 사용)
	 * 실제 인증 연동 전까지 Bearer/세션 인증은 생략
	 * GET http://127.0.0.1:3658/m1/1084646-1073890-default/my/raffles/hosted
	 */
	getMyHostedRaffles: async (): Promise<MyRaffle[]> => {
		try {
			const res = await serverApi.get('my/raffles/hosted').json<{
				raffles: Array<{
					raffleId: string
					title: string
					entryFee: number
					imageUrl: string
					status: string
					deadlineAt: string
					participantsCount: number
				}>
			}>()

			// 모의 응답을 대시보드용 타입으로 매핑
			return res.raffles.map((r) => ({
				id: r.raffleId,
				title: r.title,
				imageUrl: r.imageUrl,
				// 알 수 없는 상태 값은 기본 'PUBLISHED'로 처리
				status:
					r.status === 'LOCKED' || r.status === 'DRAWN' || r.status === 'CANCELLED'
						? (r.status as MyRaffle['status'])
						: ('PUBLISHED' as MyRaffle['status']),
				type: 'single',
				currentParticipants: Math.max(0, Number(r.participantsCount) || 0),
				maxParticipants: Math.max(0, Number(r.participantsCount) || 0),
				deadlineAt: r.deadlineAt,
				winners: undefined,
			}))
		} catch (error) {
			console.error('Failed to fetch my hosted raffles (mock):', error)
			return []
		}
	},

	// getParticipatedRaffles: async (): Promise<ParticipatedRaffle[]> => {
	// 	try {
	// 		return await serverApi.get('raffles/participated').json<ParticipatedRaffle[]>()
	// 	} catch (error) {
	// 		console.error('Failed to fetch participated raffles:', error)
	// 		return []
	// 	}
	// },

	/**
	 * 내가 참여한 추첨 목록 (모의 API 사용)
	 * GET http://127.0.0.1:3658/m1/1084646-1073890-default/my/raffles/participated
	 */
	getMyParticipatedRaffles: async (): Promise<ParticipatedRaffle[]> => {
		try {
			const res = await serverApi.get('my/raffles/participated').json<{
				raffles: Array<{
					raffleId: string
					title: string
					entryFee: number
					imageUrl: string
					status: string
					deadlineAt: string
					myDisplayName: string
					joinedAt: string
				}>
			}>()

			return res.raffles.map((r) => ({
				id: r.raffleId,
				title: r.title,
				imageUrl: r.imageUrl,
				status:
					r.status === 'PUBLISHED' ||
					r.status === 'LOCKED' ||
					r.status === 'DRAWN' ||
					r.status === 'CANCELLED'
						? (r.status as ParticipatedRaffle['status'])
						: ('PUBLISHED' as ParticipatedRaffle['status']),
				displayName: r.myDisplayName,
				entryFee: Number(r.entryFee) || 0,
				deadlineAt: r.deadlineAt,
				isWinner: false,
				itemName: undefined,
				shippingStatus: undefined,
				participatedAt: r.joinedAt,
			}))
		} catch (error) {
			console.error('Failed to fetch my participated raffles (mock):', error)
			return []
		}
	},
}

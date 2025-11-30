import ky from 'ky'
import type { RaffleListResponse } from '@/types'
import { MyRaffle, ParticipatedRaffle } from '@/types/dashboard'
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

	// 내가 등록한 추첨 목록 조회 (서버에서 prefetch)
	getMyRaffles: async (): Promise<MyRaffle[]> => {
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

			return res.raffles.map((r) => ({
				id: r.raffleId,
				title: r.title,
				imageUrl: r.imageUrl,
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
			console.error('Failed to fetch my raffles:', error)
			return []
		}
	},

	// 내가 참여한 추첨 목록 조회 (서버에서 prefetch)
	getParticipatedRaffles: async (): Promise<ParticipatedRaffle[]> => {
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
			console.error('Failed to fetch participated raffles:', error)
			return []
		}
	},
}

import ky from 'ky'
import type { RaffleListResponse } from '@/types'
import { MyRaffle, ParticipatedRaffle } from '@/types/dashboard'
import { SHIPPING_STATUS } from './constants'
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

	// 대시보드 데이터 조회 (서버에서 prefetch)
	getMyRaffles: async (): Promise<MyRaffle[]> => {
		try {
			// TODO: 실제 API 연동 시 주석 해제
			// return await api.get('raffles/my').json<MyRaffle[]>()

			// Mock 데이터 반환 (개발 중)
			return [
				{
					id: 'rf_123',
					title: '피카츄 넨도로이드 #1355',
					description: '3만원 상당의 피카츄 넨도로이드를 5천원에!',
					imageUrl:
						'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
					status: 'DRAWN',
					type: 'single',
					currentParticipants: 7,
					maxParticipants: 10,
					deadlineAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
					winners: [
						{
							id: 'winner_1',
							raffleId: 'rf_123',
							participantId: 'pt_999',
							displayName: 'GachaKing',
							rank: 1,
							itemName: '피카츄 넨도로이드 #1355',
							shippingStatus: 'SAVED',
							shipping: {
								name: '김가차',
								phone: '010-1234-5678',
								zipcode: '12345',
								address1: '서울시 강남구 테헤란로 123',
								address2: '101동 101호',
								status: 'SAVED',
							},
							shippingInfo: {
								name: '김가차',
								phone: '010-1234-5678',
								zipcode: '12345',
								address1: '서울시 강남구 테헤란로 123',
								address2: '101동 101호',
							},
						},
					],
				},
			]
		} catch (error) {
			console.error('Failed to fetch my raffles:', error)
			return []
		}
	},

	getParticipatedRaffles: async (): Promise<ParticipatedRaffle[]> => {
		// return await serverKy.get('my/raffles/participated').json<ParticipatedRaffle[]>()

		// Mock 데이터 반환 (개발 중)
		return [
			{
				id: 'rf_abc122',
				title: '원피스 조로 피규어',
				imageUrl:
					'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
				status: 'DRAWN',
				isWinner: true,
				itemName: '원피스 조로 피규어',
				shippingStatus: 'DELIVERED',
				participatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
			},
			{
				id: 'rf_abc123',
				title: '원피스 나미 피규어',
				imageUrl:
					'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
				status: 'DRAWN',
				isWinner: true,
				itemName: '원피스 나미 피규어',
				shippingStatus: SHIPPING_STATUS.PENDING,
				participatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
			},
		]
	},
}

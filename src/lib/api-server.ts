import type { RaffleListResponse } from '@/types'
import type { MyRaffle, ParticipatedRaffle } from '@/types/dashboard'
import { SHIPPING_STATUS } from './constants'
// import { serverKy } from '@/lib/api-client'

// 서버 컴포넌트용 API 함수들 (React Query 없이 직접 호출)
export const serverApi = {
	// 추첨 목록 조회 (서버에서 prefetch)
	getRaffles: async (): Promise<RaffleListResponse> => {
		try {
			// TODO: 실제 API 연동 시 주석 해제
			// return await api.get('raffles').json<RaffleListResponse>()

			// Mock 데이터 반환 (개발 중)
			const currentTime = Date.now()
			return {
				items: [
					{
						id: '1',
						title: '넨도로이드 스누피',
						entryFee: 4500,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20230911/14938/120850/large/71230d7edbc29bae0ab3b5c58fa19f54.jpg',
						status: 'PUBLISHED',
						deadlineAt: new Date(currentTime + 3 * 60 * 60 * 1000).toISOString(),
					},
					{
						id: '3',
						title: '넨도로이드 노하라 신노스케',
						entryFee: 5200,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20200413/9424/68958/large/6f7668dc119dc3aebf6c8ad7b78f4fa5.jpg',
						status: 'PUBLISHED',
						deadlineAt: new Date(currentTime + 12 * 60 * 60 * 1000).toISOString(),
					},
					{
						id: '5',
						title: '넨도로이드 아리마 카나',
						entryFee: 4800,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20231018/15099/122334/large/1b9d0098a3182abc3245d2465295e97a.jpg',
						status: 'LOCKED',
						deadlineAt: new Date(currentTime + 45 * 60 * 1000).toISOString(),
					},
					{
						id: '6',
						title: '넨도로이드 키노모토 사쿠라',
						entryFee: 5500,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20140424/4400/28781/large/e9e71d6c222e420823e82f57d22018e8.jpg',
						status: 'PUBLISHED',
						deadlineAt: new Date(currentTime + 6 * 60 * 60 * 1000).toISOString(),
					},
				],
			}
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

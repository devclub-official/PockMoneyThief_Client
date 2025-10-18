import type { RaffleListResponse } from '@/types'

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
						status: '진행중',
						deadlineAt: new Date(currentTime + 3 * 60 * 60 * 1000).toISOString(),
					},
					{
						id: '3',
						title: '넨도로이드 노하라 신노스케',
						entryFee: 5200,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20200413/9424/68958/large/6f7668dc119dc3aebf6c8ad7b78f4fa5.jpg',
						status: '진행중',
						deadlineAt: new Date(currentTime + 12 * 60 * 60 * 1000).toISOString(),
					},
					{
						id: '5',
						title: '넨도로이드 아리마 카나',
						entryFee: 4800,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20231018/15099/122334/large/1b9d0098a3182abc3245d2465295e97a.jpg',
						status: '마감임박',
						deadlineAt: new Date(currentTime + 45 * 60 * 1000).toISOString(),
					},
					{
						id: '6',
						title: '넨도로이드 키노모토 사쿠라',
						entryFee: 5500,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20140424/4400/28781/large/e9e71d6c222e420823e82f57d22018e8.jpg',
						status: '진행중',
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
}

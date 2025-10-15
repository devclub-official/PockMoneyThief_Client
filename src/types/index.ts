// API 응답 타입 (실제 API 구조)
export interface RaffleListResponse {
	items: RaffleApiResponse[]
}

export interface RaffleApiResponse {
	id: string
	title: string
	entryFee: number
	imageUrl: string
	status: string
	deadlineAt: string
}

// 필터 타입
export type RaffleFilter = 'all' | 'active' | 'ending-soon'


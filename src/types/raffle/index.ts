// 래플 관련 모든 타입들

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

// 래플 상세 응답 타입
export interface RaffleDetailResponse {
	id: string
	title: string
	description: string
	entryFee: number
	minParticipants: number
	maxParticipants: number
	imageUrl: string
	deadlineAt: string
	tiers: TierResponse[]
	status: string
	createdAt: string
	participantsCount: number
}

export interface TierResponse {
	rank: number
	name: string
	imageUrl?: string
	quantity: number
}

// 래플 생성 요청 타입
export interface CreateRaffleRequest {
	title: string
	entryFee: number
	minParticipants: number
	maxParticipants: number
	deadlineAt: string
	imageUrl: string
	description: string
	tiers: TierRequest[]
}

export interface TierRequest {
	rank: number
	name: string
	quantity: number
	imageUrl?: string
}

// 필터 타입
export type RaffleFilter = 'all' | 'active' | 'ending-soon'

// 래플 상태 타입
export type RaffleStatus = 'active' | 'ended' | 'cancelled' | 'pending'

// 래플 참여 관련 타입
export interface RaffleParticipation {
	id: string
	raffleId: string
	userId: string
	participatedAt: string
	ipAddress: string
}

// 래플 결과 타입
export interface RaffleResult {
	id: string
	raffleId: string
	winnerId: string
	tierRank: number
	seed: string
	hash: string
	generatedAt: string
}

// 래플 관리 API 응답 타입들
export interface RaffleLockResponse {
	raffleId: string
	status: string
	lockedAt: string
}

export interface RaffleCancelResponse {
	raffleId: string
	status: string
	cancelledAt: string
	reason: string
}

// 추첨 관련 타입들
export interface DrawResponse {
	raffleId: string
	seed: {
		externalSeed: string
		participantListHash: string
		masterSeed: string
	}
	assignments: Assignment[]
	publishedAt: string
}

export interface Assignment {
	participantId: string
	displayName: string
	rank: number
	itemName: string
}

export interface RaffleResultResponse {
	raffleId: string
	assignments: Assignment[]
	seed: {
		externalSeed: string
		participantListHash: string
		masterSeed: string
	}
}

export interface VerifyBundleResponse {
	// TODO: 후순위 작성예정
	raffleId: string
	participants: unknown[]
	seed: unknown
	code: unknown
}

// 배송 관련 타입들
export interface ShippingInfoRequest {
	name: string
	phone: string
	zipcode: string
	address1: string
	address2?: string
}

export interface ShippingUpdateRequest {
	carrier?: string
	trackingNo?: string
	status: 'PENDING' | 'INFO_SUBMITTED' | 'SHIPPED' | 'DELIVERED'
}

export interface ShippingInfo {
	name?: string
	phone?: string
	zipcode?: string
	address1?: string
	address2?: string
	carrier?: string
	trackingNo?: string
	status: 'PENDING' | 'INFO_SUBMITTED' | 'SHIPPED' | 'DELIVERED'
	updatedAt?: string
}

export interface Winner {
	participantId: string
	displayName: string
	rank: number
	itemName: string
	shipping: ShippingInfo
}

export interface WinnersResponse {
	raffleId: string
	winners: Winner[]
}

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
	externalSeedDescription: string
	externalSeed: string | null
	tiers: TierResponse[]
	status: string
	createdAt: string
	participantsCount: number
}

export interface TierResponse {
	rank: number
	name: string
	imageUrl: string
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
	externalSeedDescription: string
	tiers: TierRequest[]
}

// 래플 생성 응답 타입 (API 명세서에 맞게 수정)
export interface CreateRaffleResponse {
	id: string
	title: string
	description: string
	entryFee: number
	minParticipants: number
	maxParticipants: number
	deadlineAt: string
	imageUrl: string
	externalSeedDescription: string
	tiers: TierResponse[]
	status: string
	createdAt: string
}

export interface TierRequest {
	rank: number
	name: string
	quantity: number
	imageUrl: string
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

// 래플 참여 요청 타입
export interface ParticipateRequest {
	displayName: string
}

// 래플 참여 응답 타입
export interface ParticipateResponse {
	participantId: string
	raffleId: string
	displayName: string
	joinedAt: string
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
export interface DrawRequest {
	externalSeed: string
}

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

// 추첨 결과 조회용 Assignment (participantId 없음)
export interface ResultAssignment {
	displayName: string
	rank: number
	itemName: string
}

// 추첨 미리보기 응답 타입
export interface RafflePreviewResponse {
	raffleId: string
	externalSeed: string
	assignments: Assignment[]
}

export interface RaffleResultResponse {
	raffleId: string
	assignments: ResultAssignment[]
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
	id?: string
	name: string
	phone: string
	zipcode: string
	address1: string
	address2?: string
	isDefault?: boolean
}

// 배송지 목록 조회 응답 타입
export interface AddressItem {
	addressId: string
	name: string
	phone: string
	zipcode: string
	address1: string
	address2?: string
	label?: string
	isDefault: boolean
	createdAt: string
	updatedAt?: string // GET 상세 조회 시 포함
}

export interface AddressListResponse {
	addresses: AddressItem[]
}

// POST /my/addresses 응답
export interface CreateAddressResponse {
	addressId: string
	name: string
	phone: string
	zipcode: string
	address1: string
	address2?: string
	label?: string
	isDefault: boolean
	createdAt: string
	updatedAt: string
}

// PUT /my/addresses/{addressId} 응답
export interface UpdateAddressResponse {
	addressId: string
	name: string
	phone: string
	zipcode: string
	address1: string
	address2?: string
	label?: string
	isDefault: boolean
	updatedAt: string
}

// DELETE /my/addresses/{addressId} 응답
export interface DeleteAddressResponse {
	message: string
	deletedAddressId: string
}

// PATCH /my/addresses/{addressId}/default 응답
export interface SetDefaultAddressResponse {
	message: string
	addressId: string
	isDefault: boolean
}

export interface ShippingInfoResponse {
	winnerId: string
	raffleId: string
	status: string
	updatedAt: string
}

export interface ShippingUpdateResponse {
	winnerId: string
	raffleId: string
	carrier: string
	trackingNo: string
	status: string
	updatedAt: string
}

export interface ShippingUpdateRequest {
	carrier: string
	trackingNo: string
	status: 'PENDING' | 'SAVED' | 'SHIPPED' | 'DELIVERED'
}

export interface ShippingInfo {
	name?: string
	phone?: string
	zipcode?: string
	address1?: string
	address2?: string
	carrier?: string
	trackingNo?: string
	status: 'PENDING' | 'SAVED' | 'SHIPPED' | 'DELIVERED'
	updatedAt?: string
}

// API 응답용 Winner 타입 (배송 정보 포함)
export interface Winner {
	participantId: string
	displayName: string
	rank: number
	itemName: string
	shipping: {
		name?: string
		phone?: string // 마스킹 처리됨 (예: "010****5678")
		zipcode?: string
		address1?: string // 마스킹 처리됨 (예: "서울특별시 강남구 테헤란로 ***")
		address2?: string
		carrier?: string
		trackingNo?: string
		status: string
		updatedAt?: string
	}
}

export interface WinnersResponse {
	raffleId: string
	winners: Winner[]
}

// 참여자 목록 조회 응답 타입
export interface ParticipantsResponse {
	raffleId: string
	participants: Participant[]
	count: number
}

export interface Participant {
	participantId: string
	displayName: string
	joinedAt: string
}

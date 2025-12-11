// 래플 관련 타입 정의

// GET /raffles 응답 (개별 항목)
export interface RaffleSummaryResponse {
	raffleId: string
	title: string
	entryFee: number
	status: string
	imageUrl: string
	deadlineAt: string
}

// GET /raffles 응답 (배열)
export type GetRafflesResponse = RaffleSummaryResponse[]

// GET /raffles/{raffleId} 응답
export interface RaffleDetailResponse {
	raffleId: string
	title: string
	description: string
	entryFee: number
	minParticipants: number
	maxParticipants: number
	deadlineAt: string
	imageUrl: string
	externalSeedDescription: string
	externalSeed?: string
	tiers: PrizeResponse[]
	status: string
	createdAt: string
	lockedAt?: string
	cancelledAt?: string
	reason?: string
	participantsCount: number
	participantDisplayNames?: string[]
}

// POST /raffles 요청
export interface CreateRaffleRequest {
	title: string
	description: string
	entryFee: number
	minParticipants: number
	maxParticipants: number
	imageUrl: string
	deadlineAt: string
	externalSeedDescription?: string
	tiers: PrizeRequest[]
}

// 경품 정보 (요청)
export interface PrizeRequest {
	rank: number
	name: string
	quantity: number
	imageUrl: string
}

// POST /raffles 응답
export interface CreateRaffleResponse {
	raffleId: string
	title: string
	description: string
	entryFee: number
	minParticipants: number
	maxParticipants: number
	deadlineAt: string
	imageUrl: string
	externalSeedDescription: string
	externalSeed?: string
	tiers: PrizeResponse[]
	status: string
	createdAt: string
	lockedAt?: string
	cancelledAt?: string
	reason?: string
	participantsCount: number
	participantDisplayNames?: string[]
}

// 경품 정보 (응답)
export interface PrizeResponse {
	rank: number
	name: string
	imageUrl: string
	quantity: number
}

// 필터 타입
export type RaffleFilter = 'all' | 'active' | 'closed'

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

// POST /raffles/{raffleId}/participants 요청
export interface ParticipateRequest {
	displayName: string
}

// POST /raffles/{raffleId}/participants 응답
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

// POST /raffles/{raffleId}/lock 응답
export interface RaffleLockResponse {
	raffleId: string
	status: string
	lockedAt: string
}

// POST /raffles/{raffleId}/cancel 응답
export interface RaffleCancelResponse {
	raffleId: string
	title: string
	description: string
	entryFee: number
	minParticipants: number
	maxParticipants: number
	deadlineAt: string
	imageUrl: string
	externalSeedDescription: string
	externalSeed?: string
	tiers: PrizeResponse[]
	status: string
	createdAt: string
	lockedAt?: string
	cancelledAt?: string
	reason?: string
	participantsCount: number
	participantDisplayNames?: string[]
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
		status: 'PENDING' | 'SAVED' | 'SHIPPED' | 'DELIVERED' // 명세 정합성
		updatedAt?: string
	}
}

export interface WinnersResponse {
	raffleId: string
	winners: Winner[]
}

// GET /raffles/{raffleId}/participants 응답
export interface ParticipantsResponse {
	raffleId: string
	participants: Participant[]
	count: number
}

// 참여자 정보
export interface Participant {
	participantId: string
	displayName: string
	joinedAt: string
}

// 내 결과 조회 (GET /my/raffles/{raffleId}/result)
export interface MyRaffleSelfResultResponse {
	raffleId: string
	raffleName: string
	status: string
	myParticipation: {
		participantId: string
		displayName: string
		joinedAt: string
	}
	isWinner: boolean
	winInfo: {
		rank: number
		prizeName: string
		prizeImageUrl?: string
	} | null
	shippingRequired: boolean
	shippingSubmitted: boolean
}

// 내 당첨 목록 (GET /my/raffles/wins)
export interface MyWinItem {
	raffleId: string
	raffleName: string
	rank: number
	prizeName: string
	prizeImageUrl?: string
	shippingStatus: 'PENDING' | 'SAVED' | 'SHIPPED' | 'DELIVERED'
	drawnAt: string
}

export interface MyWinsResponse {
	wins: MyWinItem[]
}

// 츄파춥스 이벤트 관련 타입 (OpenAPI v2 Spec)

// 기프트콘 정보
export interface V2GiftconInfo {
	code: string
	expiresAt: string
	registrationUrl: string
	howToUse?: string
}

// 당첨 상품 정보
export interface V2PrizeInfo {
	rank: number
	name: string
	imageUrl?: string
	giftcon?: V2GiftconInfo
}

// POST /v2/raffles/{raffleId}/participants 요청
export interface ParticipateV2Request {
	displayName?: string
}

// POST /v2/raffles/{raffleId}/participants 응답
export interface V2ParticipantResponse {
	participantId: string
	raffleId: string
	displayName: string
	joinedAt: string
}

// GET /v2/raffles/{raffleId}/drawn 응답 (폴링)
export interface V2DrawnStatusResponse {
	raffleId: string
	isDrawn: boolean
	drawnAt?: string
}

// GET /v2/my/raffles/{raffleId}/result 응답
export interface V2MyRaffleResultResponse {
	raffleId: string
	raffleName: string
	isWinner: boolean | null // true: 당첨, false: 낙첨, null: 미발표
	prize: V2PrizeInfo | null
	message?: string
}
// Legacy alias for compatibility during refactor (optional, or just remove usages)
export type MyRaffleResultV2Response = V2MyRaffleResultResponse
export type ParticipateV2Response = V2ParticipantResponse
export type WinnersPresentResponse = V2DrawnStatusResponse

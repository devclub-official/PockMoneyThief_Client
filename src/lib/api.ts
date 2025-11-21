import { api } from '@/lib/api-client'
import type {
	RaffleListResponse,
	RaffleDetailResponse,
	CreateRaffleRequest,
	CreateRaffleResponse,
	RaffleLockResponse,
	RaffleCancelResponse,
	DrawRequest,
	DrawResponse,
	RaffleResultResponse,
	VerifyBundleResponse,
	ShippingInfoRequest,
	ShippingInfoResponse,
	ShippingUpdateRequest,
	ShippingUpdateResponse,
	WinnersResponse,
	ParticipateRequest,
	ParticipateResponse,
	ParticipantsResponse,
	RafflePreviewResponse,
	AddressItem,
	CreateAddressResponse,
	UpdateAddressResponse,
	DeleteAddressResponse,
	SetDefaultAddressResponse,
	AddressListResponse,
} from '@/types'

// Raffle API
export const raffleApi = {
	// 기본 CRUD
	getList: () => api.get('raffles').json<RaffleListResponse>(),
	getById: (id: string) => api.get(`raffles/${id}`).json<RaffleDetailResponse>(),
	create: (data: CreateRaffleRequest) =>
		api.post('raffles', { json: data }).json<CreateRaffleResponse>(),

	// 래플 관리
	lock: (id: string) => api.post(`raffles/${id}/lock`).json<RaffleLockResponse>(),
	cancel: (id: string) => api.post(`raffles/${id}/cancel`).json<RaffleCancelResponse>(),

	// 추첨 관련
	draw: (id: string, data: DrawRequest) =>
		api.post(`raffles/${id}/draw`, { json: data }).json<DrawResponse>(),
	getResult: (id: string) => api.get(`raffles/${id}/result`).json<RaffleResultResponse>(),
	getPreview: (id: string) => api.get(`raffles/${id}/preview`).json<RafflePreviewResponse>(),
	getVerifyBundle: (id: string) =>
		api.get(`raffles/${id}/verify/bundle`).json<VerifyBundleResponse>(),

	// 당첨자 관리
	getWinners: (id: string) => api.get(`raffles/${id}/winners`).json<WinnersResponse>(),

	// 내가 참여한 래플 목록 조회
	getMyParticipatedRaffles: () =>
		api.get(`my/raffles/participated`).json<{
			raffles: {
				raffleId: string
				title: string
				entryFee: number
				imageUrl: string
				status: string
				deadlineAt: string
				myDisplayName: string
				joinedAt: string
			}[]
		}>(),
}

// 참여자 관리 API
export const participantApi = {
	// 래플 참여
	participate: (raffleId: string, data: ParticipateRequest) =>
		api.post(`raffles/${raffleId}/participants`, { json: data }).json<ParticipateResponse>(),

	// 참여자 목록 조회
	getParticipants: (raffleId: string) =>
		api.get(`raffles/${raffleId}/participants`).json<ParticipantsResponse>(),
}

// 배송 관리 API
export const shippingApi = {
	// 당첨자 배송 정보 제출
	submitShippingInfo: (raffleId: string, addressId: string) =>
		api.post(`my/shipping`, { json: { raffleId, addressId } }).json<ShippingInfoResponse>(),

	// 배송 정보 수정 (호스트/관리자)
	updateShippingInfo: (raffleId: string, participantId: string, data: ShippingUpdateRequest) =>
		api
			.patch(`raffles/${raffleId}/winners/${participantId}/shipping`, { json: data })
			.json<ShippingUpdateResponse>(),
}

// 주소록 API
export const addressApi = {
	/**
	 * 배송지 목록 조회
	 * 실제 API 엔드포인트: GET /my/addresses
	 */
	getList: async (): Promise<AddressItem[]> => {
		const response = await api.get('my/addresses').json<AddressListResponse>()
		return response.addresses
	},

	/**
	 * 배송지 상세 조회
	 * 실제 API 엔드포인트: GET /my/addresses/{addressId}
	 */
	getById: (id: string): Promise<AddressItem> => {
		return api.get(`my/addresses/${id}`).json<AddressItem>()
	},

	/**
	 * 배송지 추가
	 * 실제 API 엔드포인트: POST /my/addresses
	 */
	create: (data: ShippingInfoRequest): Promise<CreateAddressResponse> => {
		const { id, ...body } = data
		return api.post('my/addresses', { json: body }).json<CreateAddressResponse>()
	},

	/**
	 * 배송지 수정
	 * 실제 API 엔드포인트: PUT /my/addresses/{addressId}
	 */
	update: (id: string, data: ShippingInfoRequest): Promise<UpdateAddressResponse> => {
		const { id: _, isDefault, ...body } = data
		return api.put(`my/addresses/${id}`, { json: body }).json<UpdateAddressResponse>()
	},

	/**
	 * 배송지 삭제
	 * 실제 API 엔드포인트: DELETE /my/addresses/{addressId}
	 */
	delete: (id: string): Promise<DeleteAddressResponse> => {
		return api.delete(`my/addresses/${id}`).json<DeleteAddressResponse>()
	},

	/**
	 * 기본 배송지 설정
	 * 실제 API 엔드포인트: PATCH /my/addresses/{addressId}/default
	 */
	setDefault: (addressId: string): Promise<SetDefaultAddressResponse> => {
		return api.patch(`my/addresses/${addressId}/default`).json<SetDefaultAddressResponse>()
	},
}

// Login API (로그인 기능)
export const loginApi = {
	// checkOnboardingStatus: () => api.get('users/onboarding-status').json<boolean>(),
	checkOnboardingStatus: () => new Promise((resolve) => setTimeout(() => resolve(true), 2000)),
	logout: () => api.post('logout').json<void>(),
}

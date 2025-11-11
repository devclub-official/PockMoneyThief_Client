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
	getList: () => api.get('my/addresses').json<AddressItem[]>(),
	// getList: async (): Promise<AddressItem[]> => {
	// 	return new Promise((resolve) =>
	// 		setTimeout(
	// 			() =>
	// 				resolve([
	// 					{
	// 						addressId: 'addr_abc123',
	// 						name: '박민호',
	// 						phone: '010-1234-5678',
	// 						zipcode: '04524',
	// 						address1: '서울특별시 중구 세종대로 110',
	// 						address2: '12층',
	// 						label: '집',
	// 						isDefault: true,
	// 						createdAt: '2025-11-10T14:23:45Z',
	// 					},
	// 					{
	// 						addressId: 'addr_8e7b41c9d2',
	// 						name: '박민호',
	// 						phone: '010-9876-5432',
	// 						zipcode: '06236',
	// 						address1: '서울특별시 강남구 테헤란로 231',
	// 						address2: '3층 위워크 삼성점',
	// 						label: '회사',
	// 						isDefault: false,
	// 						createdAt: '2025-10-25T09:11:32Z',
	// 					},
	// 					{
	// 						addressId: 'addr_5a0c72f4b1',
	// 						name: '박민호',
	// 						phone: '010-2222-3333',
	// 						zipcode: '21990',
	// 						address1: '인천광역시 연수구 송도과학로 32',
	// 						address2: 'A동 1502호',
	// 						label: '부모님댁',
	// 						isDefault: false,
	// 						createdAt: '2025-09-15T17:42:10Z',
	// 					},
	// 				]),
	// 			1500,
	// 		),
	// 	)
	// 	// return await api.get('my/addresses').json<AddressItem[]>()
	// },

	/**
	 * 배송지 추가
	 * 실제 API 엔드포인트: POST /my/addresses
	 */
	create: (data: ShippingInfoRequest): Promise<void> => {
		const { id, ...body } = data
		return api.post('my/addresses', { json: body }).json<void>()
	},

	/**
	 * 배송지 수정
	 * 실제 API 엔드포인트: PUT /my/addresses/{addressId}
	 */
	update: (id: string, data: ShippingInfoRequest): Promise<void> => {
		const { id: _, isDefault, ...body } = data
		return api.put(`my/addresses/${id}`, { json: body }).json<void>()
	},

	/**
	 * 배송지 삭제
	 * 실제 API 엔드포인트: DELETE /my/addresses/{addressId}
	 */
	delete: (id: string): Promise<void> => {
		return api.delete(`my/addresses/${id}`).json<void>()
	},

	/**
	 * 기본 배송지 설정
	 * 실제 API 엔드포인트: PATCH /my/addresses/{addressId}/default
	 */
	setDefault: (addressId: string): Promise<void> => {
		return api.patch(`my/addresses/${addressId}/default`).json<void>()
	},
}

// Login API (로그인 기능)
export const loginApi = {
	// checkOnboardingStatus: () => api.get('users/onboarding-status').json<boolean>(),
	checkOnboardingStatus: () => new Promise((resolve) => setTimeout(() => resolve(true), 2000)),
	logout: () => api.post('logout').json<void>(),
}

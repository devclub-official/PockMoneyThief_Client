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
	submitShippingInfo: (raffleId: string, data: ShippingInfoRequest) =>
		// deprecated된 endpoint
		// TODO:추후 변경되는 endpoint로 수정 필요
		api.post(`raffles/${raffleId}/winners/shipping`, { json: data }).json<ShippingInfoResponse>(),

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
	 * 실제 API 엔드포인트: GET /users/me/addresses
	 */
	getList: (): Promise<ShippingInfoRequest[]> => {
		// TODO: 실제 API 연동 시 아래 주석 해제하고 임시 구현 제거
		// return api.get('users/me/addresses').json<ShippingInfoRequest[]>()

		// 임시 구현 (개발용)
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve([
					{
						id: 'addr-1',
						name: '집',
						phone: '010-1234-5678',
						zipcode: '12345',
						address1: '서울시 강남구 테헤란로 123',
						address2: '101동 101호',
						isDefault: true,
					},
					{
						id: 'addr-2',
						name: '회사',
						phone: '010-1234-5679',
						zipcode: '12346',
						address1: '서울시 강남구 테헤란로 124',
						address2: '101동 102호',
						isDefault: false,
					},
					{
						id: 'addr-3',
						name: '친구집',
						phone: '010-1234-5680',
						zipcode: '12346',
						address1: '서울시 강남구 테헤란로 125',
						address2: '101동 102호',
						isDefault: false,
					},
				])
			}, 300)
		})
	},

	/**
	 * 배송지 추가
	 * 실제 API 엔드포인트: POST /users/me/addresses
	 */
	create: (data: ShippingInfoRequest): Promise<ShippingInfoRequest> => {
		// TODO: 실제 API 연동 시 아래 주석 해제하고 임시 구현 제거
		// return api.post('users/me/addresses', { json: data }).json<ShippingInfoRequest>()

		// 임시 구현 (개발용)
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					...data,
					id: `addr-${Date.now()}`,
					isDefault: false,
				})
			}, 500)
		})
	},

	/**
	 * 배송지 수정
	 * 실제 API 엔드포인트: PATCH /users/me/addresses/:id
	 */
	update: (id: string, data: ShippingInfoRequest): Promise<ShippingInfoRequest> => {
		// TODO: 실제 API 연동 시 아래 주석 해제하고 임시 구현 제거
		// return api.patch(`users/me/addresses/${id}`, { json: data }).json<ShippingInfoRequest>()

		// 임시 구현 (개발용)
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({ ...data, id })
			}, 500)
		})
	},

	/**
	 * 배송지 삭제
	 * 실제 API 엔드포인트: DELETE /users/me/addresses/:id
	 */
	delete: (id: string): Promise<void> => {
		// TODO: 실제 API 연동 시 아래 주석 해제하고 임시 구현 제거
		// return api.delete(`users/me/addresses/${id}`).json<void>()

		// 임시 구현 (개발용)
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve()
			}, 500)
		})
	},
}

// Login API (로그인 기능)
export const loginApi = {
	// checkOnboardingStatus: () => api.get('users/onboarding-status').json<boolean>(),
	checkOnboardingStatus: () => new Promise((resolve) => setTimeout(() => resolve(false), 2000)),
}

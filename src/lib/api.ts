import { api } from '@/lib/api-client'
import type {
	RaffleListResponse,
	RaffleDetailResponse,
	CreateRaffleRequest,
	CreateRaffleResponse,
	RaffleLockResponse,
	RaffleCancelResponse,
	DrawResponse,
	RaffleResultResponse,
	VerifyBundleResponse,
	ShippingInfoRequest,
	ShippingUpdateRequest,
	WinnersResponse,
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
	draw: (id: string) => api.post(`raffles/${id}/draw`).json<DrawResponse>(),
	getResult: (id: string) => api.get(`raffles/${id}/result`).json<RaffleResultResponse>(),
	getVerifyBundle: (id: string) =>
		api.get(`raffles/${id}/verify/bundle`).json<VerifyBundleResponse>(),

	// 당첨자 관리
	getWinners: (id: string) => api.get(`raffles/${id}/winners`).json<WinnersResponse>(),
}

// 배송 관리 API
export const shippingApi = {
	// 당첨자 배송 정보 제출
	submitShippingInfo: (raffleId: string, participantId: string, data: ShippingInfoRequest) =>
		api.post(`raffles/${raffleId}/winners/${participantId}/shipping`, { json: data }).json<void>(),

	// 배송 정보 수정 (호스트/관리자)
	updateShippingInfo: (raffleId: string, participantId: string, data: ShippingUpdateRequest) =>
		api.patch(`raffles/${raffleId}/winners/${participantId}/shipping`, { json: data }).json<void>(),
}

// Login API (로그인 기능)
export const loginApi = {
	// checkOnboardingStatus: () => api.get('users/onboarding-status').json<boolean>(),
	checkOnboardingStatus: () => new Promise((resolve) => setTimeout(() => resolve(false), 2000)),
}

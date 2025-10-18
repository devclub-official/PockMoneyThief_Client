import { api } from '@/lib/api-client'
import type {
	RaffleListResponse,
	RaffleDetailResponse,
	CreateRaffleRequest,
	RaffleApiResponse,
} from '@/types'

// Raffle API
export const raffleApi = {
	getList: () => api.get('raffles').json<RaffleListResponse>(),
	getById: (id: string) => api.get(`raffles/${id}`).json<RaffleDetailResponse>(),
	create: (data: CreateRaffleRequest) =>
		api.post('raffles', { json: data }).json<RaffleApiResponse>(),
}

// TODO: 추후 사용 예정
// export const entryApi = {
// 	participate: (raffleId: string) => api.post(`raffles/${raffleId}/entries`).json<unknown>(),
// }

// export const shipmentApi = {
// 	update: (id: string, payload: unknown) =>
// 		api.patch(`shipments/${id}`, { json: payload }).json<unknown>(),
// }

// Login API (로그인 기능)
export const loginApi = {
	// checkOnboardingStatus: () => api.get('users/onboarding-status').json<boolean>(),
	checkOnboardingStatus: () => new Promise((resolve) => setTimeout(() => resolve(false), 2000)),
}

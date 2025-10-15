import { api } from '@/lib/api-client'
import type { RaffleListResponse } from '@/types'

// Raffle API
export const raffleApi = {
	getList: () => api.get('raffles').json<RaffleListResponse>(),
}

export const entryApi = {
	participate: (raffleId: string) => api.post(`raffles/${raffleId}/entries`).json<unknown>(),
}

export const shipmentApi = {
	update: (id: string, payload: unknown) =>
		api.patch(`shipments/${id}`, { json: payload }).json<unknown>(),
}

export const loginApi = {
	// checkOnboardingStatus: () => api.get('users/onboarding-status').json<boolean>(),
	checkOnboardingStatus: () => new Promise((resolve) => setTimeout(() => resolve(false), 2000)),
}

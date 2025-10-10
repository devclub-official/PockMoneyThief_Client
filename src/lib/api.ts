import { api } from '@/lib/api-client'

// Basic API stubs: typed wrappers around ky for future integration
export const raffleApi = {
	getList: () => api.get('raffles').json<unknown[]>(),
	getById: (id: string) => api.get(`raffles/${id}`).json<unknown>(),
	create: (payload: unknown) => api.post('raffles', { json: payload }).json<unknown>(),
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
	checkOnboardingStatus: () => new Promise((resolve) => setTimeout(() => resolve(true), 2000)),
}

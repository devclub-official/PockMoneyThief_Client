import { api } from '@/lib/api-client'
import type {
	GetRafflesResponse,
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
	MyRaffleSelfResultResponse,
	MyWinsResponse,
} from '@/types'
import type { MyRaffle, ParticipatedRaffle } from '@/types/dashboard'

// Raffle API
export const raffleApi = {
	// 기본 CRUD
	getList: () => api.get('raffles').json<GetRafflesResponse>(),
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
	getPreview: (id: string, externalSeed: string) =>
		api
			.get(`raffles/${id}/preview`, { searchParams: { externalSeed } })
			.json<RafflePreviewResponse>(),
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

	// 당첨자 배송 정보 제출 (addressId 사용)
	submitShippingInfoByAddressId: (raffleId: string, addressId: string) =>
		api.post('my/shipping', { json: { raffleId, addressId } }).json<ShippingInfoResponse>(),

	// 배송 정보 수정 (호스트/관리자)
	updateShippingInfo: (raffleId: string, participantId: string, data: ShippingUpdateRequest) =>
		api
			.patch(`raffles/${raffleId}/winners/${participantId}/shipping`, { json: data })
			.json<ShippingUpdateResponse>(),
}

// My API (사용자 본인 관련)
export const myApi = {
	// 내가 등록한 추첨 목록
	getHostedRaffles: async (): Promise<MyRaffle[]> => {
		const res = await api.get('my/raffles/hosted').json<{
			raffles: Array<{
				raffleId: string
				title: string
				entryFee: number
				imageUrl: string
				status: string
				deadlineAt: string
				participantsCount: number
			}>
		}>()

		return res.raffles.map((r) => ({
			id: r.raffleId,
			title: r.title,
			imageUrl: r.imageUrl,
			status:
				r.status === 'LOCKED' || r.status === 'DRAWN' || r.status === 'CANCELLED'
					? (r.status as MyRaffle['status'])
					: ('PUBLISHED' as MyRaffle['status']),
			type: 'single',
			currentParticipants: Math.max(0, Number(r.participantsCount) || 0),
			maxParticipants: Math.max(0, Number(r.participantsCount) || 0),
			deadlineAt: r.deadlineAt,
			winners: undefined,
		}))
	},

	// 내가 참여한 추첨 목록
	getParticipatedRaffles: async (): Promise<ParticipatedRaffle[]> => {
		const res = await api.get('my/raffles/participated').json<{
			raffles: Array<{
				raffleId: string
				title: string
				entryFee: number
				imageUrl: string
				status: string
				deadlineAt: string
				myDisplayName: string
				joinedAt: string
			}>
		}>()

		return res.raffles.map((r) => ({
			id: r.raffleId,
			title: r.title,
			imageUrl: r.imageUrl,
			status:
				r.status === 'PUBLISHED' ||
				r.status === 'LOCKED' ||
				r.status === 'DRAWN' ||
				r.status === 'CANCELLED'
					? (r.status as ParticipatedRaffle['status'])
					: ('PUBLISHED' as ParticipatedRaffle['status']),
			displayName: r.myDisplayName,
			entryFee: Number(r.entryFee) || 0,
			deadlineAt: r.deadlineAt,
			isWinner: false,
			itemName: undefined,
			shippingStatus: undefined,
			participatedAt: r.joinedAt,
		}))
	},

	// 특정 래플의 내 결과
	getSelfResult: (raffleId: string) =>
		api.get(`my/raffles/${raffleId}/result`).json<MyRaffleSelfResultResponse>(),

	// 내 당첨 목록
	getWins: () => api.get('my/raffles/wins').json<MyWinsResponse>(),
}

// 주소록 API
export const addressApi = {
	/**
	 * 배송지 목록 조회
	 * 실제 API 엔드포인트: GET /my/addresses
	 */
	getList: async (): Promise<ShippingInfoRequest[]> => {
		const response = await api.get('my/addresses').json<{
			addresses: Array<{
				id: string
				name: string
				phone: string
				zipcode: string
				address1: string
				address2?: string
				isDefault?: boolean
			}>
		}>()
		return response.addresses.map((addr) => ({
			id: addr.id,
			name: addr.name,
			phone: addr.phone,
			zipcode: addr.zipcode,
			address1: addr.address1,
			address2: addr.address2,
			isDefault: addr.isDefault,
		}))
	},

	/**
	 * 배송지 상세 조회
	 * 실제 API 엔드포인트: GET /my/addresses/{addressId}
	 */
	getById: (id: string): Promise<ShippingInfoRequest> => {
		return api.get(`my/addresses/${id}`).json<ShippingInfoRequest>()
	},

	/**
	 * 배송지 추가
	 * 실제 API 엔드포인트: POST /my/addresses
	 */
	create: (data: ShippingInfoRequest): Promise<ShippingInfoRequest> => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, ...body } = data
		return api.post('my/addresses', { json: body }).json<ShippingInfoRequest>()
	},

	/**
	 * 배송지 수정
	 * 실제 API 엔드포인트: PUT /my/addresses/{addressId}
	 */
	update: (id: string, data: ShippingInfoRequest): Promise<ShippingInfoRequest> => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id: _, isDefault, ...body } = data
		return api.put(`my/addresses/${id}`, { json: body }).json<ShippingInfoRequest>()
	},

	/**
	 * 배송지 삭제
	 * 실제 API 엔드포인트: DELETE /my/addresses/{addressId}
	 */
	delete: (id: string): Promise<{ message: string }> => {
		return api.delete(`my/addresses/${id}`).json<{ message: string }>()
	},

	/**
	 * 기본 배송지 설정
	 * 실제 API 엔드포인트: PATCH /my/addresses/{addressId}/default
	 */
	setDefault: (addressId: string): Promise<{ id: string; isDefault: boolean }> => {
		return api.patch(`my/addresses/${addressId}/default`).json<{ id: string; isDefault: boolean }>()
	},
}

// Login API (로그인 기능)
export const loginApi = {
	// checkOnboardingStatus: () => api.get('users/onboarding-status').json<boolean>(),
	checkOnboardingStatus: () => new Promise((resolve) => setTimeout(() => resolve(true), 2000)),
	logout: () => api.post('logout').json<void>(),
}

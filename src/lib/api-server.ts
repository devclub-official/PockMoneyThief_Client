import type { RaffleListResponse, MyRaffleSelfResultResponse, MyWinsResponse } from '@/types'
import type { MyRaffle, ParticipatedRaffle } from '@/types/dashboard'
import { raffleApi, myApi } from '@/lib/api'

// 서버 컴포넌트용 API 함수들 (React Query 없이 직접 호출)
export const serverApiClient = {
	// 추첨 목록 조회 (서버에서 prefetch)
	getRaffles: async (): Promise<RaffleListResponse> => {
		// 서버 전용 래퍼: 실제 호출은 lib/api.ts로 일원화
		return raffleApi.getList().catch(() => ({ items: [] }))
	},

	/**
	 * 특정 추첨의 내 결과 (서버 전용 래퍼)
	 */
	getMyRaffleSelfResult: async (raffleId: string): Promise<MyRaffleSelfResultResponse> => {
		return myApi.getSelfResult(raffleId)
	},

	/**
	 * 내 당첨 목록 (서버 전용 래퍼)
	 */
	getMyWins: async (): Promise<MyWinsResponse> => {
		return myApi.getWins().catch(() => ({ wins: [] }))
	},

	/**
	 * 내가 등록한 추첨 목록 (서버 전용 래퍼)
	 */
	getMyHostedRaffles: async (): Promise<MyRaffle[]> => {
		return myApi.getHostedRaffles().catch(() => [])
	},

	/**
	 * 내가 참여한 추첨 목록 (서버 전용 래퍼)
	 */
	getMyParticipatedRaffles: async (): Promise<ParticipatedRaffle[]> => {
		return myApi.getParticipatedRaffles().catch(() => [])
	},
}

import { useQuery } from '@tanstack/react-query'
import { myApi } from '@/lib/api'
import type { MyRaffle, ParticipatedRaffle } from '@/types/dashboard'
import type { MyWinItem } from '@/types'

/**
 * 내가 등록한 추첨 목록 조회
 */
export function useMyRaffles() {
	return useQuery<MyRaffle[]>({
		queryKey: ['myRaffles', 'hosted'],
		queryFn: () => myApi.getHostedRaffles(),
		retry: 1,
	})
}

/**
 * 내가 참여한 추첨 목록 조회
 */
export function useParticipatedRaffles() {
	return useQuery<ParticipatedRaffle[]>({
		queryKey: ['myRaffles', 'participated'],
		queryFn: () => myApi.getParticipatedRaffles(),
		retry: 1,
	})
}

/**
 * 내 당첨 목록 조회
 */
export function useWins() {
	return useQuery<{ wins: MyWinItem[] }>({
		queryKey: ['myRaffles', 'wins'],
		queryFn: () => myApi.getWins(),
		retry: 1,
	})
}

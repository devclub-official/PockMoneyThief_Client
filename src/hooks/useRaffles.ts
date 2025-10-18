import { useQuery } from '@tanstack/react-query'
import { raffleApi } from '@/lib/api'
import type { RaffleListResponse } from '@/types'

// 추첨 목록 조회
export function useRaffles() {
	return useQuery<RaffleListResponse>({
		queryKey: ['raffles'],
		queryFn: raffleApi.getList,
	})
}


import { useQuery } from '@tanstack/react-query'
import { raffleApi } from '@/lib/api'
import type { RaffleDetailResponse } from '@/types'

export function useRaffleDetail(id: string) {
	return useQuery<RaffleDetailResponse>({
		queryKey: ['raffle', id],
		queryFn: () => raffleApi.getById(id),
		enabled: !!id,
		retry: 1, // 1번만 재시도
		retryDelay: 1000, // 1초 후 재시도
	})
}

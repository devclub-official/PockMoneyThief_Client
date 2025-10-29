import { useQuery } from '@tanstack/react-query'
import { raffleApi } from '@/lib/api'
import type { RaffleDetailResponse } from '@/types'

export function useRaffleDetail(id: string) {
	return useQuery<RaffleDetailResponse>({
		queryKey: ['raffle', id],
		queryFn: () => raffleApi.getById(id),
		enabled: !!id,
	})
}

import { useQuery } from '@tanstack/react-query'
import { raffleApi } from '@/lib/api'
import type { GetRafflesResponse } from '@/types'

// 추첨 목록 조회
export function useRaffles() {
	return useQuery<GetRafflesResponse>({
		queryKey: ['raffles'],
		queryFn: raffleApi.getList,
	})
}

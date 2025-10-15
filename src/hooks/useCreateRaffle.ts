import { useMutation, useQueryClient } from '@tanstack/react-query'
import { raffleApi } from '@/lib/api'
import type { CreateRaffleRequest, RaffleApiResponse } from '@/types'

export function useCreateRaffle() {
	const queryClient = useQueryClient()

	return useMutation<RaffleApiResponse, Error, CreateRaffleRequest>({
		mutationFn: (data: CreateRaffleRequest) => raffleApi.create(data),
		onSuccess: () => {
			// 래플 목록 캐시 무효화 (새로고침)
			queryClient.invalidateQueries({ queryKey: ['raffles'] })
		},
	})
}

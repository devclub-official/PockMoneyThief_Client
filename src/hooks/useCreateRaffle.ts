import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRaffleAction } from '@/app/actions/raffles'
import type { CreateRaffleRequest, CreateRaffleResponse } from '@/types'

/**
 * 래플 생성 훅
 * 서버 액션을 사용하여 인증 처리
 */
export function useCreateRaffle() {
	const queryClient = useQueryClient()

	return useMutation<CreateRaffleResponse, Error, CreateRaffleRequest>({
		mutationFn: (data: CreateRaffleRequest) => createRaffleAction(data),
		onSuccess: () => {
			// 래플 목록 캐시 무효화 (새로고침)
			queryClient.invalidateQueries({ queryKey: ['raffles'] })
		},
	})
}

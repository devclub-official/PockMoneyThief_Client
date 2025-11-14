import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addressApi } from '@/lib/api'
import { ShippingInfoRequest } from '@/types'

/**
 * 배송지 추가 훅
 * 성공 시 배송지 목록 자동 갱신
 */
export function useCreateAddress() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: ShippingInfoRequest) => addressApi.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['addresses'] })
		},
	})
}

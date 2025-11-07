import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addressApi } from '@/lib/api'
import { ShippingInfoRequest } from '@/types'

interface UpdateAddressMutationParams {
	id: string
	data: ShippingInfoRequest
}

/**
 * 배송지 수정 훅
 * 성공 시 배송지 목록 자동 갱신
 */
export function useUpdateAddress() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: UpdateAddressMutationParams) => addressApi.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['addresses'] })
		},
	})
}

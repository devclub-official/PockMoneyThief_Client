import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addressApi } from '@/lib/api'
import { ShippingInfoRequest } from '@/types'
import { useToast } from '@/components/ui/Toast'

interface UpdateAddressMutationParams {
	id: string
	data: ShippingInfoRequest
}

/**
 * 배송지 수정 훅
 * 성공 시 배송지 목록 자동 갱신
 */
export function useUpdateAddress() {
	const { addToast } = useToast()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: UpdateAddressMutationParams) => addressApi.update(id, data),
		onSuccess: () => {
			addToast({
				title: '수정 완료',
				description: '배송지 수정에 성공했습니다.',
				variant: 'success',
				duration: 3000,
			})
			queryClient.invalidateQueries({ queryKey: ['addresses'] })
		},
		onError: (error) => {
			addToast({
				title: '수정 실패',
				description: '배송지 수정에 실패했습니다. 다시 시도해주세요.',
				variant: 'error',
				duration: 4000,
			})
		},
	})
}

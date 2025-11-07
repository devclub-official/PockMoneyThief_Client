import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addressApi } from '@/lib/api'

/**
 * 배송지 삭제 훅
 * 성공 시 배송지 목록 자동 갱신
 */
export function useDeleteAddress() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => addressApi.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['addresses'] })
		},
	})
}

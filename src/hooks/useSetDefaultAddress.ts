import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addressApi } from '@/lib/api'
import { useToast } from '@/components/ui/Toast'

/**
 * 기본 배송지 설정 훅
 * 성공 시 배송지 목록 자동 갱신
 */
export function useSetDefaultAddress() {
	const { addToast } = useToast()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (addressId: string) => addressApi.setDefault(addressId),
		onSuccess: () => {
			addToast({
				title: '설정 완료',
				description: '기본 배송지로 설정되었습니다.',
				variant: 'success',
				duration: 3000,
			})
			queryClient.invalidateQueries({ queryKey: ['addresses'] })
		},
		onError: (error) => {
			addToast({
				title: '설정 실패',
				description: '기본 배송지 설정에 실패했습니다. 다시 시도해주세요.',
				variant: 'error',
				duration: 4000,
			})
		},
	})
}

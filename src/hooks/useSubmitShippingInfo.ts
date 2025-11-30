import { useMutation, useQueryClient } from '@tanstack/react-query'
import { shippingApi } from '@/lib/api'
import type { ShippingInfoRequest, ShippingInfoResponse } from '@/types'

interface SubmitShippingInfoVariables {
	raffleId: string
	addressId: string
}

export function useSubmitShippingInfo() {
	const queryClient = useQueryClient()

	return useMutation<ShippingInfoResponse, unknown, SubmitShippingInfoVariables>({
		mutationFn: ({ raffleId, addressId }) => shippingApi.submitShippingInfo(raffleId, addressId),
		onSuccess: (_data, variables) => {
			// 후속 데이터 무효화 (필요 시 조정)
			queryClient.invalidateQueries({ queryKey: ['participatedRaffles'] })
			queryClient.invalidateQueries({ queryKey: ['raffles', variables.raffleId, 'winners'] })
		},
	})
}

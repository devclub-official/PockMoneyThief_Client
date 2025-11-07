import { useSuspenseQuery } from '@tanstack/react-query'
import { addressApi } from '@/lib/api'
import type { ShippingInfoRequest } from '@/types'

/**
 * 배송지 목록 조회 훅
 * queryKey: ['addresses']
 */
export function useShippingAddresses() {
	return useSuspenseQuery<ShippingInfoRequest[]>({
		queryKey: ['addresses'],
		queryFn: () => addressApi.getList(),
	})
}

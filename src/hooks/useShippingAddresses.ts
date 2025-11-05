import { useSuspenseQuery } from '@tanstack/react-query'
import { addressApi } from '@/lib/api'
import type { ShippingInfoRequest } from '@/types'

export function useShippingAddresses() {
	return useSuspenseQuery<ShippingInfoRequest[]>({
		queryKey: ['shippingAddresses', 'me'],
		queryFn: () => addressApi.getMyAddresses(),
	})
}

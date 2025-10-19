import { memo, useMemo } from 'react'
import { Badge } from '@/components/ui/Badge'
import type { ShippingStatusBadgeProps } from '@/types/dashboard'
import { SHIPPING_STATUS } from '@/lib/constants/dashboard'

export const ShippingStatusBadge = memo(({ status }: ShippingStatusBadgeProps) => {
	const badgeConfig = useMemo(() => {
		switch (status) {
			case 'PENDING':
				return { variant: 'outline' as const, text: SHIPPING_STATUS.PENDING }
			case 'INFO_SUBMITTED':
				return { variant: 'secondary' as const, text: SHIPPING_STATUS.INFO_SUBMITTED }
			case 'SHIPPED':
				return { variant: 'default' as const, text: SHIPPING_STATUS.SHIPPED }
			case 'DELIVERED':
				return { variant: 'secondary' as const, text: SHIPPING_STATUS.DELIVERED }
			default:
				return { variant: 'outline' as const, text: SHIPPING_STATUS.UNKNOWN }
		}
	}, [status])

	return <Badge variant={badgeConfig.variant}>{badgeConfig.text}</Badge>
})

ShippingStatusBadge.displayName = 'ShippingStatusBadge'

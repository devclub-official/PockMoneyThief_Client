import { memo, useMemo } from 'react'
import { Badge } from '@/components/ui/Badge'
import type { ShippingStatusBadgeProps } from '@/types/dashboard'

export const ShippingStatusBadge = memo(({ status }: ShippingStatusBadgeProps) => {
	const badgeConfig = useMemo(() => {
		switch (status) {
			case 'PENDING':
				return { variant: 'outline' as const, text: '배송정보 대기' }
			case 'SAVED':
				return { variant: 'secondary' as const, text: '배송정보 완료' }
			case 'SHIPPED':
				return { variant: 'default' as const, text: '배송중' }
			case 'DELIVERED':
				return { variant: 'secondary' as const, text: '배송완료' }
			default:
				return { variant: 'outline' as const, text: '상태 없음' }
		}
	}, [status])

	return <Badge variant={badgeConfig.variant}>{badgeConfig.text}</Badge>
})

ShippingStatusBadge.displayName = 'ShippingStatusBadge'

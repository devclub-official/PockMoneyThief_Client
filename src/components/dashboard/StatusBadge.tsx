import { memo, useMemo } from 'react'
import { Badge } from '@/components/ui/Badge'
import type { StatusBadgeProps } from '@/types/dashboard'
import { RAFFLE_STATUS } from '@/lib/constants/dashboard'

export const StatusBadge = memo(({ status }: StatusBadgeProps) => {
	const badgeConfig = useMemo(() => {
		switch (status) {
			case 'PUBLISHED':
				return { variant: 'default' as const, text: RAFFLE_STATUS.PUBLISHED }
			case 'LOCKED':
				return { variant: 'secondary' as const, text: RAFFLE_STATUS.LOCKED }
			case 'COMPLETED':
				return { variant: 'secondary' as const, text: RAFFLE_STATUS.COMPLETED }
			case 'CANCELLED':
				return { variant: 'destructive' as const, text: RAFFLE_STATUS.CANCELLED }
			default:
				return { variant: 'outline' as const, text: RAFFLE_STATUS.UNKNOWN }
		}
	}, [status])

	return <Badge variant={badgeConfig.variant}>{badgeConfig.text}</Badge>
})

StatusBadge.displayName = 'StatusBadge'

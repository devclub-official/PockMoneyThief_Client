import { memo, useMemo } from 'react'
import { Badge } from '@/components/ui/Badge'
import type { StatusBadgeProps } from '@/types/dashboard'

export const StatusBadge = memo(({ status }: StatusBadgeProps) => {
	const badgeConfig = useMemo(() => {
		switch (status) {
			case 'PUBLISHED':
				return { variant: 'default' as const, text: '진행중' }
			case 'LOCKED':
				return { variant: 'secondary' as const, text: '잠금' }
			case 'DRAWN':
				return { variant: 'secondary' as const, text: '완료' }
			case 'CANCELLED':
				return { variant: 'destructive' as const, text: '취소' }
			default:
				return { variant: 'outline' as const, text: '알 수 없음' }
		}
	}, [status])

	return <Badge variant={badgeConfig.variant}>{badgeConfig.text}</Badge>
})

StatusBadge.displayName = 'StatusBadge'

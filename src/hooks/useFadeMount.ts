import { useCallback, useState } from 'react'

interface UseFadeMountOptions {
	initialVisible?: boolean
	durationMs?: number
}

interface UseFadeMountResult {
	mounted: boolean
	visible: boolean
	show: () => void
	hide: (onHidden?: () => void) => void
	durationMs: number
}

export function useFadeMount({
	initialVisible = false,
	durationMs = 500,
}: UseFadeMountOptions = {}): UseFadeMountResult {
	const [mounted, setMounted] = useState<boolean>(initialVisible)
	const [visible, setVisible] = useState<boolean>(initialVisible)

	const show = useCallback(() => {
		setMounted(true)
		requestAnimationFrame(() => setVisible(true))
	}, [])

	const hide = useCallback(
		(onHidden?: () => void) => {
			setVisible(false)
			// TODO: rAF 취소 처리(& ref로 rAF 관리)
			setTimeout(() => {
				setMounted(false)
				onHidden?.()
			}, durationMs)
		},
		[durationMs],
	)

	return { mounted, visible, show, hide, durationMs }
}

'use client'

import { useEffect, useState } from 'react'
import { raffleApi } from '@/lib/api'

/**
 * 이벤트 추첨 완료 여부를 폴링하는 훅
 * @param raffleId 래플 ID
 * @param enabled 폴링 활성화 여부
 * @param interval 폴링 간격 (ms, 기본값: 1000ms = 1초)
 */
export function useEventPolling(raffleId: string, enabled = true, interval = 1000) {
	const [isDrawn, setIsDrawn] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		if (!enabled || !raffleId) {
			setIsLoading(false)
			return
		}

		let timeoutId: NodeJS.Timeout

		const checkDrawnStatus = async () => {
			try {
				setIsLoading(true)
				const response = await raffleApi.checkWinnersPresent(raffleId)
				setIsDrawn(response.isDrawn)
				setError(null)

				// 추첨이 완료되지 않았다면 계속 폴링
				if (!response.isDrawn && enabled) {
					timeoutId = setTimeout(checkDrawnStatus, interval)
				}
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Unknown error'))
				// 에러 발생 시에도 계속 폴링
				if (enabled) {
					timeoutId = setTimeout(checkDrawnStatus, interval)
				}
			} finally {
				setIsLoading(false)
			}
		}

		checkDrawnStatus()

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId)
			}
		}
	}, [raffleId, enabled, interval])

	return { isDrawn, isLoading, error }
}

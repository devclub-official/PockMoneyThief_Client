'use client'

import { useEffect, useState } from 'react'
import { myApi } from '@/lib/api'
import type { MyRaffleResultV2Response } from '@/types'

/**
 * 이벤트 결과를 조회하는 훅
 * @param raffleId 래플 ID
 * @param enabled 자동 조회 활성화 여부
 */
export function useEventResult(raffleId: string, enabled = true) {
	const [data, setData] = useState<MyRaffleResultV2Response | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	const fetchResult = async () => {
		if (!raffleId) return

		try {
			setIsLoading(true)
			setError(null)
			const response = await myApi.getSelfResultV2(raffleId)
			setData(response)
			return response
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to fetch result')
			setError(error)
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (enabled && raffleId) {
			fetchResult()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [raffleId, enabled])

	return {
		data,
		isLoading,
		error,
		refetch: fetchResult,
	}
}

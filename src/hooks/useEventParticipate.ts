'use client'

import { useState } from 'react'
import { participantApi } from '@/lib/api'
import type { ParticipateV2Request, ParticipateV2Response } from '@/types'

/**
 * 이벤트 참여를 처리하는 훅
 */
export function useEventParticipate() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [data, setData] = useState<ParticipateV2Response | null>(null)

	const participate = async (raffleId: string, request: ParticipateV2Request) => {
		try {
			setIsLoading(true)
			setError(null)
			const response = await participantApi.participateV2(raffleId, request)
			setData(response)
			return response
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to participate')
			setError(error)
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	return {
		participate,
		isLoading,
		error,
		data,
	}
}

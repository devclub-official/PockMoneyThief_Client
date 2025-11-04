import { useQuery } from '@tanstack/react-query'
import { participantApi } from '@/lib/api'
import type { ParticipantsResponse } from '@/types'

export function useParticipants(raffleId: string) {
	return useQuery<ParticipantsResponse>({
		queryKey: ['participants', raffleId],
		queryFn: () => participantApi.getParticipants(raffleId),
		enabled: !!raffleId,
		retry: 1,
		retryDelay: 1000,
	})
}

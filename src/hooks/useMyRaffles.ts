import { myApi } from '@/lib/api'
import { useSuspenseQueries } from '@tanstack/react-query'

export const useMyRaffles = () => {
	const [{ data: hostedRaffles }, { data: participatedRaffles }, { data: winRaffles }] =
		useSuspenseQueries({
			queries: [
				{
					queryKey: ['my-raffles'],
					queryFn: () => myApi.getHostedRaffles(),
				},
				{
					queryKey: ['my-participated-raffles'],
					queryFn: () => myApi.getParticipatedRaffles(),
				},
				{
					queryKey: ['my-wins'],
					queryFn: () => myApi.getWins().then((res) => res.wins),
				},
			],
		})

	return { hostedRaffles, participatedRaffles, winRaffles }
}

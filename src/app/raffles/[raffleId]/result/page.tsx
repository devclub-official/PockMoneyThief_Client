import { RaffleResult } from '@/components/raffles/RaffleResult'
import { raffleApi } from '@/lib/api'

interface PageProps {
	params: Promise<{ raffleId: string }>
}

export const metadata = {
	title: '가차추첨 - 추첨 결과',
	description: '투명하고 공정한 추첨 결과를 확인하세요.',
}

export default async function RaffleResultPage({ params }: PageProps) {
	const { raffleId } = await params

	// 래플 상세 정보 조회
	// const raffleDetail = await raffleApi.getById(raffleId)
	const raffleDetail = {
		id: raffleId,
		title: '피카츄 넌드로이드 #1',
		description: '3만원 상당의 피카츄 넌드로이드를 5천원에!',
		imageUrl: '/gacha.svg',
		entryFee: 5000,
		minParticipants: 3,
		maxParticipants: 10,
		deadlineAt: new Date().toISOString(),
		externalSeedDescription: '2025-11-07 삼성전자 주가 마지막 자릿수',
		externalSeed: '89',
		participantsCount: 7,
		status: 'DRAWN',
		createdAt: new Date().toISOString(),
		tiers: [
			{
				rank: 1,
				name: '피카츄 넌드로이드 #1',
				quantity: 1,
				imageUrl: '/gacha.svg',
			},
		],
	}

	return (
		<RaffleResult
			raffleDetail={raffleDetail}
			raffleResultVideoSrc={'/video/realistic-raffle-result.mp4'}
			// raffleResultVideoSrc={'/video/cute-raffle-result.mp4'}
		/>
	)
}

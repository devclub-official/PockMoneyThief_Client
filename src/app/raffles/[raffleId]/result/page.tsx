import { RaffleResult } from '@/components/raffles/RaffleResult'

interface PageProps {
	params: Promise<{ raffleId: string }>
}

export const metadata = {
	title: '가차추첨 - 추첨 결과',
	description: '투명하고 공정한 추첨 결과를 확인하세요.',
}

export default async function RaffleResultPage({ params }: PageProps) {
	const { raffleId } = await params

	// TODO: 실제 API 연동 시 raffleId로 데이터 조회
	return (
		<RaffleResult
			title={`피카츄 넌드로이드 #${raffleId}`}
			description="3만원 상당의 피카츄 넌드로이드를 5천원에!"
			organizer="피규어매니아"
			closedAt={new Date().toLocaleString()}
			imageUrl="/gacha.svg"
			raffleResultVideoSrc={'/video/realistic-raffle-result.mp4'}
			// raffleResultVideoSrc={'/video/cute-raffle-result.mp4'}
			raffleId={raffleId}
		/>
	)
}

import { MyRaffleResultClient } from './MyRaffleResultClient'

interface PageProps {
	params: { raffleId: string }
}

export const metadata = {
	title: '내 결과 - 가차추첨',
	description: '해당 래플에서 나의 당첨 여부와 정보를 확인하세요.',
}

// 세션 기반 인증이므로 SSR 비활성화
export const dynamic = 'force-dynamic'

export default function MyRaffleSelfResultPage({ params }: PageProps) {
	const { raffleId } = params
	return <MyRaffleResultClient raffleId={raffleId} />
}

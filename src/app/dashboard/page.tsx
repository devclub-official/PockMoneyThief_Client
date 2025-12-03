import { Suspense } from 'react'
import { myApi } from '@/lib/api'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { DashboardPageClient } from '@/components/pages/DashboardPageClient'

// 사용자별 동적 데이터이므로 빌드 타임에 prerendering하지 않음
export const dynamic = 'force-dynamic'

export default async function Dashboard() {
	// 모의 API로 등록/참여 목록을 병렬 prefetch
	const [myRafflesData, participatedRafflesData, myWinsData] = await Promise.all([
		myApi.getHostedRaffles(),
		myApi.getParticipatedRaffles(),
		myApi.getWins(),
	])

	return (
		<div className="bg-background min-h-screen">
			<Suspense fallback={<LoadingSpinner />}>
				<DashboardPageClient
					initialMyRaffles={myRafflesData}
					initialParticipatedRaffles={participatedRafflesData}
					initialWins={myWinsData.wins}
				/>
			</Suspense>
		</div>
	)
}

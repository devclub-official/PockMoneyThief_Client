import { Suspense } from 'react'
import { serverApiClient } from '@/lib/api-server'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { DashboardPageClient } from '@/components/pages/DashboardPageClient'

export default async function Dashboard() {
	// 모의 API로 내가 등록한 추첨 목록만 우선 prefetch
	const [myRafflesData] = await Promise.all([serverApiClient.getMyHostedRaffles()])
	const participatedRafflesData: never[] = []

	return (
		<div className="bg-background min-h-screen">
			<Suspense fallback={<LoadingSpinner />}>
				<DashboardPageClient
					initialMyRaffles={myRafflesData}
					initialParticipatedRaffles={participatedRafflesData}
				/>
			</Suspense>
		</div>
	)
}

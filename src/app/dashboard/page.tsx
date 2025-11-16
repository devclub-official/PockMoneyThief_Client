import { Suspense } from 'react'
import { myApi } from '@/lib/api'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { DashboardPageClient } from '@/components/pages/DashboardPageClient'

export default async function Dashboard() {
	// 모의 API로 등록/참여 목록을 병렬 prefetch
	const [myRafflesData, participatedRafflesData] = await Promise.all([
		myApi.getHostedRaffles(),
		myApi.getParticipatedRaffles(),
	])

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

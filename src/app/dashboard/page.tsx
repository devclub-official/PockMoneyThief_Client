import { Suspense } from 'react'
import { serverApi } from '@/lib/api-server'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { DashboardPageClient } from '@/components/pages/DashboardPageClient'

export default async function Dashboard() {
	// 서버에서 데이터를 미리 가져옴
	const [myRafflesData, participatedRafflesData] = await Promise.all([
		serverApi.getMyRaffles(),
		serverApi.getParticipatedRaffles(),
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

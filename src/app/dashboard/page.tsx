import { Suspense } from 'react'
// import { serverApiClient } from '@/lib/api-server'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { DashboardPageClient } from '@/components/pages/DashboardPageClient'

export default async function Dashboard() {
	// ❌ API 명세에 없는 엔드포인트 (백엔드 확인 필요)
	// const [myRafflesData, participatedRafflesData] = await Promise.all([
	// 	serverApiClient.getMyRaffles(),
	// 	serverApiClient.getParticipatedRaffles(),
	// ])

	// 임시로 빈 데이터 전달
	const myRafflesData: never[] = []
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

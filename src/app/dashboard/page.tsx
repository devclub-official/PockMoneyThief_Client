import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { DashboardPageClient } from '@/components/pages/DashboardPageClient'
import { AsyncBoundary } from '@/components/boundary/AsyncBoundary'

// 사용자별 동적 데이터이므로 빌드 타임에 prerendering하지 않음
// export const dynamic = 'force-dynamic'

export default async function Dashboard() {
	return (
		<div className="bg-background min-h-screen">
			<AsyncBoundary loadingFallback={<LoadingSpinner />}>
				<DashboardPageClient />
			</AsyncBoundary>
		</div>
	)
}

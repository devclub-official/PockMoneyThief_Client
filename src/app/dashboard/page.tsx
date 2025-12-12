import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { DashboardPageClient } from '@/components/pages/DashboardPageClient'
import { AsyncBoundary } from '@/components/boundary/AsyncBoundary'

// 사용자별 동적 데이터이므로 빌드 타임에 prerendering하지 않음
// 세션 기반 인증(JSESSIONID)은 클라이언트에서만 동작하므로 SSR 비활성화
export const dynamic = 'force-dynamic'

export default async function Dashboard() {
	return (
		<div className="min-h-screen bg-background">
			<AsyncBoundary loadingFallback={<LoadingSpinner />}>
				<DashboardPageClient />
			</AsyncBoundary>
		</div>
	)
}

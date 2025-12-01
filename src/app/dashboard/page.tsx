import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { DashboardPageClient } from '@/components/pages/DashboardPageClient'

/**
 * Dashboard 페이지 (서버 컴포넌트)
 *
 * ⚠️ 주의: 인증이 필요한 API는 클라이언트 컴포넌트에서 React Query로 호출
 * 서버 컴포넌트에서 호출 시 세션 쿠키가 전달되지 않아 401 에러 발생
 */
export default function Dashboard() {
	return (
		<div className="bg-background min-h-screen">
			<DashboardPageClient />
		</div>
	)
}

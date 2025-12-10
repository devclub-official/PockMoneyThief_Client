import dynamic from 'next/dynamic'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { AsyncBoundary } from '@/components/boundary/AsyncBoundary'

// SSR 비활성화 (클라이언트 사이드 렌더링 전용)
const HomePageClient = dynamic(
	() => import('@/components/pages/HomePageClient').then((mod) => mod.HomePageClient),
	{
		ssr: false,
		loading: () => <LoadingSpinner />,
	},
)

// SEO를 위한 메타데이터 설정컴포넌트
export default function HomePage() {
	return (
		<div className="min-h-screen bg-background">
			<AsyncBoundary loadingFallback={<LoadingSpinner />}>
				<HomePageClient />
			</AsyncBoundary>
		</div>
	)
}

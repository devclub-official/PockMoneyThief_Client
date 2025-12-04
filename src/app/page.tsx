import { Metadata } from 'next'
import { HomePageClient } from '@/components/pages/HomePageClient'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { AsyncBoundary } from '@/components/boundary/AsyncBoundary'

// SEO를 위한 메타데이터 설정
export const metadata: Metadata = {
	title: '가차추첨 - 공정한 추첨 플랫폼',
	description: '누구나 검증 가능한 투명한 추첨 시스템. 믿지 않아도 됩니다. 직접 확인하세요.',
	keywords: ['추첨', '가차', '공정한 추첨', '투명한 시스템', '검증 가능'],
	openGraph: {
		title: '가차추첨 - 공정한 추첨 플랫폼',
		description: '누구나 검증 가능한 투명한 추첨 시스템',
		type: 'website',
	},
}

// 서버 컴포넌트에서 데이터 prefetch
export default async function HomePage() {
	return (
		<div className="bg-background min-h-screen">
			<AsyncBoundary loadingFallback={<LoadingSpinner />}>
				<HomePageClient />
			</AsyncBoundary>
		</div>
	)
}

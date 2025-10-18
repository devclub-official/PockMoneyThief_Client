import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function Loading() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<LoadingSpinner size="lg" />
				<p className="text-muted-foreground mt-4">페이지를 불러오는 중...</p>
			</div>
		</div>
	)
}

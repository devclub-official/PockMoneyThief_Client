import type { LoadingStateProps } from '@/types/common'

export function LoadingState({ message = '로딩 중...' }: LoadingStateProps) {
	return (
		<div className="flex min-h-[50vh] items-center justify-center">
			<div className="text-center">
				<div className="border-primary mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-solid border-r-transparent"></div>
				<p className="text-muted-foreground">{message}</p>
			</div>
		</div>
	)
}

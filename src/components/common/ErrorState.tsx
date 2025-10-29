import { Button } from '@/components/ui/Button'
import { Gift } from 'lucide-react'
import type { ErrorStateProps } from '@/types/common'

export function ErrorState({
	title = '오류가 발생했습니다',
	description = '요청을 처리하는 중 오류가 발생했습니다.',
	buttonText = '다시 시도',
	onRetry = () => window.location.reload(),
}: ErrorStateProps) {
	return (
		<div className="flex min-h-[50vh] items-center justify-center">
			<div className="text-center">
				<div className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
					<Gift className="text-destructive h-8 w-8" />
				</div>
				<h3 className="mb-2 text-lg font-semibold">{title}</h3>
				<p className="text-muted-foreground mb-4">{description}</p>
				<Button onClick={onRetry}>{buttonText}</Button>
			</div>
		</div>
	)
}

'use client'

import { Button } from '@/components/ui/Button'
import { AlertCircle } from 'lucide-react'

interface ErrorProps {
	error: Error & { digest?: string }
	reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<div className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
					<AlertCircle className="text-destructive h-8 w-8" />
				</div>
				<h2 className="mb-2 text-2xl font-semibold">오류가 발생했습니다</h2>
				<p className="text-muted-foreground mb-4">
					예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
				</p>
				{process.env.NODE_ENV === 'development' && (
					<details className="mb-4 text-left">
						<summary className="text-muted-foreground cursor-pointer text-sm">
							오류 세부사항
						</summary>
						<pre className="text-muted-foreground mt-2 text-xs">{error.message}</pre>
					</details>
				)}
				<Button onClick={reset}>다시 시도</Button>
			</div>
		</div>
	)
}

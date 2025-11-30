'use client'
import Loading from '@/app/loading'
import { Suspense } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { useQueryClient } from '@tanstack/react-query'

interface AsyncBoundaryProps extends React.PropsWithChildren {
	loadingFallback?: React.ReactNode
	errorFallback?: React.ReactNode
	errorFallbackRender?: (props: FallbackProps) => React.ReactNode
	onReset?: () => void
}

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
	<div className="flex min-h-[200px] items-center justify-center">
		<div className="text-center">
			<h2 className="mb-2 text-lg font-semibold text-red-600">오류가 발생했습니다</h2>
			<p className="mb-4 text-sm text-gray-600">{error.message}</p>
			<button
				onClick={resetErrorBoundary}
				className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
			>
				다시 시도
			</button>
		</div>
	</div>
)

const LoadingFallback = () => <Loading />

export function AsyncBoundary({
	children,
	loadingFallback = <LoadingFallback />,
	errorFallback,
	errorFallbackRender = ErrorFallback,
	onReset,
}: AsyncBoundaryProps) {
	const queryClient = useQueryClient()

	const handleReset = () => {
		// 모든 쿼리 무효화하여 재시도 시 새로운 데이터 페칭
		queryClient.invalidateQueries()
		onReset?.()
	}

	return (
		<ErrorBoundary
			{...(errorFallback ? { fallback: errorFallback } : { fallbackRender: errorFallbackRender })}
			onReset={handleReset}
		>
			<Suspense fallback={loadingFallback}>{children}</Suspense>
		</ErrorBoundary>
	)
}

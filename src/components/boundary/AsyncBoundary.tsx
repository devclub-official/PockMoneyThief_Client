'use client'
import Loading from '@/app/loading'
import { Suspense } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'

interface AsyncBoundaryProps extends React.PropsWithChildren {
	loadingFallback?: React.ReactNode
	errorFallback?: React.ReactNode
	errorFallbackRender?: (props: FallbackProps) => React.ReactNode
}

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
	<div>
		<h2>Error: {error.message}</h2>
		<button onClick={resetErrorBoundary}>Retry</button>
	</div>
)

const LoadingFallback = () => <Loading />

export function AsyncBoundary({
	children,
	loadingFallback = <LoadingFallback />,
	errorFallback,
	errorFallbackRender = ErrorFallback,
}: AsyncBoundaryProps) {
	return (
		<Suspense fallback={loadingFallback}>
			<ErrorBoundary
				{...(errorFallback ? { fallback: errorFallback } : { fallbackRender: errorFallbackRender })}
			>
				{children}
			</ErrorBoundary>
		</Suspense>
	)
}

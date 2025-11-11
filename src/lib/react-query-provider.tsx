'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

interface ReactQueryProviderProps {
	children: ReactNode
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 1, // 1회만 재시도
						refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 refetch 방지
						staleTime: 1000 * 60, // 1분간 fresh 상태 유지
						gcTime: 1000 * 60 * 5, // 5분간 캐시 유지
						throwOnError: true, // useSuspenseQuery에서 에러를 ErrorBoundary로 전파
					},
					mutations: {
						retry: 0, // mutation은 재시도 안 함
					},
				},
			}),
	)
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

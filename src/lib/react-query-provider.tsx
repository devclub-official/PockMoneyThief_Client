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
						retry: 1, // 1번만 재시도
						refetchOnWindowFocus: false, // 창 포커스 시 재요청 안함
						staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
					},
				},
			}),
	)
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

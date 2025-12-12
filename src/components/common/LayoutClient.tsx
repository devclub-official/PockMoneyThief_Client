'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Header } from '@/components/common/Header'
import { Sidebar } from '@/components/common/Sidebar'
import { Footer } from '@/components/common/Footer'

interface LayoutClientProps {
	children: React.ReactNode
}

export function LayoutClient({ children }: LayoutClientProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const pathname = usePathname()
	const isLoginPage = pathname === '/login'

	// 로그인 페이지에서는 헤더와 사이드바를 표시하지 않음
	if (isLoginPage) {
		return <>{children}</>
	}

	return (
		<div className="flex h-screen overflow-hidden">
			<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header onMenuClick={() => setSidebarOpen(true)} />
				<main className="flex-1 overflow-y-auto">
					<div className="p-5 lg:p-10">{children}</div>
					<Footer />
				</main>
			</div>
		</div>
	)
}

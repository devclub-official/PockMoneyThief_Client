'use client'

import { useState } from 'react'
import { Header } from '@/components/common/Header'
import { Sidebar } from '@/components/common/Sidebar'
import { Footer } from '@/components/common/Footer'

interface LayoutClientProps {
	children: React.ReactNode
}

export function LayoutClient({ children }: LayoutClientProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<div className="flex h-screen overflow-hidden">
			<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header onMenuClick={() => setSidebarOpen(true)} />
				<main className="flex-1 overflow-y-auto">
					<div className="p-6">{children}</div>
					<Footer />
				</main>
			</div>
		</div>
	)
}

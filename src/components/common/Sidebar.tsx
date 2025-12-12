'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gift, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { SIDEBAR_MENU_ITEMS, SIDEBAR_BOTTOM_ITEMS } from '@/lib/constants'
import type { SidebarProps } from '@/types/common'

// 네비게이션 아이템 렌더링 함수
function renderNavigationItems(
	items: readonly {
		title: string
		href: string
		icon: React.ComponentType<{ className?: string }>
	}[],
	pathname: string,
	onClose: () => void,
) {
	return items.map((item) => {
		const isActive = pathname === item.href
		return (
			<Link
				key={item.href}
				href={item.href}
				onClick={onClose}
				className={cn(
					'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
					isActive
						? 'bg-primary text-primary-foreground shadow-sm'
						: 'text-muted-foreground hover:bg-accent hover:text-foreground',
				)}
			>
				<item.icon className="h-5 w-5" />
				{item.title}
			</Link>
		)
	})
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
	const pathname = usePathname()

	return (
		<>
			{/* 오버레이 (모바일) */}
			<div
				className={cn(
					'fixed inset-0 z-[40] bg-black/50 transition-opacity duration-300 lg:hidden',
					isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
				)}
				onClick={onClose}
			/>

			{/* Sidebar */}
			<div
				className={cn(
					'flex h-full w-64 flex-col border-r border-border bg-card',
					// 모바일: fixed, 슬라이드
					'fixed left-0 top-0 z-[50] h-screen shadow-2xl transition-transform duration-300 ease-out lg:relative lg:translate-x-0 lg:shadow-none',
					isOpen ? 'translate-x-0' : '-translate-x-full',
				)}
			>
				{/* Logo */}
				<div className="flex h-16 items-center justify-between border-b border-border px-6">
					<Link
						href="/"
						onClick={onClose}
						className="flex items-center gap-3 transition-opacity hover:opacity-80"
					>
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
							<Gift className="h-5 w-5 text-primary-foreground" />
						</div>
						<span className="text-lg font-semibold text-foreground">가차추첨</span>
					</Link>
					{/* 모바일 닫기 버튼 */}
					<button
						onClick={onClose}
						className="rounded-lg p-2 transition-colors hover:bg-accent lg:hidden"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Navigation */}
				<nav className="flex-1 space-y-1 p-4">
					<div className="space-y-1">
						{renderNavigationItems(SIDEBAR_MENU_ITEMS, pathname, onClose)}
					</div>
				</nav>

				{/* Bottom Navigation */}
				<div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
					<div className="space-y-1">
						{renderNavigationItems(SIDEBAR_BOTTOM_ITEMS, pathname, onClose)}
					</div>
				</div>
			</div>
		</>
	)
}

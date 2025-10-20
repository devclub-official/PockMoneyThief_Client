'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gift, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { SIDEBAR_MENU_ITEMS, SIDEBAR_BOTTOM_ITEMS } from '@/lib/constants'

interface SidebarProps {
	isOpen: boolean
	onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
	const pathname = usePathname()

	return (
		<>
			{/* 오버레이 (모바일) */}
			<div
				className={cn(
					'fixed inset-0 z-[30] bg-black/50 transition-opacity duration-300 lg:hidden',
					isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
				)}
				onClick={onClose}
			/>

			{/* Sidebar */}
			<div
				className={cn(
					'bg-card border-border flex h-full w-64 flex-col border-r',
					// 모바일: fixed, 슬라이드
					'fixed top-0 left-0 z-[20] h-screen shadow-2xl transition-transform duration-300 ease-out lg:relative lg:translate-x-0 lg:shadow-none',
					isOpen ? 'translate-x-0' : '-translate-x-full',
				)}
			>
				{/* Logo */}
				<div className="border-border flex h-16 items-center justify-between border-b px-6">
					<Link
						href="/"
						onClick={onClose}
						className="flex items-center gap-3 transition-opacity hover:opacity-80"
					>
						<div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
							<Gift className="text-primary-foreground h-5 w-5" />
						</div>
						<span className="text-foreground text-lg font-semibold">가차추첨</span>
					</Link>
					{/* 모바일 닫기 버튼 */}
					<button
						onClick={onClose}
						className="hover:bg-accent rounded-lg p-2 transition-colors lg:hidden"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Navigation */}
				<nav className="flex-1 space-y-1 p-4">
					<div className="space-y-1">
						{SIDEBAR_MENU_ITEMS.map((item) => {
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
											: 'text-muted-foreground hover:text-foreground hover:bg-accent',
									)}
								>
									<item.icon className="h-5 w-5" />
									{item.title}
								</Link>
							)
						})}
					</div>
				</nav>

				{/* Bottom Navigation */}
				<div className="border-border absolute right-0 bottom-0 left-0 border-t p-4">
					<div className="space-y-1">
						{SIDEBAR_BOTTOM_ITEMS.map((item) => {
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
											: 'text-muted-foreground hover:text-foreground hover:bg-accent',
									)}
								>
									<item.icon className="h-5 w-5" />
									{item.title}
								</Link>
							)
						})}
					</div>
				</div>
			</div>
		</>
	)
}

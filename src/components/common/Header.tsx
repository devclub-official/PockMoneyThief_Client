'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Bell, LogOut, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface HeaderProps {
	onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
	const router = useRouter()

	const handleLogout = () => {
		// TODO: 로그아웃 로직
		router.push('/login')
	}

	return (
		<header className="border-border bg-card flex h-16 items-center justify-between border-b px-4 lg:px-6">
			{/* Mobile menu button */}
			<Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenuClick}>
				<Menu className="h-5 w-5" />
			</Button>

			{/* Logo (모바일) */}
			<div className="flex items-center gap-3 lg:hidden">
				<div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
					<Search className="text-primary-foreground h-4 w-4" />
				</div>
				<span className="text-foreground text-lg font-semibold">가차추첨</span>
			</div>

			{/* Search Bar (데스크탑) */}
			<div className="hidden max-w-md flex-1 items-center gap-4 lg:flex">
				<div className="relative flex flex-1 items-center">
					<Search className="text-muted-foreground pointer-events-none absolute left-3 h-4 w-4" />
					<input
						type="text"
						placeholder="원하시는 상품을 검색해보세요"
						className="bg-muted/50 border-border focus:ring-ring/20 w-full rounded-lg border py-2 pr-4 pl-10 text-sm transition-all focus:ring-2 focus:outline-none"
					/>
				</div>
			</div>

			{/* Right Section */}
			<div className="flex items-center gap-2 lg:gap-4">
				{/* Notifications */}
				<button className="hover:bg-accent relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
					<Bell className="text-muted-foreground h-5 w-5" />
					<span className="bg-destructive absolute top-1 right-1 h-2 w-2 rounded-full"></span>
				</button>

				{/* User Profile */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="hover:bg-accent flex items-center gap-3 rounded-lg p-2 transition-colors">
							<Avatar className="ring-background h-8 w-8 rounded-full shadow-sm ring-2">
								<AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
									U
								</AvatarFallback>
							</Avatar>
							<div className="hidden text-left lg:block">
								<p className="text-sm font-medium">사용자</p>
								<p className="text-muted-foreground text-xs">가차 수집가</p>
							</div>
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56" align="end">
						<div className="flex items-center justify-start gap-3 p-3">
							<Avatar className="h-10 w-10">
								<AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
							</Avatar>
							<div className="flex flex-col space-y-1 leading-none">
								<p className="font-medium">사용자</p>
								<p className="text-muted-foreground text-xs">가차 수집가</p>
							</div>
						</div>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => router.push('/dashboard')}>
							<User className="mr-2 h-4 w-4" />
							<span>내 프로필</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout} className="text-destructive">
							<LogOut className="mr-2 h-4 w-4" />
							<span>로그아웃</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	)
}

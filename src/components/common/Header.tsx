'use client'

import { Avatar, AvatarFallback } from '@/components/ui/Avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Search, LogOut, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { loginApi } from '@/lib/api'
import { useAtom } from 'jotai'
import { searchQueryAtom } from '@/lib/atoms/searchAtom'

interface HeaderProps {
	onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)

	const handleLogout = async () => {
		await loginApi.logout()
		return router.push('/login')
	}

	return (
		<header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
			{/* Mobile menu button */}
			<Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenuClick}>
				<Menu className="h-5 w-5" />
			</Button>

			{/* Logo (모바일) */}
			<div className="flex items-center gap-3 lg:hidden">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
					<Search className="h-4 w-4 text-primary-foreground" />
				</div>
				<span className="text-lg font-semibold text-foreground">가차추첨</span>
			</div>

			{/* Search Bar (데스크탑) */}
			<div className="hidden max-w-md flex-1 items-center gap-4 lg:flex">
				<div className="relative flex flex-1 items-center">
					<Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
					<input
						type="text"
						placeholder="원하시는 상품을 검색해보세요"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="bg-muted/50 focus:ring-ring/20 w-full rounded-lg border border-border py-2 pl-10 pr-4 text-sm transition-all focus:outline-none focus:ring-2"
					/>
				</div>
			</div>

			{/* Right Section */}
			<div className="flex items-center gap-2 lg:gap-4">
				{/* User Profile */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent">
							<Avatar className="h-8 w-8 rounded-full shadow-sm ring-2 ring-background">
								<AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
									U
								</AvatarFallback>
							</Avatar>
							<div className="hidden text-left lg:block">
								<p className="text-sm font-medium">사용자</p>
								<p className="text-xs text-muted-foreground">가차 수집가</p>
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
								<p className="text-xs text-muted-foreground">가차 수집가</p>
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

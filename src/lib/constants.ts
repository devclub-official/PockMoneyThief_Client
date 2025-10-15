import { Home, Plus, User, BarChart3, Settings, HelpCircle } from 'lucide-react'

// 시간 관련 상수
export const TIME_CONSTANTS = {
	ENDING_SOON_THRESHOLD: 6 * 60 * 60 * 1000, // 6시간
	URGENT_THRESHOLD: 60 * 60 * 1000, // 1시간
} as const

// GNB 메뉴 아이템
export const SIDEBAR_MENU_ITEMS = [
	{
		title: '추첨 목록',
		href: '/',
		icon: Home,
	},
	{
		title: '추첨 등록',
		href: '/create',
		icon: Plus,
	},
	{
		title: '내 추첨',
		href: '/dashboard',
		icon: User,
	},
	{
		title: '통계',
		href: '/stats',
		icon: BarChart3,
	},
] as const

export const SIDEBAR_BOTTOM_ITEMS = [
	{
		title: '설정',
		href: '/settings',
		icon: Settings,
	},
	{
		title: '도움말',
		href: '/help',
		icon: HelpCircle,
	},
] as const

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

// 대시보드 관련 메시지 상수
export const DASHBOARD_MESSAGES = {
	RAFFLE_LOCKED: '래플이 잠금되었습니다.',
	RAFFLE_LOCK_FAILED: '래플 잠금에 실패했습니다.',
	RAFFLE_CANCELLED: '래플이 취소되었습니다.',
	RAFFLE_CANCEL_FAILED: '래플 취소에 실패했습니다.',
	RAFFLE_DRAW_CONFIRM: '추첨을 실행하시겠습니까? 실행 후에는 되돌릴 수 없습니다.',
	RAFFLE_DRAW_COMPLETED: '추첨이 완료되었습니다!',
	RAFFLE_DRAW_FAILED: '추첨 실행에 실패했습니다.',
	TRACKING_REQUIRED: '택배사와 송장번호를 모두 입력해주세요.',
	TRACKING_REGISTERED: '송장번호가 등록되었습니다!',
	TRACKING_REGISTER_FAILED: '송장번호 등록에 실패했습니다.',
	DATA_LOAD_FAILED: '대시보드 데이터 로드 실패:',
} as const

// 대시보드 UI 텍스트 상수
export const DASHBOARD_UI_TEXT = {
	PAGE_TITLE: '내 대시보드',
	PAGE_DESCRIPTION: '등록한 추첨과 참여한 추첨을 관리하세요',
	MY_RAFFLES_TAB: '내가 등록한 추첨',
	PARTICIPATED_TAB: '참여한 추첨',
	MY_RAFFLES_HEADER: '등록한 추첨',
	PARTICIPATED_HEADER: '참여한 추첨',
	CREATE_RAFFLE_BUTTON: '새 추첨 등록',
	NO_MY_RAFFLES_TITLE: '등록한 추첨이 없습니다',
	NO_MY_RAFFLES_DESCRIPTION: '첫 번째 가차 추첨을 등록해보세요',
	NO_PARTICIPATED_TITLE: '참여한 추첨이 없습니다',
	NO_PARTICIPATED_DESCRIPTION: '흥미로운 추첨에 참여해보세요',
	BROWSE_RAFFLES_BUTTON: '추첨 둘러보기',
} as const

// 상태 관련 상수 (API 명세서에 맞게 수정)
export const RAFFLE_STATUS = {
	PUBLISHED: 'PUBLISHED',
	LOCKED: 'LOCKED',
	DRAWN: 'DRAWN', // API 명세서에 따르면 COMPLETED가 아닌 DRAWN
	CANCELLED: 'CANCELLED',
} as const

export const SHIPPING_STATUS = {
	PENDING: 'PENDING',
	SAVED: 'SAVED', // API 명세서에 따르면 배송정보 완료 상태
	SHIPPED: 'SHIPPED',
	DELIVERED: 'DELIVERED',
} as const

// OAuth 관련 엔드포인트 상수
export const OAUTH_ENDPOINTS = {
	KAKAO: '/oauth2/authorization/kakao',
} as const

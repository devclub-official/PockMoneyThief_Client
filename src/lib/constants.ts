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

// 이미지 업로드 관련 상수
export const UPLOAD_CONSTANTS = {
	S3_BUCKET_URL: 'https://pockmoneythief-images.s3.ap-northeast-2.amazonaws.com',
	PRESIGNED_URL_EXPIRES_IN: 900,
	MOCK_RAFFLE_ID_PREFIX: 'mock-raffle-',
} as const

// 대시보드 관련 메시지 상수
export const DASHBOARD_MESSAGES = {
	RAFFLE_LOCKED: '추첨이 잠금되었습니다.',
	RAFFLE_LOCK_FAILED: '추첨 잠금에 실패했습니다.',
	RAFFLE_CANCELLED: '추첨이 취소되었습니다.',
	RAFFLE_CANCEL_FAILED: '추첨 취소에 실패했습니다.',
	RAFFLE_DRAW_CONFIRM: '추첨을 실행하시겠습니까? 실행 후에는 되돌릴 수 없습니다.',
	RAFFLE_DRAW_COMPLETED: '추첨이 완료되었습니다!',
	RAFFLE_DRAW_FAILED: '추첨 실행에 실패했습니다.',
	TRACKING_REQUIRED: '택배사와 송장번호를 모두 입력해주세요.',
	TRACKING_REGISTERED: '송장번호가 등록되었습니다!',
	TRACKING_REGISTER_FAILED: '송장번호 등록에 실패했습니다.',
	DATA_LOAD_FAILED: '대시보드 데이터 로드 실패:',
	DATA_LOAD_ERROR: '데이터를 불러오는 중 오류가 발생했습니다. 로그인이 필요할 수 있습니다.',
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

// 추첨 상세 UI 텍스트 상수
export const RAFFLE_DETAIL_UI_TEXT = {
	// 로딩 & 에러 상태
	LOADING_MESSAGE: '추첨 정보를 불러오는 중...',
	ERROR_TITLE: '추첨을 찾을 수 없습니다',
	ERROR_DESCRIPTION: '요청하신 추첨이 존재하지 않습니다.',

	// 참여 다이얼로그
	DIALOG_TITLE: '추첨 참여',
	DIALOG_DESCRIPTION: '참여자 이름을 입력해주세요. 추첨 결과 공개 시 표시됩니다.',
	DIALOG_LABEL: '참여자 이름',
	DIALOG_PLACEHOLDER: '추첨에 사용될 이름',
	DIALOG_NOTICE: '* 개인정보가 포함되지 않도록 주의해주세요',
	DIALOG_INFO_TITLE: '참여 안내',
	DIALOG_CANCEL: '취소',
	DIALOG_SUBMIT: '참여하기',
	DIALOG_SUBMITTING: '처리중...',

	// 참여 버튼 상태
	BUTTON_PARTICIPATE: '참여하기',
	BUTTON_ALREADY_PARTICIPATED: '이미 참여하셨습니다',
	BUTTON_LOCKED: '참가 마감',
	BUTTON_DRAWN: '추첨 완료',
	BUTTON_CANCELLED: '취소된 추첨',
	BUTTON_FULL: '참여 마감',
	BUTTON_UNAVAILABLE: '참여 불가',

	// 검증 에러 메시지
	VALIDATION_EMPTY_TITLE: '입력 오류',
	VALIDATION_EMPTY_DESC: '참여자 이름을 입력해주세요.',
	VALIDATION_SPACE_DESC: '이름에 공백을 포함할 수 없습니다.',
	VALIDATION_PHONE_DESC: '전화번호는 포함할 수 없습니다.',
	VALIDATION_EMAIL_DESC: '이메일 주소는 포함할 수 없습니다.',
	VALIDATION_BIRTH_DESC: '주민등록번호는 포함할 수 없습니다.',
	VALIDATION_NUMBER_DESC: '8자리 이상의 숫자는 포함할 수 없습니다.',
	VALIDATION_KEYWORD_DESC: '개인정보 관련 키워드는 사용할 수 없습니다.',

	// 참여 결과 메시지
	SUCCESS_TITLE: '참여 완료',
	SUCCESS_DESC: '추첨 참여가 완료되었습니다!',
	ERROR_PARTICIPATE_TITLE: '참여 실패',
	ERROR_PARTICIPATE_DESC: '추첨 참여에 실패했습니다. 다시 시도해주세요.',

	// 추첨 정보 라벨
	LABEL_ENTRY_FEE: '참여비',
	LABEL_PARTICIPANTS: '참여 인원',
	LABEL_DEADLINE: '마감 시간',
	LABEL_EXTERNAL_SEED: '외부 시드',
	LABEL_STATUS: '상태',

	// 상태 표시
	STATUS_PUBLISHED: '진행중',
	STATUS_LOCKED: '참가 마감',
	STATUS_DRAWN: '추첨 완료',
	STATUS_CANCELLED: '취소됨',

	// 섹션 제목
	SECTION_PRIZES: '상품 목록',
	SECTION_PARTICIPANTS: '참여자 목록',
	SECTION_NO_PARTICIPANTS: '아직 참여자가 없습니다',
} as const

// 추첨 상태 관련 상수 (API 값과 일치)
export const RAFFLE_STATUS = {
	PUBLISHED: 'PUBLISHED',
	LOCKED: 'LOCKED',
	DRAWN: 'DRAWN',
	CANCELLED: 'CANCELLED',
} as const

export const SHIPPING_STATUS = {
	PENDING: 'PENDING',
	SAVED: 'SAVED',
	SHIPPED: 'SHIPPED',
	DELIVERED: 'DELIVERED',
} as const

// OAuth 관련 엔드포인트 상수
export const OAUTH_ENDPOINTS = {
	KAKAO: '/oauth2/authorization/kakao',
} as const

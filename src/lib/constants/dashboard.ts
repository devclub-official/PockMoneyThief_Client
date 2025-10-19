// 대시보드 관련 상수

export const DASHBOARD_MESSAGES = {
	TITLE: '내 대시보드',
	TITLE_ARIA: '내 대시보드 페이지',
	SUBTITLE: '등록한 추첨과 참여한 추첨을 관리하세요',
	SUBTITLE_ARIA: '등록 및 참여한 추첨 관리 안내',
	TABS_ARIA_LABEL: '추첨 목록 탭',
	MY_RAFFLES_TAB: '내가 등록한 추첨',
	PARTICIPATED_RAFFLES_TAB: '참여한 추첨',
	MY_RAFFLES_HEADING: '등록한 추첨',
	MY_RAFFLES_COUNT_ARIA: '등록한 추첨 개수',
	PARTICIPATED_RAFFLES_HEADING: '참여한 추첨',
	PARTICIPATED_RAFFLES_COUNT_ARIA: '참여한 추첨 개수',
	CREATE_RAFFLE_BUTTON: '새 추첨 등록',
	CREATE_RAFFLE_BUTTON_ARIA: '새로운 추첨 등록하기',
	NO_MY_RAFFLES_HEADING: '등록한 추첨이 없습니다',
	NO_MY_RAFFLES_SUBTITLE: '첫 번째 가차 추첨을 등록해보세요',
	NO_MY_RAFFLES_CARD_ARIA: '등록한 추첨이 없음을 알리는 카드',
	NO_PARTICIPATED_RAFFLES_HEADING: '참여한 추첨이 없습니다',
	NO_PARTICIPATED_RAFFLES_SUBTITLE: '흥미로운 추첨에 참여해보세요',
	NO_PARTICIPATED_RAFFLES_CARD_ARIA: '참여한 추첨이 없음을 알리는 카드',
	BROWSE_RAFFLES_BUTTON: '추첨 둘러보기',
	BROWSE_RAFFLES_BUTTON_ARIA: '추첨 목록 둘러보기',
	WINNER_BADGE: '당첨!',
	WINNER_BADGE_ARIA: '당첨자 배지',
	PARTICIPATED_DATE_PREFIX: '참여일',
	PARTICIPATED_DATE_ARIA: '참여한 날짜',
	WINNING_ITEM_HEADING: '당첨 상품',
	WINNING_ITEM_CARD_ARIA: '당첨 상품 정보 카드',
	VIEW_DETAILS_BUTTON: '상세보기',
	VIEW_DETAILS_BUTTON_ARIA: '상세보기 버튼',
	VIEW_RESULTS_BUTTON: '결과보기',
	VIEW_RESULTS_BUTTON_ARIA: '결과보기 버튼',
	PARTICIPATED_RAFFLE_CARD_ARIA: '참여한 추첨 카드',
} as const

export const RAFFLE_ACTIONS = {
	LOCK: '잠금',
	CANCEL: '취소',
	DRAW: '추첨 실행',
	VIEW_DETAILS: '상세보기',
	VIEW_RESULTS: '결과보기',
	TRACKING_INPUT: '송장번호 입력',
} as const

export const SHIPPING_STATUS = {
	PENDING: '배송정보 대기',
	INFO_SUBMITTED: '배송정보 완료',
	SHIPPED: '배송중',
	DELIVERED: '배송완료',
	UNKNOWN: '상태 없음',
} as const

export const RAFFLE_STATUS = {
	PUBLISHED: '진행중',
	LOCKED: '잠금',
	COMPLETED: '완료',
	CANCELLED: '취소',
	UNKNOWN: '알 수 없음',
} as const

export const DIALOG_MESSAGES = {
	TRACKING_TITLE: '송장번호 입력',
	TRACKING_DESCRIPTION: '당첨자에게 발송한 택배의 송장번호를 입력해주세요',
	CARRIER_PLACEHOLDER: '예: CJ대한통운',
	TRACKING_PLACEHOLDER: '예: 123456789012',
	CONFIRM_CANCEL: '정말로 이 래플을 취소하시겠습니까?',
	CONFIRM_DRAW: '추첨을 실행하시겠습니까? 실행 후에는 되돌릴 수 없습니다.',
	ENTER_CARRIER_TRACKING: '택배사와 송장번호를 모두 입력해주세요.',
	SUCCESS_LOCK: '래플이 잠금되었습니다.',
	SUCCESS_CANCEL: '래플이 취소되었습니다.',
	SUCCESS_DRAW: '추첨이 완료되었습니다!',
	SUCCESS_TRACKING: '송장번호가 등록되었습니다!',
	ERROR_LOCK: '래플 잠금에 실패했습니다.',
	ERROR_CANCEL: '래플 취소에 실패했습니다.',
	ERROR_DRAW: '추첨 실행에 실패했습니다.',
	ERROR_TRACKING: '송장번호 등록에 실패했습니다.',
} as const

export const ACCESSIBILITY_LABELS = {
	PARTICIPANTS: '참여자 수',
	TIME_LEFT: '남은 시간',
	WINNER_MANAGEMENT: '당첨자 관리',
	SHIPPING_INFO: '배송 정보',
	TRACKING_NUMBER: '송장번호',
	CARRIER: '택배사',
} as const

import { useState, useCallback } from 'react'
// import { raffleApi, shippingApi } from '@/lib/api' // TODO: 실제 API 연동 시 사용
import type { MyRaffle, ParticipatedRaffle, Winner } from '@/types/dashboard'
import { DASHBOARD_MESSAGES, RAFFLE_STATUS, SHIPPING_STATUS } from '@/lib/constants'
import { useToast } from '@/components/ui/Toast'

export function useDashboard() {
	const [myRaffles, setMyRaffles] = useState<MyRaffle[]>([])
	const [participatedRaffles, setParticipatedRaffles] = useState<ParticipatedRaffle[]>([])
	const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null)
	const [trackingNumber, setTrackingNumber] = useState('')
	const [carrier, setCarrier] = useState('')
	const [showTrackingDialog, setShowTrackingDialog] = useState(false)
	const [loading, setLoading] = useState(true)
	const { addToast } = useToast()

	const loadDashboardData = useCallback(async () => {
		try {
			setLoading(true)
			// TODO: 실제 API 연동 시 사용
			// const [myRafflesData, participatedData] = await Promise.all([
			// 	raffleApi.getMyRaffles(),
			// 	raffleApi.getParticipatedRaffles()
			// ])
			// setMyRaffles(myRafflesData)
			// setParticipatedRaffles(participatedData)

			// Mock 데이터 (project.zip의 디자인을 반영)
			const mockMyRaffles: MyRaffle[] = [
				{
					id: 'rf_123',
					title: '피카츄 넨도로이드 #1355',
					description: '3만원 상당의 피카츄 넨도로이드를 5천원에!',
					imageUrl:
						'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
					status: RAFFLE_STATUS.DRAWN,
					type: 'single',
					currentParticipants: 7,
					maxParticipants: 10,
					deadlineAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
					winners: [
						{
							id: 'winner_1',
							raffleId: 'rf_123',
							participantId: 'pt_999',
							displayName: 'GachaKing',
							rank: 1,
							itemName: '피카츄 넨도로이드 #1355',
							shippingStatus: SHIPPING_STATUS.SAVED,
							shipping: {
								name: '김가차',
								phone: '010-1234-5678',
								zipcode: '12345',
								address1: '서울시 강남구 테헤란로 123',
								address2: '101동 101호',
								status: SHIPPING_STATUS.SAVED,
							},
							shippingInfo: {
								name: '김가차',
								phone: '010-1234-5678',
								zipcode: '12345',
								address1: '서울시 강남구 테헤란로 123',
								address2: '101동 101호',
							},
						},
						{
							id: 'winner_2',
							raffleId: 'rf_123',
							participantId: 'pt_1000',
							displayName: 'PokeMaster',
							rank: 2,
							itemName: '피카츄 넨도로이드 #1355',
							shippingStatus: SHIPPING_STATUS.PENDING,
							shipping: {
								status: SHIPPING_STATUS.PENDING,
							},
						},
						{
							id: 'winner_3',
							raffleId: 'rf_123',
							participantId: 'pt_1001',
							displayName: 'FigureCollector',
							rank: 3,
							itemName: '피카츄 넨도로이드 #1355',
							shippingStatus: SHIPPING_STATUS.SHIPPED,
							shipping: {
								name: '이수진',
								phone: '010-9876-5432',
								zipcode: '54321',
								address1: '부산시 해운대구 센텀중앙로 456',
								address2: '201동 301호',
								carrier: 'CJ대한통운',
								trackingNo: '123456789012',
								status: SHIPPING_STATUS.SHIPPED,
							},
							shippingInfo: {
								name: '이수진',
								phone: '010-9876-5432',
								zipcode: '54321',
								address1: '부산시 해운대구 센텀중앙로 456',
								address2: '201동 301호',
							},
							trackingNumber: '123456789012',
						},
						{
							id: 'winner_4',
							raffleId: 'rf_123',
							participantId: 'pt_1002',
							displayName: 'AnimeFan99',
							rank: 4,
							itemName: '피카츄 넨도로이드 #1355',
							shippingStatus: SHIPPING_STATUS.DELIVERED,
							shipping: {
								name: '박민수',
								phone: '010-5555-7777',
								zipcode: '67890',
								address1: '대구시 수성구 동대구로 789',
								address2: '102동 402호',
								carrier: '한진택배',
								trackingNo: '987654321098',
								status: SHIPPING_STATUS.DELIVERED,
							},
							shippingInfo: {
								name: '박민수',
								phone: '010-5555-7777',
								zipcode: '67890',
								address1: '대구시 수성구 동대구로 789',
								address2: '102동 402호',
							},
							trackingNumber: '987654321098',
						},
					],
				},
				{
					id: 'rf_124',
					title: '포켓몬 피규어 세트',
					description: '다양한 포켓몬 피규어를 한 번에!',
					imageUrl:
						'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
					status: RAFFLE_STATUS.PUBLISHED,
					type: 'multiple',
					currentParticipants: 15,
					maxParticipants: 20,
					deadlineAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
				},
				{
					id: 'rf_125',
					title: '원피스 조로 피규어',
					description: '원피스의 검사 조로 피규어! 한정판입니다',
					imageUrl:
						'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
					status: RAFFLE_STATUS.LOCKED,
					type: 'single',
					currentParticipants: 8,
					maxParticipants: 10,
					deadlineAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
				},
				{
					id: 'rf_126',
					title: '나루토 우즈마키 피규어',
					description: '나루토의 주인공 나루토 피규어! 호카게 버전',
					imageUrl:
						'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
					status: RAFFLE_STATUS.CANCELLED,
					type: 'single',
					currentParticipants: 3,
					maxParticipants: 15,
					deadlineAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
				},
				{
					id: 'rf_127',
					title: '드래곤볼 손오공 피규어',
					description: '드래곤볼의 손오공 초사이어인 버전 피규어',
					imageUrl:
						'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
					status: RAFFLE_STATUS.PUBLISHED,
					type: 'multiple',
					currentParticipants: 12,
					maxParticipants: 25,
					deadlineAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
				},
			]

			const mockParticipatedRaffles: ParticipatedRaffle[] = [
				{
					id: 'rf_128',
					title: '원피스 조로 피규어',
					imageUrl:
						'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
					status: RAFFLE_STATUS.DRAWN,
					isWinner: true,
					itemName: '원피스 조로 피규어',
					shippingStatus: SHIPPING_STATUS.DELIVERED,
					participatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
				},
				{
					id: 'rf_129',
					title: '나루토 우즈마키 피규어',
					imageUrl:
						'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
					status: RAFFLE_STATUS.CANCELLED,
					isWinner: false,
					participatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
				},
				{
					id: 'rf_130',
					title: '드래곤볼 손오공 피규어',
					imageUrl:
						'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
					status: RAFFLE_STATUS.PUBLISHED,
					isWinner: false,
					participatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
				},
				{
					id: 'rf_131',
					title: '원신 가챠 피규어 세트',
					imageUrl:
						'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
					status: RAFFLE_STATUS.DRAWN,
					isWinner: false,
					participatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
				},
				{
					id: 'rf_132',
					title: '스파이더맨 피규어',
					imageUrl:
						'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
					status: RAFFLE_STATUS.DRAWN,
					isWinner: true,
					itemName: '스파이더맨 피규어',
					shippingStatus: SHIPPING_STATUS.SHIPPED,
					participatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 전
				},
				{
					id: 'rf_133',
					title: '아이언맨 피규어',
					imageUrl:
						'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
					status: RAFFLE_STATUS.PUBLISHED,
					isWinner: false,
					participatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1시간 전
				},
				{
					id: 'rf_134',
					title: '배트맨 피규어',
					imageUrl:
						'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
					status: RAFFLE_STATUS.DRAWN,
					isWinner: true,
					itemName: '배트맨 피규어',
					shippingStatus: SHIPPING_STATUS.PENDING,
					participatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10일 전
				},
			]

			setMyRaffles(mockMyRaffles)
			setParticipatedRaffles(mockParticipatedRaffles)
		} catch {
			// TODO: 에러 처리 로직 추가 (토스트 알림 등)
			// console.error(DASHBOARD_MESSAGES.DATA_LOAD_FAILED, error)
		} finally {
			setLoading(false)
		}
	}, [])

	const handleLockRaffle = useCallback(
		async (raffleId: string) => {
			try {
				// TODO: 실제 API 연동 시 사용
				// const response = await raffleApi.lock(raffleId)
				// API 명세서 응답: { raffleId, status, lockedAt }

				// Mock: API 명세서에 맞는 응답 시뮬레이션
				// const mockLockResponse = {
				// 	raffleId,
				// 	status: 'LOCKED',
				// 	lockedAt: new Date().toISOString(),
				// }

				// Mock: 상태 업데이트
				setMyRaffles((prev) =>
					prev.map((raffle) =>
						raffle.id === raffleId ? { ...raffle, status: RAFFLE_STATUS.LOCKED } : raffle,
					),
				)
				addToast({
					title: '래플 잠금 완료',
					description: DASHBOARD_MESSAGES.RAFFLE_LOCKED,
					variant: 'success',
					duration: 3000,
				})
			} catch {
				addToast({
					title: '잠금 실패',
					description: DASHBOARD_MESSAGES.RAFFLE_LOCK_FAILED,
					variant: 'error',
					duration: 4000,
				})
			}
		},
		[addToast],
	)

	const handleCancelRaffle = useCallback(
		async (raffleId: string) => {
			// TODO: 커스텀 확인 다이얼로그로 교체
			if (!confirm('정말로 이 래플을 취소하시겠습니까?')) return

			try {
				// TODO: 실제 API 연동 시 사용
				// const response = await raffleApi.cancel(raffleId)
				// API 명세서 응답: { raffleId, status, cancelledAt, reason }

				// Mock: API 명세서에 맞는 응답 시뮬레이션
				// const mockCancelResponse = {
				// 	raffleId,
				// 	status: RAFFLE_STATUS.CANCELLED,
				// 	cancelledAt: new Date().toISOString(),
				// 	reason: '사용자 요청에 의한 취소',
				// }

				// Mock: 상태 업데이트
				setMyRaffles((prev) =>
					prev.map((raffle) =>
						raffle.id === raffleId ? { ...raffle, status: RAFFLE_STATUS.CANCELLED } : raffle,
					),
				)
				addToast({
					title: '래플 취소 완료',
					description: DASHBOARD_MESSAGES.RAFFLE_CANCELLED,
					variant: 'success',
					duration: 3000,
				})
			} catch {
				addToast({
					title: '취소 실패',
					description: DASHBOARD_MESSAGES.RAFFLE_CANCEL_FAILED,
					variant: 'error',
					duration: 4000,
				})
			}
		},
		[addToast],
	)

	const handleDrawRaffle = useCallback(
		async (raffleId: string) => {
			// TODO: 커스텀 확인 다이얼로그로 교체
			if (!confirm(DASHBOARD_MESSAGES.RAFFLE_DRAW_CONFIRM)) return

			try {
				// TODO: 실제 API 연동 시 사용
				// const result = await raffleApi.draw(raffleId)
				// const winners: Winner[] = result.assignments.map((assignment, index) => ({
				// 	id: `winner_${index + 1}`,
				// 	raffleId,
				// 	participantId: assignment.participantId,
				// 	displayName: assignment.displayName,
				// 	rank: assignment.rank,
				// 	itemName: assignment.itemName,
				// 	shippingStatus: SHIPPING_STATUS.PENDING,
				// }))

				// Mock: 추첨 결과 (API 명세서에 맞게)
				const mockDrawResponse = {
					raffleId,
					seed: {
						externalSeed: '1',
						participantListHash: 'abcdef1234567890',
						masterSeed: 'fedcba0987654321',
					},
					assignments: [
						{
							participantId: 'pt_999',
							displayName: 'GachaKing',
							rank: 1,
							itemName: '피카츄 넨도로이드 #1355',
						},
					],
					publishedAt: new Date().toISOString(),
				}

				// 대시보드용 Winner 타입으로 변환
				const mockWinners: Winner[] = mockDrawResponse.assignments.map((assignment, index) => ({
					id: `winner_${index + 1}`,
					raffleId,
					participantId: assignment.participantId,
					displayName: assignment.displayName,
					rank: assignment.rank,
					itemName: assignment.itemName,
					shippingStatus: SHIPPING_STATUS.PENDING,
					shipping: {
						status: SHIPPING_STATUS.PENDING,
					},
				}))

				setMyRaffles((prev) =>
					prev.map((raffle) =>
						raffle.id === raffleId
							? { ...raffle, status: RAFFLE_STATUS.DRAWN, winners: mockWinners }
							: raffle,
					),
				)
				addToast({
					title: '추첨 완료',
					description: DASHBOARD_MESSAGES.RAFFLE_DRAW_COMPLETED,
					variant: 'success',
					duration: 3000,
				})
			} catch {
				addToast({
					title: '추첨 실패',
					description: DASHBOARD_MESSAGES.RAFFLE_DRAW_FAILED,
					variant: 'error',
					duration: 4000,
				})
			}
		},
		[addToast],
	)

	const handleTrackingSubmit = useCallback((winner: Winner) => {
		setSelectedWinner(winner)
		setShowTrackingDialog(true)
	}, [])

	const handleTrackingConfirm = useCallback(async () => {
		if (!trackingNumber.trim() || !carrier.trim()) {
			addToast({
				title: '입력 오류',
				description: DASHBOARD_MESSAGES.TRACKING_REQUIRED,
				variant: 'error',
				duration: 4000,
			})
			return
		}
		if (!selectedWinner) return

		try {
			// TODO: 실제 API 연동 시 사용
			// const response = await shippingApi.updateShippingInfo(selectedWinner.raffleId, selectedWinner.participantId, {
			// 	carrier,
			// 	trackingNo: trackingNumber,
			// 	status: SHIPPING_STATUS.SHIPPED,
			// })
			// API 명세서 응답: 200 OK (빈 응답)

			// Mock: 상태 업데이트
			setMyRaffles((prev) =>
				prev.map((raffle) => {
					if (raffle.winners) {
						const updatedWinners = raffle.winners.map((winner) =>
							winner.id === selectedWinner.id
								? { ...winner, shippingStatus: SHIPPING_STATUS.SHIPPED, trackingNumber }
								: winner,
						)
						return { ...raffle, winners: updatedWinners }
					}
					return raffle
				}),
			)

			addToast({
				title: '송장번호 등록 완료',
				description: DASHBOARD_MESSAGES.TRACKING_REGISTERED,
				variant: 'success',
				duration: 3000,
			})
			setShowTrackingDialog(false)
			setTrackingNumber('')
			setCarrier('')
			setSelectedWinner(null)
		} catch {
			addToast({
				title: '등록 실패',
				description: DASHBOARD_MESSAGES.TRACKING_REGISTER_FAILED,
				variant: 'error',
				duration: 4000,
			})
		}
	}, [trackingNumber, carrier, selectedWinner, addToast])

	const formatTimeLeft = useCallback((deadlineAt: string) => {
		const timeLeft = new Date(deadlineAt).getTime() - Date.now()
		if (timeLeft <= 0) return '종료됨'

		const hours = Math.floor(timeLeft / (1000 * 60 * 60))
		const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

		if (hours > 0) return `${hours}시간 ${minutes}분`
		return `${minutes}분`
	}, [])

	return {
		// State
		myRaffles,
		participatedRaffles,
		selectedWinner,
		setSelectedWinner,
		trackingNumber,
		setTrackingNumber,
		carrier,
		setCarrier,
		showTrackingDialog,
		setShowTrackingDialog,
		loading,
		// Handlers
		loadDashboardData,
		handleLockRaffle,
		handleCancelRaffle,
		handleDrawRaffle,
		handleTrackingSubmit,
		handleTrackingConfirm,
		formatTimeLeft,
	}
}

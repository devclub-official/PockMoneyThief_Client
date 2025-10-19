import { useState, useCallback } from 'react'
// import { raffleApi, shippingApi } from '@/lib/api' // TODO: 실제 API 연동 시 사용
import type { MyRaffle, ParticipatedRaffle, Winner } from '@/types/dashboard'
import { DIALOG_MESSAGES } from '@/lib/constants/dashboard'

export function useDashboard() {
	const [myRaffles, setMyRaffles] = useState<MyRaffle[]>([])
	const [participatedRaffles, setParticipatedRaffles] = useState<ParticipatedRaffle[]>([])
	const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null)
	const [trackingNumber, setTrackingNumber] = useState('')
	const [carrier, setCarrier] = useState('')
	const [showTrackingDialog, setShowTrackingDialog] = useState(false)
	const [loading, setLoading] = useState(true)

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
					status: 'COMPLETED',
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
							shippingStatus: 'INFO_SUBMITTED',
							shippingInfo: {
								name: '김가차',
								phone: '010-1234-5678',
								zipcode: '12345',
								address1: '서울시 강남구 테헤란로 123',
								address2: '101동 101호',
							},
						},
					],
				},
				{
					id: 'rf_124',
					title: '포켓몬 피규어 세트',
					description: '다양한 포켓몬 피규어를 한 번에!',
					imageUrl:
						'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
					status: 'PUBLISHED',
					type: 'multiple',
					currentParticipants: 15,
					maxParticipants: 20,
					deadlineAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
				},
			]

			const mockParticipatedRaffles: ParticipatedRaffle[] = [
				{
					id: 'rf_125',
					title: '피카츄 넨도로이드 #1355',
					imageUrl:
						'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
					status: 'COMPLETED',
					isWinner: true,
					itemName: '피카츄 넨도로이드 #1355',
					shippingStatus: 'INFO_SUBMITTED',
					participatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
				},
				{
					id: 'rf_126',
					title: '포켓몬 피규어 세트',
					imageUrl:
						'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZpZ3VyZSUyMGNvbGxlY3RpYmxlJTIwdG95fGVufDF8fHx8MTc1ODg2MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
					status: 'PUBLISHED',
					isWinner: false,
					participatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
				},
			]

			setMyRaffles(mockMyRaffles)
			setParticipatedRaffles(mockParticipatedRaffles)
		} catch (error) {
			console.error('대시보드 데이터 로드 실패:', error)
		} finally {
			setLoading(false)
		}
	}, [])

	const handleLockRaffle = useCallback(async (raffleId: string) => {
		try {
			// TODO: 실제 API 연동 시 사용
			// await raffleApi.lock(raffleId)

			// Mock: 상태 업데이트
			setMyRaffles((prev) =>
				prev.map((raffle) =>
					raffle.id === raffleId ? { ...raffle, status: 'LOCKED' as const } : raffle,
				),
			)
			alert(DIALOG_MESSAGES.SUCCESS_LOCK)
		} catch (error) {
			console.error('래플 잠금 실패:', error)
			alert(DIALOG_MESSAGES.ERROR_LOCK)
		}
	}, [])

	const handleCancelRaffle = useCallback(async (raffleId: string) => {
		if (!confirm(DIALOG_MESSAGES.CONFIRM_CANCEL)) return

		try {
			// TODO: 실제 API 연동 시 사용
			// await raffleApi.cancel(raffleId)

			// Mock: 상태 업데이트
			setMyRaffles((prev) =>
				prev.map((raffle) =>
					raffle.id === raffleId ? { ...raffle, status: 'CANCELLED' as const } : raffle,
				),
			)
			alert(DIALOG_MESSAGES.SUCCESS_CANCEL)
		} catch (error) {
			console.error('래플 취소 실패:', error)
			alert(DIALOG_MESSAGES.ERROR_CANCEL)
		}
	}, [])

	const handleDrawRaffle = useCallback(async (raffleId: string) => {
		if (!confirm(DIALOG_MESSAGES.CONFIRM_DRAW)) return

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
			// 	shippingStatus: 'PENDING' as const,
			// }))

			// Mock: 추첨 결과
			const mockWinners: Winner[] = [
				{
					id: 'winner_1',
					raffleId,
					participantId: 'pt_999',
					displayName: 'GachaKing',
					rank: 1,
					itemName: '피카츄 넨도로이드 #1355',
					shippingStatus: 'PENDING',
				},
			]

			setMyRaffles((prev) =>
				prev.map((raffle) =>
					raffle.id === raffleId
						? { ...raffle, status: 'COMPLETED' as const, winners: mockWinners }
						: raffle,
				),
			)
			alert(DIALOG_MESSAGES.SUCCESS_DRAW)
		} catch (error) {
			console.error('추첨 실행 실패:', error)
			alert(DIALOG_MESSAGES.ERROR_DRAW)
		}
	}, [])

	const handleTrackingSubmit = useCallback((winner: Winner) => {
		setSelectedWinner(winner)
		setShowTrackingDialog(true)
	}, [])

	const handleTrackingConfirm = useCallback(async () => {
		if (!trackingNumber.trim() || !carrier.trim()) {
			alert(DIALOG_MESSAGES.ENTER_CARRIER_TRACKING)
			return
		}
		if (!selectedWinner) return

		try {
			// TODO: 실제 API 연동 시 사용
			// await shippingApi.updateShippingInfo(selectedWinner.raffleId, selectedWinner.participantId, {
			// 	carrier,
			// 	trackingNo: trackingNumber,
			// 	status: 'SHIPPED',
			// })

			// Mock: 상태 업데이트
			setMyRaffles((prev) =>
				prev.map((raffle) => {
					if (raffle.winners) {
						const updatedWinners = raffle.winners.map((winner) =>
							winner.id === selectedWinner.id
								? { ...winner, shippingStatus: 'SHIPPED' as const, trackingNumber }
								: winner,
						)
						return { ...raffle, winners: updatedWinners }
					}
					return raffle
				}),
			)

			alert(DIALOG_MESSAGES.SUCCESS_TRACKING)
			setShowTrackingDialog(false)
			setTrackingNumber('')
			setCarrier('')
			setSelectedWinner(null)
		} catch (error) {
			console.error('송장번호 등록 실패:', error)
			alert(DIALOG_MESSAGES.ERROR_TRACKING)
		}
	}, [trackingNumber, carrier, selectedWinner])

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

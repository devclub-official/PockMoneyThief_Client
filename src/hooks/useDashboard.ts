import { useState, useCallback } from 'react'
// import { raffleApi, shippingApi } from '@/lib/api' // TODO: 실제 API 연동 시 사용
import type { MyRaffle, ParticipatedRaffle, Winner } from '@/types/dashboard'

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
							shipping: {
								name: '김가차',
								phone: '010-1234-5678',
								zipcode: '12345',
								address1: '서울시 강남구 테헤란로 123',
								address2: '101동 101호',
								status: 'INFO_SUBMITTED',
							},
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
			// const response = await raffleApi.lock(raffleId)
			// API 명세서 응답: { raffleId, status, lockedAt }

			// Mock: API 명세서에 맞는 응답 시뮬레이션
			const mockLockResponse = {
				raffleId,
				status: 'LOCKED',
				lockedAt: new Date().toISOString(),
			}

			// Mock: 상태 업데이트
			setMyRaffles((prev) =>
				prev.map((raffle) =>
					raffle.id === raffleId ? { ...raffle, status: 'LOCKED' as const } : raffle,
				),
			)
			alert('래플이 잠금되었습니다.')
		} catch (error) {
			console.error('래플 잠금 실패:', error)
			alert('래플 잠금에 실패했습니다.')
		}
	}, [])

	const handleCancelRaffle = useCallback(async (raffleId: string) => {
		if (!confirm('정말로 이 래플을 취소하시겠습니까?')) return

		try {
			// TODO: 실제 API 연동 시 사용
			// const response = await raffleApi.cancel(raffleId)
			// API 명세서 응답: { raffleId, status, cancelledAt, reason }

			// Mock: API 명세서에 맞는 응답 시뮬레이션
			const mockCancelResponse = {
				raffleId,
				status: 'CANCELLED',
				cancelledAt: new Date().toISOString(),
				reason: '사용자 요청에 의한 취소',
			}

			// Mock: 상태 업데이트
			setMyRaffles((prev) =>
				prev.map((raffle) =>
					raffle.id === raffleId ? { ...raffle, status: 'CANCELLED' as const } : raffle,
				),
			)
			alert('래플이 취소되었습니다.')
		} catch (error) {
			console.error('래플 취소 실패:', error)
			alert('래플 취소에 실패했습니다.')
		}
	}, [])

	const handleDrawRaffle = useCallback(async (raffleId: string) => {
		if (!confirm('추첨을 실행하시겠습니까? 실행 후에는 되돌릴 수 없습니다.')) return

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
				shippingStatus: 'PENDING' as const,
				shipping: {
					status: 'PENDING' as const,
				},
			}))

			setMyRaffles((prev) =>
				prev.map((raffle) =>
					raffle.id === raffleId
						? { ...raffle, status: 'COMPLETED' as const, winners: mockWinners }
						: raffle,
				),
			)
			alert('추첨이 완료되었습니다!')
		} catch (error) {
			console.error('추첨 실행 실패:', error)
			alert('추첨 실행에 실패했습니다.')
		}
	}, [])

	const handleTrackingSubmit = useCallback((winner: Winner) => {
		setSelectedWinner(winner)
		setShowTrackingDialog(true)
	}, [])

	const handleTrackingConfirm = useCallback(async () => {
		if (!trackingNumber.trim() || !carrier.trim()) {
			alert('택배사와 송장번호를 모두 입력해주세요.')
			return
		}
		if (!selectedWinner) return

		try {
			// TODO: 실제 API 연동 시 사용
			// const response = await shippingApi.updateShippingInfo(selectedWinner.raffleId, selectedWinner.participantId, {
			// 	carrier,
			// 	trackingNo: trackingNumber,
			// 	status: 'SHIPPED',
			// })
			// API 명세서 응답: 200 OK (빈 응답)

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

			alert('송장번호가 등록되었습니다!')
			setShowTrackingDialog(false)
			setTrackingNumber('')
			setCarrier('')
			setSelectedWinner(null)
		} catch (error) {
			console.error('송장번호 등록 실패:', error)
			alert('송장번호 등록에 실패했습니다.')
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

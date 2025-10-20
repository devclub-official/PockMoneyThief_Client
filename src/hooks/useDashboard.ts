import { useState, useCallback } from 'react'
// import { raffleApi, shippingApi } from '@/lib/api' // TODO: 실제 API 연동 시 사용
import type { Winner } from '@/types/dashboard'
import { DASHBOARD_MESSAGES } from '@/lib/constants'
import { useToast } from '@/components/ui/Toast'

export function useDashboard() {
	const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null)
	const [trackingNumber, setTrackingNumber] = useState('')
	const [carrier, setCarrier] = useState('')
	const [showTrackingDialog, setShowTrackingDialog] = useState(false)
	// 서버에서 prefetch하므로 loading 상태 불필요
	const { addToast } = useToast()

	const handleLockRaffle = useCallback(async () => {
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

			// TODO: 실제 API 연동 시 서버 상태 업데이트
			// 현재는 토스트만 표시
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
	}, [addToast])

	const handleCancelRaffle = useCallback(async () => {
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

			// TODO: 실제 API 연동 시 서버 상태 업데이트
			// 현재는 토스트만 표시
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
	}, [addToast])

	const handleDrawRaffle = useCallback(async () => {
		// TODO: 커스텀 확인 다이얼로그로 교체
		if (!confirm(DASHBOARD_MESSAGES.RAFFLE_DRAW_CONFIRM)) return

		try {
			// TODO: 실제 API 연동 시 사용
			// const result = await raffleApi.draw(raffleId, { externalSeed: '1' })
			// const winners: Winner[] = result.assignments.map((assignment, index) => ({
			// 	id: `winner_${index + 1}`,
			// 	raffleId,
			// 	participantId: assignment.participantId,
			// 	displayName: assignment.displayName,
			// 	rank: assignment.rank,
			// 	itemName: assignment.itemName,
			// 	shippingStatus: SHIPPING_STATUS.PENDING,
			// }))

			// TODO: 실제 API 연동 시 추첨 결과 처리
			// const mockDrawResponse = {
			// 	raffleId,
			// 	seed: {
			// 		externalSeed: '1',
			// 		participantListHash: 'abcdef1234567890',
			// 		masterSeed: 'fedcba0987654321',
			// 	},
			// 	assignments: [
			// 		{
			// 			participantId: 'pt_999',
			// 			displayName: 'GachaKing',
			// 			rank: 1,
			// 			itemName: '피카츄 넨도로이드 #1355',
			// 		},
			// 	],
			// 	publishedAt: new Date().toISOString(),
			// }

			// TODO: 실제 API 연동 시 Winner 타입으로 변환
			// const mockWinners: Winner[] = mockDrawResponse.assignments.map((assignment, index) => ({
			// 	id: `winner_${index + 1}`,
			// 	raffleId,
			// 	participantId: assignment.participantId,
			// 	displayName: assignment.displayName,
			// 	rank: assignment.rank,
			// 	itemName: assignment.itemName,
			// 	shippingStatus: SHIPPING_STATUS.PENDING,
			// 	shipping: {
			// 		status: SHIPPING_STATUS.PENDING,
			// 	},
			// }))

			// TODO: 실제 API 연동 시 서버 상태 업데이트
			// 현재는 토스트만 표시
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
	}, [addToast])

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
			// API 명세서 응답: { winnerId, raffleId, carrier, trackingNo, status, updatedAt }

			// TODO: 실제 API 연동 시 서버 상태 업데이트
			// 현재는 토스트만 표시

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
		selectedWinner,
		setSelectedWinner,
		trackingNumber,
		setTrackingNumber,
		carrier,
		setCarrier,
		showTrackingDialog,
		setShowTrackingDialog,
		// Handlers
		handleLockRaffle,
		handleCancelRaffle,
		handleDrawRaffle,
		handleTrackingSubmit,
		handleTrackingConfirm,
		formatTimeLeft,
	}
}

'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useEventPolling } from '@/hooks/useEventPolling'
import { Loader2, Gift } from 'lucide-react'

interface EventWaitingStateProps {
	raffleId: string
	onCheckResult: () => void
}

export function EventWaitingState({ raffleId, onCheckResult }: EventWaitingStateProps) {
	const { isDrawn, isLoading } = useEventPolling(raffleId, true, 1000)
	const [dots, setDots] = useState('.')

	// 로딩 애니메이션을 위한 점 애니메이션
	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => {
				if (prev === '...') return '.'
				return prev + '.'
			})
		}, 500)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 p-6">
			{/* 이벤트 이미지 */}
			<div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-pink-200 bg-gradient-to-br from-pink-100 to-purple-100">
				<div className="flex h-full items-center justify-center text-9xl">🍭</div>
			</div>

			{/* 상태 메시지 */}
			<div className="text-center">
				{!isDrawn ? (
					<>
						<div className="mb-4 flex items-center justify-center gap-2">
							<Loader2 className="h-6 w-6 animate-spin text-amber-600" />
							<h2 className="text-2xl font-bold">추첨 대기 중{dots}</h2>
						</div>
						<p className="text-muted-foreground">
							관리자가 추첨을 완료할 때까지 기다려주세요.
							<br />
							추첨이 완료되면 자동으로 결과 확인 버튼이 나타납니다.
						</p>
					</>
				) : (
					<>
						<div className="mb-4 flex items-center justify-center gap-2 text-emerald-600">
							<Gift className="h-6 w-6" />
							<h2 className="text-2xl font-bold">추첨 완료!</h2>
						</div>
						<p className="text-muted-foreground">
							추첨이 완료되었습니다.
							<br />
							아래 버튼을 클릭하여 결과를 확인하세요.
						</p>
					</>
				)}
			</div>

			{/* 결과 확인 버튼 */}
			{isDrawn && (
				<Button
					onClick={onCheckResult}
					size="lg"
					className="cursor-pointer px-8"
					disabled={isLoading}
				>
					결과 확인하기
				</Button>
			)}

			{/* 참여 정보 */}
			<div className="bg-muted/50 mt-8 rounded-lg border p-4 text-center text-sm text-muted-foreground">
				<p>이벤트 ID: {raffleId}</p>
				<p className="mt-1">이 페이지를 닫지 말고 기다려주세요.</p>
			</div>
		</div>
	)
}

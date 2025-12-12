'use client'

import { useState } from 'react'
import { EventDetailModal } from './EventDetailModal'
import { EventWaitingState } from './EventWaitingState'
import { EventResultDisplay } from './EventResultDisplay'
import { useEventResult } from '@/hooks/useEventResult'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/Dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import type { V2ParticipantResponse, RaffleSummaryResponse } from '@/types'

interface EventFlowProps {
	eventId: string
	raffleInfo?: RaffleSummaryResponse
	initialOpen?: boolean
	onClose?: () => void
}

type FlowStep = 'detail' | 'waiting' | 'result'

/**
 * 츄파춥스 이벤트 전체 플로우를 관리하는 컴포넌트
 * 1. 이벤트 상세 모달 (참여하기)
 * 2. 대기 상태 (폴링)
 * 3. 결과 화면
 */
export function EventFlow({ eventId, raffleInfo, initialOpen = false, onClose }: EventFlowProps) {
	const [currentStep, setCurrentStep] = useState<FlowStep>(initialOpen ? 'detail' : 'detail')
	const [showDetailModal, setShowDetailModal] = useState(initialOpen)
	const [participantInfo, setParticipantInfo] = useState<V2ParticipantResponse | null>(null)

	const {
		data: resultData,
		isLoading: isResultLoading,
		refetch: refetchResult,
	} = useEventResult(eventId, currentStep === 'result')

	const handleParticipateSuccess = (info: V2ParticipantResponse) => {
		setParticipantInfo(info)
		setShowDetailModal(false)
		setCurrentStep('waiting')
	}

	const handleCheckResult = async () => {
		setCurrentStep('result')
		await refetchResult()
	}

	const handleCloseFlow = () => {
		setShowDetailModal(false)
		setCurrentStep('detail')
		setParticipantInfo(null)
		onClose?.()
	}

	return (
		<>
			{/* Step 1: 이벤트 상세 모달 */}
			<EventDetailModal
				open={showDetailModal}
				onOpenChange={(open) => {
					setShowDetailModal(open)
					if (!open && currentStep === 'detail') {
						onClose?.()
					}
				}}
				eventId={eventId}
				raffleInfo={raffleInfo}
				onParticipateSuccess={handleParticipateSuccess}
			/>

			{/* Step 2 & 3: 대기 및 결과 모달 */}
			<Dialog
				open={currentStep === 'waiting' || currentStep === 'result'}
				onOpenChange={(open) => {
					if (!open) handleCloseFlow()
				}}
			>
				<DialogContent className="max-w-2xl sm:max-w-xl">
					<VisuallyHidden.Root>
						<DialogTitle>이벤트 진행 중</DialogTitle>
						<DialogDescription>이벤트 추첨 대기 및 결과를 확인하는 화면입니다.</DialogDescription>
					</VisuallyHidden.Root>

					{/* Step 2: 대기 상태 */}
					{currentStep === 'waiting' && participantInfo && (
						<div className="min-h-[400px]">
							<EventWaitingState raffleId={eventId} onCheckResult={handleCheckResult} />
						</div>
					)}

					{/* Step 3: 결과 화면 */}
					{currentStep === 'result' && (
						<div className="max-h-[80vh] overflow-y-auto">
							{isResultLoading ? (
								<div className="flex min-h-[400px] items-center justify-center">
									<LoadingSpinner />
								</div>
							) : resultData ? (
								<EventResultDisplay
									result={resultData}
									participantInfo={participantInfo}
									onClose={handleCloseFlow}
								/>
							) : (
								<div className="py-20 text-center">
									<p className="text-muted-foreground">결과를 불러올 수 없습니다.</p>
									<Button onClick={handleCloseFlow} className="mt-4">
										닫기
									</Button>
								</div>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	)
}

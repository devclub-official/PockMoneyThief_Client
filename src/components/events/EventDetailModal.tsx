'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useEventParticipate } from '@/hooks/useEventParticipate'
import { Gift } from 'lucide-react'

interface EventDetailModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	eventId: string
	onParticipateSuccess: (participantId: string) => void
}

export function EventDetailModal({
	open,
	onOpenChange,
	eventId,
	onParticipateSuccess,
}: EventDetailModalProps) {
	const [displayName, setDisplayName] = useState('')
	const { participate, isLoading } = useEventParticipate()

	const handleParticipate = async () => {
		if (!displayName.trim()) {
			alert('이름을 입력해주세요.')
			return
		}

		try {
			const response = await participate(eventId, { displayName: displayName.trim() })
			onParticipateSuccess(response.participantId)
		} catch (error) {
			console.error('참여 실패:', error)
			alert('참여에 실패했습니다. 다시 시도해주세요.')
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>🍭 사탕뽑기 이벤트</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* 이벤트 이미지 */}
					<div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-gradient-to-br from-pink-100 to-purple-100">
						<div className="flex h-full items-center justify-center text-8xl">🍬</div>
					</div>

					{/* 이벤트 설명 */}
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-pink-600">
							<Gift className="h-5 w-5" />
							<span className="font-semibold">당첨 상품</span>
						</div>
						<p className="text-sm text-muted-foreground">
							맛있는 사탕을 받아갈 기회!
							<br />
							선물코드를 받아 카카오톡 선물하기에서 등록하세요.
						</p>
					</div>

					{/* 참여 정보 입력 */}
					<div className="space-y-3">
						<div>
							<label htmlFor="displayName" className="text-sm font-medium">
								이름
							</label>
							<Input
								id="displayName"
								type="text"
								placeholder="이름을 입력하세요"
								value={displayName}
								onChange={(e) => setDisplayName(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !isLoading) {
										handleParticipate()
									}
								}}
								disabled={isLoading}
								className="mt-1"
							/>
						</div>
					</div>

					{/* 추첨하기 버튼 */}
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="flex-1"
							disabled={isLoading}
						>
							취소하기
						</Button>
						<Button
							onClick={handleParticipate}
							className="flex-1 cursor-pointer"
							disabled={isLoading || !displayName.trim()}
						>
							{isLoading ? '처리중...' : '추첨하기'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

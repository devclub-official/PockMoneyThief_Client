import { memo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { StatusBadge } from './StatusBadge'
import { ShippingStatusBadge } from './ShippingStatusBadge'
import { CheckCircle, Clock } from 'lucide-react'
import type { ParticipatedRaffle } from '@/types/dashboard'
import { SHIPPING_STATUS } from '@/lib/constants'
import { ShippingAddressDialog } from '@/components/dashboard/ShippingAddressDialog'

interface ParticipatedRaffleCardProps {
	raffle: ParticipatedRaffle
	onViewDetail: (id: string) => void
	onViewResult: (id: string) => void
}

export const ParticipatedRaffleCard = memo(
	({ raffle, onViewDetail, onViewResult }: ParticipatedRaffleCardProps) => {
		const [showAddressDialog, setShowAddressDialog] = useState(false)
		let drawnLabelText = ''
		let drawnButtonCallback = null

		if (raffle.status === 'DRAWN') {
			if (raffle.shippingStatus === SHIPPING_STATUS.PENDING) {
				drawnLabelText = '배송지 입력하기'
				drawnButtonCallback = () => setShowAddressDialog(true)
			} else {
				drawnLabelText = '결과보기'
				drawnButtonCallback = () => onViewResult(raffle.id)
			}
		}

		return (
			<>
				<Card key={raffle.id} aria-label={`참여한 추첨 카드 ${raffle.title}`}>
					<CardHeader>
						<div className="flex items-start gap-4">
							<div className="relative h-12 w-12 overflow-hidden rounded-lg">
								<ImageWithFallback
									src={raffle.imageUrl}
									alt={raffle.title}
									className="h-full w-full object-cover"
								/>
							</div>
							<div className="flex-1">
								<div className="mb-1 flex items-center gap-2">
									<CardTitle className="text-lg">{raffle.title}</CardTitle>
									<StatusBadge status={raffle.status} />
									{raffle.isWinner && (
										<Badge variant="default" className="bg-yellow-500" aria-label="당첨자 배지">
											당첨!
										</Badge>
									)}
								</div>
								<CardDescription
									aria-label={`참여한 날짜 ${new Date(raffle.participatedAt).toLocaleDateString('ko-KR')}`}
								>
									참여일: {new Date(raffle.participatedAt).toLocaleDateString('ko-KR')}
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* 참여자 수 정보 (참여한 추첨에서는 표시하지 않음) */}
						{raffle.status === 'PUBLISHED' && (
							<div className="flex items-center justify-between text-sm">
								<span className="flex items-center gap-1" aria-label="참여한 시간">
									<Clock className="h-4 w-4" />
									참여 시간
								</span>
								<span>{new Date(raffle.participatedAt).toLocaleString('ko-KR')}</span>
							</div>
						)}

						{/* 당첨 상품 정보 */}
						{raffle.isWinner && raffle.itemName && (
							<div
								className="rounded-lg border border-yellow-200 bg-yellow-50 p-3"
								aria-label="당첨 상품 정보 카드"
							>
								<div className="mb-1 flex items-center gap-2">
									<CheckCircle className="h-4 w-4 text-yellow-600" aria-hidden="true" />
									<span className="font-medium text-yellow-800">당첨 상품</span>
								</div>
								<p className="text-sm text-yellow-700">{raffle.itemName}</p>
								{raffle.shippingStatus && (
									<div className="mt-2">
										<ShippingStatusBadge status={raffle.shippingStatus} />
									</div>
								)}
							</div>
						)}

						{/* 액션 버튼들 */}
						<div className="flex gap-2">
							<Button
								variant="outline"
								onClick={() => onViewDetail(raffle.id)}
								className="flex-1"
								aria-label={`상세보기 버튼 ${raffle.title}`}
							>
								상세보기
							</Button>
							{raffle.status === 'DRAWN' && (
								<Button
									variant="outline"
									onClick={drawnButtonCallback ?? undefined}
									className="flex-1"
									aria-label={`${drawnLabelText} 버튼 ${raffle.title}`}
								>
									{drawnLabelText}
								</Button>
							)}
						</div>
					</CardContent>
				</Card>
				<ShippingAddressDialog
					raffleId={raffle.id}
					open={showAddressDialog}
					onOpenChange={setShowAddressDialog}
				/>
			</>
		)
	},
)

ParticipatedRaffleCard.displayName = 'ParticipatedRaffleCard'

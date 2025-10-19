import { memo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { StatusBadge } from './StatusBadge'
import { ShippingStatusBadge } from './ShippingStatusBadge'
import { Users, Clock, Lock, X, Play, Truck } from 'lucide-react'
import type { RaffleCardProps } from '@/types/dashboard'
import { RAFFLE_ACTIONS, ACCESSIBILITY_LABELS } from '@/lib/constants/dashboard'

export const RaffleCard = memo(
	({
		raffle,
		onLock,
		onCancel,
		onDraw,
		onTrackingSubmit,
		formatTimeLeft,
		router,
	}: RaffleCardProps) => {
		return (
			<Card key={raffle.id}>
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
							</div>
							<CardDescription className="line-clamp-2">{raffle.description}</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between text-sm">
						<span
							className="flex items-center gap-1"
							aria-label={ACCESSIBILITY_LABELS.PARTICIPANTS}
						>
							<Users className="h-4 w-4" />
							참여자
						</span>
						<span>
							{raffle.currentParticipants}/{raffle.maxParticipants}
						</span>
					</div>

					{raffle.status === 'PUBLISHED' && (
						<div className="flex items-center justify-between text-sm">
							<span className="flex items-center gap-1" aria-label={ACCESSIBILITY_LABELS.TIME_LEFT}>
								<Clock className="h-4 w-4" />
								남은 시간
							</span>
							<span>{formatTimeLeft(raffle.deadlineAt)}</span>
						</div>
					)}

					{/* 관리 버튼들 */}
					{raffle.status === 'PUBLISHED' && (
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => onLock(raffle.id)}
								className="flex-1"
								aria-label={`${raffle.title} 래플 잠금`}
							>
								<Lock className="mr-2 h-4 w-4" />
								{RAFFLE_ACTIONS.LOCK}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => onCancel(raffle.id)}
								className="flex-1"
								aria-label={`${raffle.title} 래플 취소`}
							>
								<X className="mr-2 h-4 w-4" />
								{RAFFLE_ACTIONS.CANCEL}
							</Button>
						</div>
					)}

					{raffle.status === 'LOCKED' && (
						<Button
							variant="default"
							size="sm"
							onClick={() => onDraw(raffle.id)}
							className="w-full"
							aria-label={`${raffle.title} 추첨 실행`}
						>
							<Play className="mr-2 h-4 w-4" />
							{RAFFLE_ACTIONS.DRAW}
						</Button>
					)}

					{raffle.status === 'COMPLETED' && raffle.winners && (
						<div className="space-y-3">
							<h4 className="font-medium" aria-label={ACCESSIBILITY_LABELS.WINNER_MANAGEMENT}>
								당첨자 관리
							</h4>
							{raffle.winners.map((winner, index) => (
								<div key={index} className="space-y-2 rounded-lg border p-3">
									<div className="flex items-center justify-between">
										<span className="font-medium">{winner.displayName}</span>
										<ShippingStatusBadge status={winner.shippingStatus} />
									</div>
									<p className="text-muted-foreground text-sm">{winner.itemName}</p>

									{winner.shippingInfo && (
										<div
											className="text-muted-foreground space-y-1 text-xs"
											aria-label={ACCESSIBILITY_LABELS.SHIPPING_INFO}
										>
											<p>이름: {winner.shippingInfo.name}</p>
											<p>연락처: {winner.shippingInfo.phone}</p>
											<p>주소: {winner.shippingInfo.address1}</p>
										</div>
									)}

									{winner.shippingStatus === 'INFO_SUBMITTED' && (
										<Button
											size="sm"
											variant="outline"
											onClick={() => onTrackingSubmit(winner)}
											aria-label={`${winner.displayName} 송장번호 입력`}
										>
											<Truck className="mr-2 h-4 w-4" />
											{RAFFLE_ACTIONS.TRACKING_INPUT}
										</Button>
									)}

									{winner.trackingNumber && (
										<div className="text-xs" aria-label={ACCESSIBILITY_LABELS.TRACKING_NUMBER}>
											<span className="text-muted-foreground">송장번호: </span>
											<span className="font-mono">{winner.trackingNumber}</span>
										</div>
									)}
								</div>
							))}
						</div>
					)}

					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => router.push(`/raffle/${raffle.id}`)}
							className="flex-1"
							aria-label={`${raffle.title} 상세보기`}
						>
							{RAFFLE_ACTIONS.VIEW_DETAILS}
						</Button>
						{raffle.status === 'COMPLETED' && (
							<Button
								variant="outline"
								onClick={() => router.push(`/raffles/${raffle.id}/result`)}
								className="flex-1"
								aria-label={`${raffle.title} 결과보기`}
							>
								{RAFFLE_ACTIONS.VIEW_RESULTS}
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		)
	},
)

RaffleCard.displayName = 'RaffleCard'

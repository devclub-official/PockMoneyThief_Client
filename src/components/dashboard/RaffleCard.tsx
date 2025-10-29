import { memo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { StatusBadge } from './StatusBadge'
import { ShippingStatusBadge } from './ShippingStatusBadge'
import { Users, Clock, Lock, X, Play, Truck } from 'lucide-react'
import type { RaffleCardProps } from '@/types/dashboard'

// 관리 버튼 렌더링 함수
function renderManagementButtons(
	raffle: RaffleCardProps['raffle'],
	onLock: RaffleCardProps['onLock'],
	onCancel: RaffleCardProps['onCancel'],
	onDraw: RaffleCardProps['onDraw'],
) {
	if (raffle.status === 'PUBLISHED') {
		return (
			<div className="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onLock(raffle.id)}
					className="flex-1"
					aria-label={`${raffle.title} 래플 잠금`}
				>
					<Lock className="mr-2 h-4 w-4" />
					잠금
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => onCancel(raffle.id)}
					className="flex-1"
					aria-label={`${raffle.title} 래플 취소`}
				>
					<X className="mr-2 h-4 w-4" />
					취소
				</Button>
			</div>
		)
	}

	if (raffle.status === 'LOCKED') {
		return (
			<Button
				variant="default"
				size="sm"
				onClick={() => onDraw(raffle.id)}
				className="w-full"
				aria-label={`${raffle.title} 추첨 실행`}
			>
				<Play className="mr-2 h-4 w-4" />
				추첨 실행
			</Button>
		)
	}

	return null
}

// 당첨자 관리 UI 컴포넌트
function WinnerManagementSection({
	winners,
	onTrackingSubmit,
}: {
	winners: NonNullable<RaffleCardProps['raffle']['winners']>
	onTrackingSubmit: RaffleCardProps['onTrackingSubmit']
}) {
	return (
		<div className="space-y-3">
			<h4 className="font-medium" aria-label="당첨자 관리">
				당첨자 관리
			</h4>
			{winners.map((winner, index) => (
				<div key={index} className="space-y-2 rounded-lg border p-3">
					<div className="flex items-center justify-between">
						<span className="font-medium">{winner.displayName}</span>
						<ShippingStatusBadge status={winner.shippingStatus} />
					</div>
					<p className="text-muted-foreground text-sm">{winner.itemName}</p>

					{winner.shippingInfo && (
						<div className="text-muted-foreground space-y-1 text-xs" aria-label="배송 정보">
							<p>이름: {winner.shippingInfo.name}</p>
							<p>연락처: {winner.shippingInfo.phone}</p>
							<p>주소: {winner.shippingInfo.address1}</p>
						</div>
					)}

					{winner.shippingStatus === 'SAVED' && (
						<Button
							size="sm"
							variant="outline"
							onClick={() => onTrackingSubmit(winner)}
							aria-label={`${winner.displayName} 송장번호 입력`}
						>
							<Truck className="mr-2 h-4 w-4" />
							송장번호 입력
						</Button>
					)}

					{winner.trackingNumber && (
						<div className="text-xs" aria-label="송장번호">
							<span className="text-muted-foreground">송장번호: </span>
							<span className="font-mono">{winner.trackingNumber}</span>
						</div>
					)}
				</div>
			))}
		</div>
	)
}

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
						<span className="flex items-center gap-1" aria-label="참여자 수">
							<Users className="h-4 w-4" />
							참여자
						</span>
						<span>
							{raffle.currentParticipants}/{raffle.maxParticipants}
						</span>
					</div>

					{raffle.status === 'PUBLISHED' && (
						<div className="flex items-center justify-between text-sm">
							<span className="flex items-center gap-1" aria-label="남은 시간">
								<Clock className="h-4 w-4" />
								남은 시간
							</span>
							<span>{formatTimeLeft(raffle.deadlineAt)}</span>
						</div>
					)}

					{/* 관리 버튼들 */}
					{renderManagementButtons(raffle, onLock, onCancel, onDraw)}

					{raffle.status === 'DRAWN' && raffle.winners && (
						<WinnerManagementSection winners={raffle.winners} onTrackingSubmit={onTrackingSubmit} />
					)}

					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => router.push(`/raffle/${raffle.id}`)}
							className="flex-1"
							aria-label={`${raffle.title} 상세보기`}
						>
							상세보기
						</Button>
						{raffle.status === 'DRAWN' && (
							<Button
								variant="outline"
								onClick={() => router.push(`/raffles/${raffle.id}/result`)}
								className="flex-1"
								aria-label={`${raffle.title} 결과보기`}
							>
								결과보기
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		)
	},
)

RaffleCard.displayName = 'RaffleCard'

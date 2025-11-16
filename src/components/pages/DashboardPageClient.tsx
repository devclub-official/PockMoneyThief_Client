'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { RaffleCard } from '@/components/dashboard/RaffleCard'
import { ParticipatedRaffleCard } from '@/components/dashboard/ParticipatedRaffleCard'
import { TrackingDialog } from '@/components/dashboard/TrackingDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { useDashboard } from '@/hooks/useDashboard'
import { DASHBOARD_UI_TEXT } from '@/lib/constants'
import { Plus, Package, Users } from 'lucide-react'
import type { MyRaffle, ParticipatedRaffle } from '@/types/dashboard'

interface DashboardPageClientProps {
	initialMyRaffles: MyRaffle[]
	initialParticipatedRaffles: ParticipatedRaffle[]
}

export function DashboardPageClient({
	initialMyRaffles,
	initialParticipatedRaffles,
}: DashboardPageClientProps) {
	const router = useRouter()
	const {
		selectedWinner,
		trackingNumber,
		setTrackingNumber,
		carrier,
		setCarrier,
		showTrackingDialog,
		setShowTrackingDialog,
		handleLockRaffle,
		handleCancelRaffle,
		handleDrawRaffle,
		handleTrackingSubmit,
		handleTrackingConfirm,
		formatTimeLeft,
	} = useDashboard()

	// 서버에서 prefetch된 초기 데이터를 로컬 상태로 관리 (취소 시 상태만 변경)
	const [displayMyRaffles, setDisplayMyRaffles] = React.useState(initialMyRaffles)
	const [displayParticipatedRaffles] = React.useState(initialParticipatedRaffles)

	const handleLockAndMarkLocked = React.useCallback(
		async (raffleId: string) => {
			const ok = await handleLockRaffle(raffleId)
			if (ok) {
				setDisplayMyRaffles((prev) =>
					prev.map((r) => (r.id === raffleId ? { ...r, status: 'LOCKED' } : r)),
				)
			}
		},
		[handleLockRaffle],
	)

	const handleCancelAndMarkCancelled = React.useCallback(
		async (raffleId: string) => {
			const ok = await handleCancelRaffle(raffleId)
			if (ok) {
				setDisplayMyRaffles((prev) =>
					prev.map((r) => (r.id === raffleId ? { ...r, status: 'CANCELLED' } : r)),
				)
			}
		},
		[handleCancelRaffle],
	)

	const handleDrawAndMarkDrawn = React.useCallback(
		async (raffleId: string) => {
			const ok = await handleDrawRaffle(raffleId)
			if (ok) {
				setDisplayMyRaffles((prev) =>
					prev.map((r) => (r.id === raffleId ? { ...r, status: 'DRAWN' } : r)),
				)
			}
		},
		[handleDrawRaffle],
	)

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-foreground text-2xl font-semibold">{DASHBOARD_UI_TEXT.PAGE_TITLE}</h1>
				<p className="text-muted-foreground">{DASHBOARD_UI_TEXT.PAGE_DESCRIPTION}</p>
			</div>

			<Tabs defaultValue="my-raffles" className="space-y-6">
				<TabsList className="grid w-1/2 grid-cols-2" role="tablist">
					<TabsTrigger
						value="my-raffles"
						className="w-full"
						role="tab"
						aria-controls="my-raffles-content"
					>
						{DASHBOARD_UI_TEXT.MY_RAFFLES_TAB}
					</TabsTrigger>
					<TabsTrigger
						value="participated"
						className="w-full"
						role="tab"
						aria-controls="participated-content"
					>
						{DASHBOARD_UI_TEXT.PARTICIPATED_TAB}
					</TabsTrigger>
				</TabsList>

				{/* 내가 등록한 추첨 */}
				<TabsContent
					value="my-raffles"
					className="space-y-6"
					id="my-raffles-content"
					role="tabpanel"
					aria-labelledby="my-raffles-tab"
				>
					<div className="flex items-center justify-between">
						<h2
							className="text-xl font-semibold"
							aria-label={`등록한 추첨 개수 ${displayMyRaffles.length}`}
						>
							{DASHBOARD_UI_TEXT.MY_RAFFLES_HEADER} ({displayMyRaffles.length})
						</h2>
						<Button onClick={() => router.push('/create')} aria-label="새로운 추첨 등록하기">
							<Plus className="mr-2 h-4 w-4" />
							{DASHBOARD_UI_TEXT.CREATE_RAFFLE_BUTTON}
						</Button>
					</div>

					{displayMyRaffles.length === 0 ? (
						<Card className="text-center" aria-label="등록한 추첨이 없음을 알리는 카드">
							<CardContent className="py-12">
								<EmptyState
									icon={Package}
									title={DASHBOARD_UI_TEXT.NO_MY_RAFFLES_TITLE}
									description={DASHBOARD_UI_TEXT.NO_MY_RAFFLES_DESCRIPTION}
									buttonText={DASHBOARD_UI_TEXT.CREATE_RAFFLE_BUTTON}
									onButtonClick={() => router.push('/create')}
									ariaLabel="등록한 추첨이 없음을 알리는 카드"
								/>
							</CardContent>
						</Card>
					) : (
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{displayMyRaffles.map((raffle) => (
								<RaffleCard
									key={raffle.id}
									raffle={raffle}
									onLock={handleLockAndMarkLocked}
									onCancel={handleCancelAndMarkCancelled}
									onDraw={handleDrawAndMarkDrawn}
									onTrackingSubmit={handleTrackingSubmit}
									formatTimeLeft={formatTimeLeft}
									router={router}
								/>
							))}
						</div>
					)}
				</TabsContent>

				{/* 참여한 추첨 */}
				<TabsContent
					value="participated"
					className="space-y-6"
					id="participated-content"
					role="tabpanel"
					aria-labelledby="participated-tab"
				>
					<h2
						className="text-xl font-semibold"
						aria-label={`참여한 추첨 개수 ${displayParticipatedRaffles.length}`}
					>
						{DASHBOARD_UI_TEXT.PARTICIPATED_HEADER} ({displayParticipatedRaffles.length})
					</h2>

					{displayParticipatedRaffles.length === 0 ? (
						<Card className="text-center" aria-label="참여한 추첨이 없음을 알리는 카드">
							<CardContent className="py-12">
								<EmptyState
									icon={Users}
									title={DASHBOARD_UI_TEXT.NO_PARTICIPATED_TITLE}
									description={DASHBOARD_UI_TEXT.NO_PARTICIPATED_DESCRIPTION}
									buttonText={DASHBOARD_UI_TEXT.BROWSE_RAFFLES_BUTTON}
									onButtonClick={() => router.push('/')}
									ariaLabel="참여한 추첨이 없음을 알리는 카드"
								/>
							</CardContent>
						</Card>
					) : (
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{displayParticipatedRaffles.map((raffle) => (
								<ParticipatedRaffleCard
									key={raffle.id}
									raffle={raffle}
									onViewDetail={(id) => router.push(`/raffle/${id}`)}
									onViewResult={(id) => router.push(`/raffles/${id}/result`)}
									onViewMyResult={(id) => router.push(`/my/raffles/${id}/result`)}
								/>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>

			<TrackingDialog
				open={showTrackingDialog}
				onOpenChange={setShowTrackingDialog}
				selectedWinner={selectedWinner}
				trackingNumber={trackingNumber}
				setTrackingNumber={setTrackingNumber}
				carrier={carrier}
				setCarrier={setCarrier}
				onSubmit={handleTrackingConfirm}
			/>
		</div>
	)
}

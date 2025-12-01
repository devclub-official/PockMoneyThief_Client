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
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useDashboard } from '@/hooks/useDashboard'
import { useMyRaffles, useParticipatedRaffles, useWins } from '@/hooks/useMyRaffles'
import { DASHBOARD_UI_TEXT, DASHBOARD_MESSAGES } from '@/lib/constants'
import { Plus, Package, Users } from 'lucide-react'

export function DashboardPageClient() {
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

	// React Query로 클라이언트에서 데이터 fetch (인증 쿠키 자동 포함)
	const {
		data: myRafflesData = [],
		isLoading: isLoadingMyRaffles,
		isError: isErrorMyRaffles,
	} = useMyRaffles()

	const {
		data: participatedRafflesData = [],
		isLoading: isLoadingParticipated,
		isError: isErrorParticipated,
	} = useParticipatedRaffles()

	const { data: winsData, isLoading: isLoadingWins, isError: isErrorWins } = useWins()

	const displayWins = winsData?.wins || []

	// 로딩 상태
	const isLoading = isLoadingMyRaffles || isLoadingParticipated || isLoadingWins

	// 에러 상태
	const isError = isErrorMyRaffles || isErrorParticipated || isErrorWins

	// 로컬 상태로 관리 (취소/잠금 시 상태만 변경)
	// React Query 데이터를 직접 사용하되, 로컬 상태는 업데이트 시에만 사용
	const [displayMyRaffles, setDisplayMyRaffles] = React.useState(myRafflesData)
	const [displayParticipatedRaffles, setDisplayParticipatedRaffles] =
		React.useState(participatedRafflesData)

	// React Query 데이터가 변경되면 로컬 상태 업데이트
	// useRef로 이전 값 추적하여 무한 루프 방지
	const prevMyRafflesRef = React.useRef<string>('')
	const prevParticipatedRafflesRef = React.useRef<string>('')

	React.useEffect(() => {
		const currentKey = JSON.stringify(myRafflesData.map((r) => r.id))
		if (prevMyRafflesRef.current !== currentKey) {
			prevMyRafflesRef.current = currentKey
			setDisplayMyRaffles(myRafflesData)
		}
	}, [myRafflesData])

	React.useEffect(() => {
		const currentKey = JSON.stringify(participatedRafflesData.map((r) => r.id))
		if (prevParticipatedRafflesRef.current !== currentKey) {
			prevParticipatedRafflesRef.current = currentKey
			setDisplayParticipatedRaffles(participatedRafflesData)
		}
	}, [participatedRafflesData])

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

	// 로딩 상태
	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-foreground text-2xl font-semibold">{DASHBOARD_UI_TEXT.PAGE_TITLE}</h1>
					<p className="text-muted-foreground">{DASHBOARD_UI_TEXT.PAGE_DESCRIPTION}</p>
				</div>
				<LoadingSpinner />
			</div>
		)
	}

	// 에러 상태 (401 등 인증 에러 포함)
	if (isError) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-foreground text-2xl font-semibold">{DASHBOARD_UI_TEXT.PAGE_TITLE}</h1>
					<p className="text-muted-foreground">{DASHBOARD_UI_TEXT.PAGE_DESCRIPTION}</p>
				</div>
				<div className="bg-destructive/10 border-destructive/20 text-destructive rounded-lg border px-4 py-3">
					{DASHBOARD_MESSAGES.DATA_LOAD_ERROR}
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-foreground text-2xl font-semibold">{DASHBOARD_UI_TEXT.PAGE_TITLE}</h1>
				<p className="text-muted-foreground">{DASHBOARD_UI_TEXT.PAGE_DESCRIPTION}</p>
			</div>

			<Tabs defaultValue="my-raffles" className="space-y-6">
				<TabsList className="grid w-full grid-cols-3 md:w-2/3" role="tablist">
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
					<TabsTrigger
						value="my-wins"
						className="w-full"
						role="tab"
						aria-controls="my-wins-content"
					>
						내 당첨
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

				{/* 내 당첨 목록 */}
				<TabsContent
					value="my-wins"
					className="space-y-6"
					id="my-wins-content"
					role="tabpanel"
					aria-labelledby="my-wins-tab"
				>
					<h2 className="text-xl font-semibold" aria-label={`내 당첨 개수 ${displayWins.length}`}>
						내 당첨 ({displayWins.length})
					</h2>

					{displayWins.length === 0 ? (
						<Card className="text-center" aria-label="내 당첨이 없음을 알리는 카드">
							<CardContent className="py-12">
								<EmptyState
									icon={Users}
									title="당첨 이력이 없습니다"
									description="추첨에 참여하고 행운의 주인공이 되어보세요."
									buttonText={DASHBOARD_UI_TEXT.BROWSE_RAFFLES_BUTTON}
									onButtonClick={() => router.push('/')}
									ariaLabel="내 당첨이 없음을 알리는 카드"
								/>
							</CardContent>
						</Card>
					) : (
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{displayWins.map((win) => (
								<Card key={win.raffleId}>
									<CardContent className="space-y-3 p-4 md:p-6">
										<div className="flex items-center justify-between">
											<div className="text-muted-foreground text-sm">{win.raffleName}</div>
											<div className="text-muted-foreground text-xs">
												{new Date(win.drawnAt).toLocaleString('ko-KR')}
											</div>
										</div>
										<div className="text-lg font-semibold">
											#{win.rank} {win.prizeName}
										</div>
										<div className="flex gap-2">
											<Button
												variant="outline"
												className="flex-1"
												onClick={() => router.push(`/raffles/${win.raffleId}/result`)}
												aria-label={`${win.raffleName} 결과보기`}
											>
												결과보기
											</Button>
											<Button
												variant="outline"
												className="flex-1"
												onClick={() => router.push(`/my/raffles/${win.raffleId}/result`)}
												aria-label={`${win.raffleName} 내 결과`}
											>
												내 결과
											</Button>
										</div>
									</CardContent>
								</Card>
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

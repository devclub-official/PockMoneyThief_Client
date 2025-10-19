'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { RaffleCard } from '@/components/dashboard/RaffleCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { ShippingStatusBadge } from '@/components/dashboard/ShippingStatusBadge'
import { TrackingDialog } from '@/components/dashboard/TrackingDialog'
import { useDashboard } from '@/hooks/useDashboard'
import { Plus, Package, Users, CheckCircle } from 'lucide-react'
import { DASHBOARD_MESSAGES } from '@/lib/constants/dashboard'
// import { MyRaffle, ParticipatedRaffle } from '@/types/dashboard' // 사용하지 않음

export function DashboardPage() {
	const router = useRouter()
	const {
		myRaffles,
		participatedRaffles,
		selectedWinner,
		// setSelectedWinner, // 사용하지 않음
		trackingNumber,
		setTrackingNumber,
		carrier,
		setCarrier,
		showTrackingDialog,
		setShowTrackingDialog,
		loading,
		loadDashboardData,
		handleLockRaffle,
		handleCancelRaffle,
		handleDrawRaffle,
		handleTrackingSubmit,
		handleTrackingConfirm,
		formatTimeLeft,
	} = useDashboard()

	useEffect(() => {
		loadDashboardData()
	}, [loadDashboardData])

	if (loading) {
		return (
			<div className="container mx-auto flex items-center justify-center px-4 py-8">
				<div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1
					className="text-foreground text-2xl font-semibold"
					aria-label={DASHBOARD_MESSAGES.TITLE_ARIA}
				>
					{DASHBOARD_MESSAGES.TITLE}
				</h1>
				<p className="text-muted-foreground" aria-label={DASHBOARD_MESSAGES.SUBTITLE_ARIA}>
					{DASHBOARD_MESSAGES.SUBTITLE}
				</p>
			</div>

			<Tabs defaultValue="my-raffles" className="space-y-6">
				<TabsList
					className="grid w-1/2 grid-cols-2"
					role="tablist"
					aria-label={DASHBOARD_MESSAGES.TABS_ARIA_LABEL}
				>
					<TabsTrigger
						value="my-raffles"
						className="w-full"
						role="tab"
						aria-controls="my-raffles-content"
					>
						{DASHBOARD_MESSAGES.MY_RAFFLES_TAB}
					</TabsTrigger>
					<TabsTrigger
						value="participated"
						className="w-full"
						role="tab"
						aria-controls="participated-content"
					>
						{DASHBOARD_MESSAGES.PARTICIPATED_RAFFLES_TAB}
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
							aria-label={`${DASHBOARD_MESSAGES.MY_RAFFLES_COUNT_ARIA} ${myRaffles.length}`}
						>
							{DASHBOARD_MESSAGES.MY_RAFFLES_HEADING} ({myRaffles.length})
						</h2>
						<Button
							onClick={() => router.push('/create')}
							aria-label={DASHBOARD_MESSAGES.CREATE_RAFFLE_BUTTON_ARIA}
						>
							<Plus className="mr-2 h-4 w-4" />
							{DASHBOARD_MESSAGES.CREATE_RAFFLE_BUTTON}
						</Button>
					</div>

					{myRaffles.length === 0 ? (
						<Card className="text-center" aria-label={DASHBOARD_MESSAGES.NO_MY_RAFFLES_CARD_ARIA}>
							<CardContent className="py-12">
								<Package
									className="text-muted-foreground mx-auto mb-4 h-12 w-12"
									aria-hidden="true"
								/>
								<h3 className="mb-2 text-lg font-semibold">
									{DASHBOARD_MESSAGES.NO_MY_RAFFLES_HEADING}
								</h3>
								<p className="text-muted-foreground mb-4">
									{DASHBOARD_MESSAGES.NO_MY_RAFFLES_SUBTITLE}
								</p>
								<Button
									onClick={() => router.push('/create')}
									aria-label={DASHBOARD_MESSAGES.CREATE_RAFFLE_BUTTON_ARIA}
								>
									{DASHBOARD_MESSAGES.CREATE_RAFFLE_BUTTON}
								</Button>
							</CardContent>
						</Card>
					) : (
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{myRaffles.map((raffle) => (
								<RaffleCard
									key={raffle.id}
									raffle={raffle}
									onLock={handleLockRaffle}
									onCancel={handleCancelRaffle}
									onDraw={handleDrawRaffle}
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
						aria-label={`${DASHBOARD_MESSAGES.PARTICIPATED_RAFFLES_COUNT_ARIA} ${participatedRaffles.length}`}
					>
						{DASHBOARD_MESSAGES.PARTICIPATED_RAFFLES_HEADING} ({participatedRaffles.length})
					</h2>

					{participatedRaffles.length === 0 ? (
						<Card
							className="text-center"
							aria-label={DASHBOARD_MESSAGES.NO_PARTICIPATED_RAFFLES_CARD_ARIA}
						>
							<CardContent className="py-12">
								<Users
									className="text-muted-foreground mx-auto mb-4 h-12 w-12"
									aria-hidden="true"
								/>
								<h3 className="mb-2 text-lg font-semibold">
									{DASHBOARD_MESSAGES.NO_PARTICIPATED_RAFFLES_HEADING}
								</h3>
								<p className="text-muted-foreground mb-4">
									{DASHBOARD_MESSAGES.NO_PARTICIPATED_RAFFLES_SUBTITLE}
								</p>
								<Button
									onClick={() => router.push('/')}
									aria-label={DASHBOARD_MESSAGES.BROWSE_RAFFLES_BUTTON_ARIA}
								>
									{DASHBOARD_MESSAGES.BROWSE_RAFFLES_BUTTON}
								</Button>
							</CardContent>
						</Card>
					) : (
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{participatedRaffles.map((raffle) => (
								<Card
									key={raffle.id}
									aria-label={`${DASHBOARD_MESSAGES.PARTICIPATED_RAFFLE_CARD_ARIA} ${raffle.title}`}
								>
									<CardContent className="space-y-4 p-6">
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
														<Badge
															variant="default"
															className="bg-yellow-500"
															aria-label={DASHBOARD_MESSAGES.WINNER_BADGE_ARIA}
														>
															{DASHBOARD_MESSAGES.WINNER_BADGE}
														</Badge>
													)}
												</div>
												<CardDescription
													aria-label={`${DASHBOARD_MESSAGES.PARTICIPATED_DATE_ARIA} ${new Date(raffle.participatedAt).toLocaleDateString('ko-KR')}`}
												>
													{DASHBOARD_MESSAGES.PARTICIPATED_DATE_PREFIX}:{' '}
													{new Date(raffle.participatedAt).toLocaleDateString('ko-KR')}
												</CardDescription>
											</div>
										</div>

										{raffle.isWinner && raffle.itemName && (
											<div
												className="rounded-lg border border-yellow-200 bg-yellow-50 p-3"
												aria-label={DASHBOARD_MESSAGES.WINNING_ITEM_CARD_ARIA}
											>
												<div className="mb-1 flex items-center gap-2">
													<CheckCircle className="h-4 w-4 text-yellow-600" aria-hidden="true" />
													<span className="font-medium text-yellow-800">
														{DASHBOARD_MESSAGES.WINNING_ITEM_HEADING}
													</span>
												</div>
												<p className="text-sm text-yellow-700">{raffle.itemName}</p>
												{raffle.shippingStatus && (
													<div className="mt-2">
														<ShippingStatusBadge status={raffle.shippingStatus} />
													</div>
												)}
											</div>
										)}

										<div className="flex gap-2">
											<Button
												variant="outline"
												onClick={() => router.push(`/raffle/${raffle.id}`)}
												className="flex-1"
												aria-label={`${DASHBOARD_MESSAGES.VIEW_DETAILS_BUTTON_ARIA} ${raffle.title}`}
											>
												{DASHBOARD_MESSAGES.VIEW_DETAILS_BUTTON}
											</Button>
											{raffle.status === 'COMPLETED' && (
												<Button
													variant="outline"
													onClick={() => router.push(`/raffles/${raffle.id}/result`)}
													className="flex-1"
													aria-label={`${DASHBOARD_MESSAGES.VIEW_RESULTS_BUTTON_ARIA} ${raffle.title}`}
												>
													{DASHBOARD_MESSAGES.VIEW_RESULTS_BUTTON}
												</Button>
											)}
										</div>
									</CardContent>
								</Card>
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

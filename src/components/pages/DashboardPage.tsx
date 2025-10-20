'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { RaffleCard } from '@/components/dashboard/RaffleCard'
import { ParticipatedRaffleCard } from '@/components/dashboard/ParticipatedRaffleCard'
import { TrackingDialog } from '@/components/dashboard/TrackingDialog'
import { useDashboard } from '@/hooks/useDashboard'
import { Plus, Package, Users } from 'lucide-react'

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
				<h1 className="text-foreground text-2xl font-semibold">내 대시보드</h1>
				<p className="text-muted-foreground">등록한 추첨과 참여한 추첨을 관리하세요</p>
			</div>

			<Tabs defaultValue="my-raffles" className="space-y-6">
				<TabsList className="grid w-1/2 grid-cols-2" role="tablist">
					<TabsTrigger
						value="my-raffles"
						className="w-full"
						role="tab"
						aria-controls="my-raffles-content"
					>
						내가 등록한 추첨
					</TabsTrigger>
					<TabsTrigger
						value="participated"
						className="w-full"
						role="tab"
						aria-controls="participated-content"
					>
						참여한 추첨
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
							aria-label={`등록한 추첨 개수 ${myRaffles.length}`}
						>
							등록한 추첨 ({myRaffles.length})
						</h2>
						<Button onClick={() => router.push('/create')} aria-label="새로운 추첨 등록하기">
							<Plus className="mr-2 h-4 w-4" />새 추첨 등록
						</Button>
					</div>

					{myRaffles.length === 0 ? (
						<Card className="text-center" aria-label="등록한 추첨이 없음을 알리는 카드">
							<CardContent className="py-12">
								<Package
									className="text-muted-foreground mx-auto mb-4 h-12 w-12"
									aria-hidden="true"
								/>
								<h3 className="mb-2 text-lg font-semibold">등록한 추첨이 없습니다</h3>
								<p className="text-muted-foreground mb-4">첫 번째 가차 추첨을 등록해보세요</p>
								<Button onClick={() => router.push('/create')} aria-label="새로운 추첨 등록하기">
									새 추첨 등록
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
						aria-label={`참여한 추첨 개수 ${participatedRaffles.length}`}
					>
						참여한 추첨 ({participatedRaffles.length})
					</h2>

					{participatedRaffles.length === 0 ? (
						<Card className="text-center" aria-label="참여한 추첨이 없음을 알리는 카드">
							<CardContent className="py-12">
								<Users
									className="text-muted-foreground mx-auto mb-4 h-12 w-12"
									aria-hidden="true"
								/>
								<h3 className="mb-2 text-lg font-semibold">참여한 추첨이 없습니다</h3>
								<p className="text-muted-foreground mb-4">흥미로운 추첨에 참여해보세요</p>
								<Button onClick={() => router.push('/')} aria-label="추첨 목록 둘러보기">
									추첨 둘러보기
								</Button>
							</CardContent>
						</Card>
					) : (
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{participatedRaffles.map((raffle) => (
								<ParticipatedRaffleCard
									key={raffle.id}
									raffle={raffle}
									onViewDetail={(id) => router.push(`/raffle/${id}`)}
									onViewResult={(id) => router.push(`/raffles/${id}/result`)}
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

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { Clock, Users, Gift, TrendingUp } from 'lucide-react'
import { TIME_CONSTANTS } from '@/lib/constants'
import { formatTimeLeft, formatPrice } from '@/lib/utils'
import type { RaffleFilter, RaffleListResponse } from '@/types'

interface HomePageClientProps {
	initialData: RaffleListResponse
}

export function HomePageClient({ initialData }: HomePageClientProps) {
	const router = useRouter()
	const [filter, setFilter] = useState<RaffleFilter>('all')
	const [currentTime, setCurrentTime] = useState<number | null>(null)

	// 하이드레이션 안전성을 위해 useEffect에서 시간 설정
	useEffect(() => {
		const timer = setTimeout(() => {
			setCurrentTime(Date.now())
		}, 0)
		return () => clearTimeout(timer)
	}, [])

	// 서버에서 prefetch된 데이터 사용
	const raffles = initialData.items || []
	const isLoading = false
	const isError = false

	// 통계 계산 (실제 데이터 기반)
	const stats = {
		totalLotteries: raffles.length,
		activeLotteries: raffles.length,
		totalParticipants: 0, // TODO: 참여자 수 API 추가 필요
		avgWinRate: 0, // TODO: 당첨률 API 추가 필요
	}

	// 필터링 (currentTime이 설정된 후에만 실행)
	const filteredRaffles = raffles.filter((raffle) => {
		if (filter === 'active') return true // 모든 항목이 진행중으로 간주
		if (filter === 'ending-soon' && currentTime) {
			const deadlineTime = new Date(raffle.deadlineAt).getTime()
			const timeLeft = deadlineTime - currentTime
			return timeLeft < TIME_CONSTANTS.ENDING_SOON_THRESHOLD
		}
		return true
	})

	// 로딩 상태
	if (isLoading) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<div className="text-center">
					<div className="border-primary mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-solid border-r-transparent"></div>
					<p className="text-muted-foreground">추첨 목록을 불러오는 중...</p>
				</div>
			</div>
		)
	}

	// 에러 상태
	if (isError) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<div className="text-center">
					<div className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
						<Gift className="text-destructive h-8 w-8" />
					</div>
					<h3 className="mb-2 text-lg font-semibold">오류가 발생했습니다</h3>
					<p className="text-muted-foreground mb-4">추첨 목록을 불러오는데 실패했습니다.</p>
					<Button onClick={() => window.location.reload()}>다시 시도</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-foreground text-2xl font-semibold">대시보드</h1>
				<p className="text-muted-foreground">가차 추첨 플랫폼의 현황을 한눈에 확인하세요</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<div className="bg-card border-border relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
					<div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-red-500 to-red-500/20"></div>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-muted-foreground text-sm font-medium">전체 추첨</p>
							<p className="text-foreground text-2xl font-semibold">{raffles.length}</p>
							<p className="text-muted-foreground mt-1 text-xs">Total lotteries</p>
						</div>
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
							<Gift className="h-6 w-6 text-red-600" />
						</div>
					</div>
				</div>

				<div className="bg-card border-border relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
					<div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-violet-500 to-violet-500/20"></div>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-muted-foreground text-sm font-medium">진행중 추첨</p>
							<p className="text-foreground text-2xl font-semibold">{raffles.length}</p>
							<p className="text-muted-foreground mt-1 text-xs">Active lotteries</p>
						</div>
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
							<Clock className="h-6 w-6 text-violet-600" />
						</div>
					</div>
				</div>

				<div className="bg-card border-border relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
					<div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-orange-500/20"></div>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-muted-foreground text-sm font-medium">총 참여자</p>
							<p className="text-foreground text-2xl font-semibold">{stats.totalParticipants}</p>
							<p className="text-muted-foreground mt-1 text-xs">Total participants</p>
						</div>
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
							<Users className="h-6 w-6 text-orange-600" />
						</div>
					</div>
				</div>

				<div className="bg-card border-border relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
					<div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-500/20"></div>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-muted-foreground text-sm font-medium">평균 당첨률</p>
							<p className="text-foreground text-2xl font-semibold">{stats.avgWinRate}%</p>
							<p className="text-muted-foreground mt-1 text-xs">Average win rate</p>
						</div>
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
							<TrendingUp className="h-6 w-6 text-green-600" />
						</div>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-card border-border rounded-xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-foreground text-lg font-semibold">추첨 목록</h2>
					<Tabs
						defaultValue="all"
						value={filter}
						onValueChange={(value) => setFilter(value as RaffleFilter)}
					>
						<TabsList className="bg-muted">
							<TabsTrigger value="all">전체</TabsTrigger>
							<TabsTrigger value="active">진행중</TabsTrigger>
							<TabsTrigger value="ending-soon">마감임박</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				{/* Lottery Grid */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{filteredRaffles.map((raffle, index) => {
						const deadlineTime = new Date(raffle.deadlineAt)

						return (
							<div
								key={`${raffle.id}-${index}`}
								className="bg-card border-border group cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md"
								onClick={() => router.push(`/raffle/${raffle.id}`)}
							>
								<div className="relative aspect-video overflow-hidden rounded-t-lg">
									<ImageWithFallback
										src={raffle.imageUrl}
										alt={raffle.title}
										className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
									<div className="absolute top-3 left-3">
										<Badge variant="default" className="bg-primary">
											{raffle.status}
										</Badge>
									</div>
								</div>

								<div className="space-y-4 p-4">
									<div>
										<h3 className="text-foreground line-clamp-1 font-semibold">{raffle.title}</h3>
									</div>

									<div className="flex items-center justify-between">
										<div>
											<p className="text-muted-foreground text-xs">래플 ID</p>
											<p className="text-muted-foreground text-sm">#{raffle.id}</p>
										</div>
										<div className="text-right">
											<p className="text-muted-foreground text-xs">참여비</p>
											<p className="text-primary font-semibold">₩{formatPrice(raffle.entryFee)}</p>
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">마감 시간</span>
											<span
												className={
													currentTime &&
													deadlineTime.getTime() - currentTime < TIME_CONSTANTS.URGENT_THRESHOLD
														? 'text-destructive font-medium'
														: 'text-foreground font-medium'
												}
											>
												{formatTimeLeft(deadlineTime)}
											</span>
										</div>
									</div>

									<Button
										className="w-full"
										size="sm"
										onClick={(e) => {
											e.stopPropagation()
											router.push(`/raffle/${raffle.id}`)
										}}
									>
										참여하기
									</Button>
								</div>
							</div>
						)
					})}
				</div>

				{filteredRaffles.length === 0 && (
					<div className="py-12 text-center">
						<div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
							<Gift className="text-muted-foreground h-8 w-8" />
						</div>
						<h3 className="mb-2 text-lg font-semibold">추첨이 없습니다</h3>
						<p className="text-muted-foreground mb-6">
							{filter === 'active'
								? '현재 진행중인 추첨이 없습니다.'
								: filter === 'ending-soon'
									? '마감 임박한 추첨이 없습니다.'
									: '등록된 추첨이 없습니다.'}
						</p>
						<Button>첫 추첨 등록하기</Button>
					</div>
				)}
			</div>
		</div>
	)
}

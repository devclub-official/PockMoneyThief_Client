'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { Clock, Users, Gift, TrendingUp } from 'lucide-react'
import { TIME_CONSTANTS } from '@/lib/constants'
import { formatTimeLeft, formatPrice } from '@/lib/utils'
import type { RaffleFilter, RaffleListResponse } from '@/types'

// 통계 카드 컴포넌트
function StatsCard({
	title,
	value,
	subtitle,
	icon: Icon,
	iconBg,
	gradientColor,
}: {
	title: string
	value: string | number
	subtitle: string
	icon: React.ComponentType<{ className?: string }>
	iconBg: string
	gradientColor: string
}) {
	return (
		<div className="bg-card border-border relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
			<div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${gradientColor}`}></div>
			<div className="flex items-center justify-between">
				<div>
					<p className="text-muted-foreground text-sm font-medium">{title}</p>
					<p className="text-foreground text-2xl font-semibold">{value}</p>
					<p className="text-muted-foreground mt-1 text-xs">{subtitle}</p>
				</div>
				<div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}>
					<Icon className="h-6 w-6" />
				</div>
			</div>
		</div>
	)
}

// 통계 섹션 컴포넌트
function StatsSection({
	stats,
	raffles,
}: {
	stats: { totalParticipants: number; avgWinRate: number }
	raffles: RaffleListResponse['items']
}) {
	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			<StatsCard
				title="전체 추첨"
				value={raffles.length}
				subtitle="Total lotteries"
				icon={Gift}
				iconBg="bg-red-100"
				gradientColor="from-red-500 to-red-500/20"
			/>
			<StatsCard
				title="진행중 추첨"
				value={raffles.length}
				subtitle="Active lotteries"
				icon={Clock}
				iconBg="bg-violet-100"
				gradientColor="from-violet-500 to-violet-500/20"
			/>
			<StatsCard
				title="총 참여자"
				value={stats.totalParticipants}
				subtitle="Total participants"
				icon={Users}
				iconBg="bg-orange-100"
				gradientColor="from-orange-500 to-orange-500/20"
			/>
			<StatsCard
				title="평균 당첨률"
				value={`${stats.avgWinRate}%`}
				subtitle="Average win rate"
				icon={TrendingUp}
				iconBg="bg-green-100"
				gradientColor="from-green-500 to-green-500/20"
			/>
		</div>
	)
}

// 래플 카드 컴포넌트
function RaffleCard({
	raffle,
	index,
	currentTime,
	router,
}: {
	raffle: RaffleListResponse['items'][0]
	index: number
	currentTime: number | null
	router: ReturnType<typeof useRouter>
}) {
	// useMemo로 deadlineTime 메모이제이션
	const deadlineTime = useMemo(() => new Date(raffle.deadlineAt), [raffle.deadlineAt])

	// isUrgent을 useMemo로 직접 계산 (setState 불필요)
	const isUrgent = useMemo(() => {
		if (!currentTime) return false
		return deadlineTime.getTime() - currentTime < TIME_CONSTANTS.URGENT_THRESHOLD
	}, [currentTime, deadlineTime])

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
						{raffle.status === 'PUBLISHED'
							? '진행중'
							: raffle.status === 'LOCKED'
								? '마감'
								: raffle.status === 'CANCELLED'
									? '취소'
									: raffle.status}
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
						<span className="text-muted-foreground">
							{raffle.status === 'PUBLISHED' ? '마감 시간' : '상태'}
						</span>
						<span
							className={
								raffle.status !== 'PUBLISHED'
									? 'text-muted-foreground font-medium'
									: isUrgent
										? 'text-destructive font-medium'
										: 'text-foreground font-medium'
							}
						>
							{raffle.status === 'PUBLISHED'
								? formatTimeLeft(deadlineTime)
								: raffle.status === 'LOCKED'
									? '참가 마감'
									: raffle.status === 'CANCELLED'
										? '취소됨'
										: raffle.status}
						</span>
					</div>
				</div>

				<Button
					className="w-full"
					size="sm"
					disabled={raffle.status !== 'PUBLISHED' || new Date(raffle.deadlineAt) <= new Date()}
					onClick={(e) => {
						e.stopPropagation()
						router.push(`/raffle/${raffle.id}`)
					}}
				>
					{raffle.status === 'PUBLISHED' && new Date(raffle.deadlineAt) > new Date()
						? '참여하기'
						: '상세보기'}
				</Button>
			</div>
		</div>
	)
}

// 빈 상태 메시지 생성 함수
function getEmptyStateMessage(filter: RaffleFilter) {
	switch (filter) {
		case 'active':
			return '현재 진행중인 추첨이 없습니다.'
		case 'ending-soon':
			return '마감 임박한 추첨이 없습니다.'
		default:
			return '등록된 추첨이 없습니다.'
	}
}

interface HomePageClientProps {
	initialData: RaffleListResponse
}

export function HomePageClient({ initialData }: HomePageClientProps) {
	const router = useRouter()
	const [filter, setFilter] = useState<RaffleFilter>('all')
	const [currentTime, setCurrentTime] = useState<number | null>(null)

	// 클라이언트에서만 시간 설정 (hydration 이슈 방지)
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setCurrentTime(Date.now())
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
		return <LoadingState message="추첨 목록을 불러오는 중..." />
	}

	// 에러 상태
	if (isError) {
		return (
			<ErrorState title="오류가 발생했습니다" description="추첨 목록을 불러오는데 실패했습니다." />
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
			<StatsSection stats={stats} raffles={raffles} />

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
					{filteredRaffles.map((raffle, index) => (
						<RaffleCard
							key={`${raffle.id}-${index}`}
							raffle={raffle}
							index={index}
							currentTime={currentTime}
							router={router}
						/>
					))}
				</div>

				{filteredRaffles.length === 0 && (
					<EmptyState
						icon={Gift}
						title="추첨이 없습니다"
						description={getEmptyStateMessage(filter)}
						buttonText="첫 추첨 등록하기"
						ariaLabel="추첨이 없음을 알리는 상태"
					/>
				)}
			</div>
		</div>
	)
}

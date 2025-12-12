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
import { Clock, Gift } from 'lucide-react'
import { TIME_CONSTANTS } from '@/lib/constants'
import { formatTimeLeft, formatPrice } from '@/lib/utils'
import type { RaffleFilter, RaffleSummaryResponse } from '@/types'
import { useRaffles } from '@/hooks/useRaffles'
// import { EventCard } from '@/components/dashboard/EventCard'
import { useAtom } from 'jotai'
import { searchQueryAtom } from '@/lib/atoms/searchAtom'

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
		<div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md">
			<div className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${gradientColor}`}></div>
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-muted-foreground">{title}</p>
					<p className="text-2xl font-semibold text-foreground">{value}</p>
					<p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
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
}: {
	stats: {
		totalLotteries: number
		activeLotteries: number
	}
}) {
	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
			<StatsCard
				title="전체 추첨"
				value={stats.totalLotteries}
				subtitle="Total lotteries"
				icon={Gift}
				iconBg="bg-red-100"
				gradientColor="from-red-500 to-red-500/20"
			/>
			<StatsCard
				title="진행중 추첨"
				value={stats.activeLotteries}
				subtitle="Active lotteries"
				icon={Clock}
				iconBg="bg-violet-100"
				gradientColor="from-violet-500 to-violet-500/20"
			/>
		</div>
	)
}

// 래플 카드 컴포넌트
function RaffleCard({
	raffle,
	currentTime,
	router,
}: {
	raffle: RaffleSummaryResponse
	currentTime: number | null
	router: ReturnType<typeof useRouter>
}) {
	// useMemo로 deadlineTime 메모이제이션
	const deadlineTime = useMemo(() => new Date(raffle.deadlineAt || ''), [raffle.deadlineAt])

	// isUrgent을 useMemo로 직접 계산 (setState 불필요)
	const isUrgent = useMemo(() => {
		if (!currentTime) return false
		return deadlineTime.getTime() - currentTime < TIME_CONSTANTS.URGENT_THRESHOLD
	}, [currentTime, deadlineTime])

	return (
		<div
			className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md"
			onClick={() => router.push(`/raffle/${raffle.raffleId}`)}
		>
			<div className="relative aspect-video overflow-hidden rounded-t-lg">
				<ImageWithFallback
					src={raffle.imageUrl}
					alt={raffle.title}
					className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
				<div className="absolute left-3 top-3">
					<Badge variant="default" className="bg-primary">
						{raffle.status === 'PUBLISHED'
							? '진행중'
							: raffle.status === 'LOCKED'
								? '마감'
								: raffle.status === 'DRAWN'
									? '추첨완료'
									: raffle.status === 'CANCELLED'
										? '취소'
										: raffle.status}
					</Badge>
				</div>
			</div>
			<div className="space-y-4 p-4">
				<div>
					<h3 className="line-clamp-1 font-semibold text-foreground">{raffle.title}</h3>
				</div>

				<div className="flex items-center justify-between">
					<div>
						<p className="text-xs text-muted-foreground">래플 ID</p>
						<p className="text-sm text-muted-foreground">#{raffle.raffleId}</p>
					</div>
					<div className="text-right">
						<p className="text-xs text-muted-foreground">참여비</p>
						<p className="font-semibold text-primary">₩{formatPrice(raffle.entryFee || 0)}</p>
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
									? 'font-medium text-muted-foreground'
									: isUrgent
										? 'font-medium text-destructive'
										: 'font-medium text-foreground'
							}
						>
							{raffle.status === 'PUBLISHED'
								? formatTimeLeft(deadlineTime)
								: raffle.status === 'LOCKED'
									? '참가 마감'
									: raffle.status === 'DRAWN'
										? '추첨 완료'
										: raffle.status === 'CANCELLED'
											? '취소됨'
											: raffle.status}
						</span>
					</div>
				</div>

				<Button
					className="w-full cursor-pointer"
					size="sm"
					disabled={
						raffle.status !== 'PUBLISHED' || new Date(raffle.deadlineAt || '') <= new Date()
					}
					onClick={(e) => {
						e.stopPropagation()
						router.push(`/raffle/${raffle.raffleId}`)
					}}
				>
					{raffle.status === 'PUBLISHED' && new Date(raffle.deadlineAt || '') > new Date()
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
		case 'closed':
			return '마감된 추첨이 없습니다.'
		default:
			return '등록된 추첨이 없습니다.'
	}
}

export function HomePageClient() {
	const router = useRouter()
	const [searchQuery] = useAtom(searchQueryAtom)
	const [filter, setFilter] = useState<RaffleFilter>('all')
	const [currentTime, setCurrentTime] = useState<number | null>(null)
	// 클라이언트에서만 시간 설정 (hydration 이슈 방지)
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setCurrentTime(Date.now())
	}, [])

	const { data: initialData } = useRaffles()

	// 서버에서 prefetch된 데이터 사용 (중복 raffleId 제거)
	const raffles = useMemo(() => {
		const items = initialData || []
		// Map을 사용하여 중복된 raffleId 제거 (마지막 항목이 유지됨)
		const uniqueMap = new Map(items.map((item) => [item.raffleId, item]))
		return Array.from(uniqueMap.values())
	}, [initialData])
	const isLoading = false
	const isError = false

	// 통계 계산 (실제 데이터 기반)
	const stats = useMemo(() => {
		const activeLotteries = currentTime
			? raffles.filter(
					(raffle) =>
						raffle.status === 'PUBLISHED' && new Date(raffle.deadlineAt).getTime() > currentTime,
				).length
			: 0

		return {
			totalLotteries: raffles.length,
			activeLotteries,
		}
	}, [raffles, currentTime])

	// 필터링 및 검색 (currentTime이 설정된 후에만 실행)
	const filteredRaffles = useMemo(() => {
		return raffles.filter((raffle) => {
			// 검색어 필터링 (제목으로 검색)
			if (searchQuery.trim()) {
				const query = searchQuery.trim().toLowerCase()
				if (!raffle.title.toLowerCase().includes(query)) {
					return false
				}
			}

			// Event 타입 래플은 목록에서 제외 (EventCard로 별도 표시)
			// if (raffle.raffleType === 'GIFTCON') return false

			// 상태 필터링
			// 전체 - 모든 항목 표시
			if (filter === 'all') return true

			// 진행중 - PUBLISHED 상태이면서 마감시간이 지나지 않은 항목
			if (filter === 'active' && currentTime) {
				return raffle.status === 'PUBLISHED' && new Date(raffle.deadlineAt).getTime() > currentTime
			}

			// 마감 - LOCKED, DRAWN, CANCELLED 또는 마감시간이 지난 PUBLISHED 항목
			if (filter === 'closed' && currentTime) {
				return (
					raffle.status === 'LOCKED' ||
					raffle.status === 'DRAWN' ||
					raffle.status === 'CANCELLED' ||
					(raffle.status === 'PUBLISHED' && new Date(raffle.deadlineAt).getTime() <= currentTime)
				)
			}

			return true
		})
	}, [raffles, searchQuery, filter, currentTime])

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
				<h1 className="text-2xl font-semibold text-foreground">대시보드</h1>
				<p className="text-muted-foreground">가차 추첨 플랫폼의 현황을 한눈에 확인하세요</p>
			</div>

			{/* Event Card */}
			{/* <div className="mb-6">
				<EventCard eventId="candy-event-2025" />
			</div> */}

			{/* Stats Cards */}
			<StatsSection stats={stats} />

			{/* Filters */}
			<div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-foreground">추첨 목록</h2>
					<Tabs
						defaultValue="all"
						value={filter}
						onValueChange={(value) => {
							const allowed: RaffleFilter[] = ['all', 'active', 'closed']
							if (allowed.includes(value as RaffleFilter)) {
								setFilter(value as RaffleFilter)
							}
						}}
					>
						<TabsList className="bg-muted">
							<TabsTrigger value="all" className="cursor-pointer">
								전체
							</TabsTrigger>
							<TabsTrigger value="active" className="cursor-pointer">
								진행중
							</TabsTrigger>
							<TabsTrigger value="closed" className="cursor-pointer">
								마감
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				{/* Lottery Grid */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{filteredRaffles.map((raffle) => (
						<RaffleCard
							key={raffle.raffleId}
							raffle={raffle}
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

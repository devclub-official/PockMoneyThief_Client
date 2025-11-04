'use client'

import { use, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { Clock, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { formatTimeLeft, formatPrice } from '@/lib/utils'
import { useRaffleDetail } from '@/hooks/useRaffleDetail'
import { useParticipants } from '@/hooks/useParticipants'

interface Participant {
	id: string
	displayName: string
	joinedAt: Date
}

interface RaffleDetail {
	id: string
	title: string
	description: string
	imageUrl: string
	entryFee: number
	minParticipants: number
	maxParticipants: number
	currentParticipants: number
	endTime: Date
	status: string
	createdAt: Date
	prizes: Array<{
		rank: number
		name: string
		quantity: number
		imageUrl?: string
	}>
	participants: Participant[]
	externalSeed: string
}

interface RaffleDetailPageProps {
	params: Promise<{ id: string }>
}

const FALLBACK_IMAGE =
	'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'

export default function RaffleDetailPage({ params }: RaffleDetailPageProps) {
	const { id } = use(params)
	const router = useRouter()
	const [participantName, setParticipantName] = useState('')
	const [isParticipating, setIsParticipating] = useState(false)
	const [showParticipateDialog, setShowParticipateDialog] = useState(false)
	const [currentTime] = useState<number>(() => {
		if (typeof window !== 'undefined') {
			return Date.now()
		}
		return 0
	})

	// 실제 API 호출
	const { data: raffleData, isLoading, isError } = useRaffleDetail(id)
	const { data: participantsData } = useParticipants(id)

	// API 응답 데이터를 화면에 맞게 변환
	const raffle = useMemo((): RaffleDetail | null => {
		if (!raffleData) return null

		// Mock 데이터 validation (백엔드가 실제 데이터 내려주면 제거)
		const validParticipantsCount = Math.max(0, raffleData.participantsCount || 0)
		const validEntryFee = Math.max(0, raffleData.entryFee || 0)
		const validMinParticipants = Math.max(0, raffleData.minParticipants || 0)
		const validMaxParticipants = Math.max(1, raffleData.maxParticipants || 1)

		// 실제 참여자 목록 사용
		const participants: Participant[] = participantsData?.participants
			? participantsData.participants.map((p) => ({
					id: p.participantId,
					displayName: p.displayName,
					joinedAt: new Date(p.joinedAt),
				}))
			: []

		return {
			id: raffleData.id,
			title: raffleData.title,
			description: raffleData.description,
			imageUrl: raffleData.imageUrl,
			entryFee: validEntryFee,
			minParticipants: validMinParticipants,
			maxParticipants: validMaxParticipants,
			currentParticipants: validParticipantsCount,
			endTime: new Date(raffleData.deadlineAt),
			status: raffleData.status,
			createdAt: new Date(raffleData.createdAt),
			prizes: raffleData.tiers.map((tier) => ({
				rank: tier.rank,
				name: tier.name,
				quantity: tier.quantity,
				imageUrl: tier.imageUrl,
			})),
			participants,
			externalSeed: raffleData.externalSeed || raffleData.externalSeedDescription,
		}
	}, [raffleData, participantsData])

	const handleParticipate = async () => {
		if (!participantName.trim()) {
			alert('참여자 이름을 입력해주세요.')
			return
		}

		if (participantName.includes(' ')) {
			alert('이름에 공백을 포함할 수 없습니다.')
			return
		}

		// 개인정보 포함 여부 체크
		const personalInfoPatterns = ['@', '핸드폰', '전화', '주소', '생년월일']
		const hasPersonalInfo = personalInfoPatterns.some((pattern) =>
			participantName.toLowerCase().includes(pattern),
		)

		if (hasPersonalInfo) {
			alert('개인정보가 포함될 수 있는 이름은 사용할 수 없습니다.')
			return
		}

		setIsParticipating(true)

		// TODO: 실제 POST /raffles/{raffleId}/participants API 호출
		setTimeout(() => {
			alert('추첨 참여가 완료되었습니다!')
			setShowParticipateDialog(false)
			setIsParticipating(false)
			router.push('/')
		}, 2000)
	}

	// 로딩 상태
	if (isLoading) {
		return <LoadingState message="추첨 정보를 불러오는 중..." />
	}

	// 에러 상태
	if (isError) {
		return (
			<ErrorState
				title="래플을 불러올 수 없습니다"
				description="래플 정보를 가져오는 중 문제가 발생했습니다."
			/>
		)
	}

	// 데이터가 없는 경우
	if (!raffle) {
		return (
			<ErrorState
				title="래플을 찾을 수 없습니다"
				description="요청하신 래플이 존재하지 않습니다."
			/>
		)
	}

	const isUserParticipated = false // TODO: 사용자 참여 여부 확인 (추후 API 추가 예정)
	const canParticipate =
		raffle.status === 'PUBLISHED' &&
		raffle.endTime > new Date() &&
		raffle.currentParticipants < raffle.maxParticipants &&
		!isUserParticipated

	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
				{/* 이미지 및 기본 정보 */}
				<div className="space-y-6">
					<div className="relative aspect-square overflow-hidden rounded-lg">
						<ImageWithFallback
							src={raffle.imageUrl}
							alt={raffle.title}
							className="h-full w-full object-cover"
						/>
						<div className="absolute top-4 left-4">
							<Badge variant="default">{raffle.status}</Badge>
						</div>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>상품 정보</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{raffle.prizes.map((prize, index) => (
								<div key={index} className="flex items-start gap-3">
									<div className="bg-muted relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={prize.imageUrl || FALLBACK_IMAGE}
											alt={prize.name}
											className="h-full w-full object-cover"
											onError={(e) => {
												e.currentTarget.src = FALLBACK_IMAGE
											}}
										/>
									</div>
									<div className="min-w-0 flex-1">
										<div className="flex items-start gap-2">
											{raffle.prizes.length > 1 && (
												<Badge variant="secondary" className="mt-0.5 flex-shrink-0 text-xs">
													{prize.rank}등
												</Badge>
											)}
											<div className="min-w-0 flex-1">
												<p className="text-sm leading-snug font-medium">{prize.name}</p>
												<p className="text-muted-foreground mt-1 text-xs">
													수량: {prize.quantity}개
												</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				{/* 추첨 정보 */}
				<div className="space-y-6">
					<div>
						<h1 className="mb-3 text-2xl font-bold lg:text-3xl">{raffle.title}</h1>
						<p className="text-muted-foreground mb-4 text-base leading-relaxed">
							{raffle.description}
						</p>
						<div className="bg-muted text-muted-foreground inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs">
							<Clock className="h-3 w-3" />
							<span>등록일</span>
							<span className="font-medium">{raffle.createdAt.toLocaleDateString('ko-KR')}</span>
						</div>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>가격 정보</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between py-2">
								<span className="text-muted-foreground text-sm">참여비</span>
								<span className="text-primary text-xl font-bold">
									₩{formatPrice(raffle.entryFee)}
								</span>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="h-5 w-5" />
								참여 현황
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<span>참여자 수</span>
								<span className="font-semibold">
									{raffle.currentParticipants}/{raffle.maxParticipants}명
								</span>
							</div>

							<Progress
								value={(raffle.currentParticipants / raffle.maxParticipants) * 100}
								className="h-2"
							/>

							<div className="flex items-center justify-between">
								<span className="flex items-center gap-1">
									<Clock className="h-4 w-4" />
									남은 시간
								</span>
								<span
									className={
										raffle.status === 'LOCKED' || raffle.status === 'CANCELLED'
											? 'text-muted-foreground'
											: raffle.endTime.getTime() - currentTime < 60 * 60 * 1000
												? 'text-destructive'
												: 'text-foreground'
									}
								>
									{formatTimeLeft(raffle.endTime)}
								</span>
							</div>

							<div className="bg-muted rounded-lg p-3">
								<div className="flex items-center gap-2 text-sm">
									<AlertCircle className="text-muted-foreground h-4 w-4" />
									<span className="text-muted-foreground">외부 시드: {raffle.externalSeed}</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 참여 버튼 */}
					<div className="space-y-4">
						{isUserParticipated ? (
							<div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4">
								<CheckCircle className="h-5 w-5 text-green-600" />
								<span className="font-medium text-green-700">이미 참여하셨습니다</span>
							</div>
						) : canParticipate ? (
							<Dialog open={showParticipateDialog} onOpenChange={setShowParticipateDialog}>
								<DialogTrigger asChild>
									<Button size="lg" className="w-full">
										₩{formatPrice(raffle.entryFee)}로 참여하기
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>추첨 참여</DialogTitle>
										<DialogDescription>
											참여자 이름을 입력해주세요. 추첨 결과 공개 시 표시됩니다.
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-4 py-4">
										<div>
											<Label htmlFor="participantName">참여자 이름</Label>
											<Input
												id="participantName"
												value={participantName}
												onChange={(e) => setParticipantName(e.target.value)}
												placeholder="추첨에 사용될 이름"
												maxLength={20}
											/>
											<p className="text-muted-foreground mt-1 text-xs">
												* 개인정보가 포함되지 않도록 주의해주세요
											</p>
										</div>

										<div className="bg-muted rounded-lg p-3">
											<h4 className="mb-2 font-medium">참여 안내</h4>
											<ul className="text-muted-foreground space-y-1 text-xs">
												<li>• 참여비: ₩{formatPrice(raffle.entryFee)}</li>
												<li>• 참여 후 취소 불가</li>
												<li>• 외부 시드를 통한 공정한 추첨</li>
												<li>• 당첨 시 3일 내 배송정보 입력 필수</li>
											</ul>
										</div>

										<div className="flex gap-2">
											<Button
												variant="outline"
												onClick={() => setShowParticipateDialog(false)}
												className="flex-1"
											>
												취소
											</Button>
											<Button
												onClick={handleParticipate}
												disabled={isParticipating}
												className="flex-1"
											>
												{isParticipating ? '처리중...' : '참여하기'}
											</Button>
										</div>
									</div>
								</DialogContent>
							</Dialog>
						) : (
							<Button size="lg" className="w-full" disabled>
								{raffle.status === 'LOCKED'
									? '참가 마감'
									: raffle.status === 'CANCELLED'
										? '취소된 추첨'
										: raffle.currentParticipants >= raffle.maxParticipants
											? '참여 마감'
											: '참여 불가'}
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* 참여자 목록 */}
			<div className="mt-12">
				<Card>
					<CardHeader>
						<CardTitle>참여자 목록</CardTitle>
						<CardDescription>
							현재까지 {raffle.currentParticipants}명이 참여했습니다
						</CardDescription>
					</CardHeader>
					<CardContent>
						{raffle.participants.length > 0 ? (
							<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
								{raffle.participants.map((participant, index) => (
									<div
										key={`${participant.id}-${index}`}
										className="bg-muted flex items-center gap-2 rounded p-2"
									>
										<div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs">
											{index + 1}
										</div>
										<span className="text-sm font-medium">{participant.displayName}</span>
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-center text-sm">아직 참여자가 없습니다</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

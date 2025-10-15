'use client'

import { use, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { Clock, Users, CheckCircle } from 'lucide-react'
import { formatTimeLeft, formatPrice } from '@/lib/utils'
import { useRaffleDetail } from '@/hooks/useRaffleDetail'

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
	const [currentTime] = useState(() => Date.now())

	// API 연동: 래플 상세 조회
	const { data: raffleData, isLoading, isError } = useRaffleDetail(id)

	// API 응답 데이터를 화면에 맞게 변환
	const raffle = useMemo((): RaffleDetail | null => {
		if (!raffleData) return null

		return {
			id: raffleData.id,
			title: raffleData.title,
			description: raffleData.description,
			imageUrl: raffleData.imageUrl,
			entryFee: raffleData.entryFee,
			minParticipants: raffleData.minParticipants,
			maxParticipants: raffleData.maxParticipants,
			currentParticipants: raffleData.participantsCount,
			endTime: new Date(raffleData.deadlineAt),
			status: raffleData.status,
			createdAt: new Date(raffleData.createdAt),
			prizes: raffleData.tiers.map((tier) => ({
				rank: tier.rank,
				name: tier.name,
				quantity: tier.quantity,
				imageUrl: tier.imageUrl,
			})),
		}
	}, [raffleData])

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

		// 실제로는 결제 API 호출 후 참여 처리
		setTimeout(() => {
			alert('추첨 참여가 완료되었습니다!')
			setShowParticipateDialog(false)
			setIsParticipating(false)
			router.push('/')
		}, 2000)
	}

	// 로딩 중
	if (isLoading) {
		return (
			<div className="container mx-auto flex items-center justify-center px-4 py-8">
				<div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
			</div>
		)
	}

	// 에러 또는 데이터 없음
	if (isError || !raffle) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<p className="text-muted-foreground">래플을 찾을 수 없습니다.</p>
					<Button onClick={() => router.push('/')} className="mt-4">
						목록으로 돌아가기
					</Button>
				</div>
			</div>
		)
	}

	const isUserParticipated = false // TODO: 사용자 참여 여부 확인
	const canParticipate =
		raffle.status.includes('진행') &&
		raffle.currentParticipants < raffle.maxParticipants &&
		!isUserParticipated

	return (
		<div className="container mx-auto max-w-4xl px-4 py-8">
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
						<CardContent className="space-y-3">
							{raffle.prizes.map((prize, index) => (
								<div key={index} className="flex items-center gap-3">
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
										<div className="flex items-center gap-2">
											<Badge variant="secondary" className="text-xs">
												{prize.rank}등
											</Badge>
											<span className="truncate text-sm font-medium">{prize.name}</span>
										</div>
										<p className="text-muted-foreground text-xs">수량: {prize.quantity}개</p>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				{/* 추첨 정보 */}
				<div className="space-y-6">
					<div>
						<h1 className="mb-2 text-3xl font-bold">{raffle.title}</h1>
						<p className="text-muted-foreground mb-2">{raffle.description}</p>
						<p className="text-muted-foreground text-xs">
							등록일: {raffle.createdAt.toLocaleDateString('ko-KR')}
						</p>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>가격 정보</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">참여비</span>
								<span className="text-primary text-lg font-semibold">
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
										raffle.status.includes('종료') || raffle.status.includes('완료')
											? 'text-muted-foreground'
											: raffle.endTime.getTime() - currentTime < 60 * 60 * 1000
												? 'text-destructive'
												: 'text-foreground'
									}
								>
									{formatTimeLeft(raffle.endTime)}
								</span>
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
								{raffle.status.includes('종료') || raffle.status.includes('완료')
									? '종료된 추첨'
									: raffle.currentParticipants >= raffle.maxParticipants
										? '참여 마감'
										: '참여 불가'}
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

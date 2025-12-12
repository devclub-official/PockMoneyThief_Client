'use client'

import { useState, useMemo, useEffect } from 'react'
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
import { RAFFLE_DETAIL_UI_TEXT } from '@/lib/constants'
import { useRaffleDetail } from '@/hooks/useRaffleDetail'
import { participantApi } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/Toast'

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

interface RaffleDetailClientProps {
	id: string
}

const FALLBACK_IMAGE =
	'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'

export function RaffleDetailClient({ id }: RaffleDetailClientProps) {
	const queryClient = useQueryClient()
	const { addToast } = useToast()
	const [participantName, setParticipantName] = useState('')
	const [isParticipating, setIsParticipating] = useState(false)
	const [showParticipateDialog, setShowParticipateDialog] = useState(false)
	const [currentTime, setCurrentTime] = useState(Date.now())
	const [hasParticipated, setHasParticipated] = useState(false)

	// 실제 API 호출 - participantDisplayNames는 상세 API에 포함되므로 중복 호출 불필요
	const { data: raffleData, isLoading, isError } = useRaffleDetail(id)

	// 1초마다 현재 시간 업데이트 (실시간 남은 시간 표시를 위해)
	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(Date.now()), 1000)
		return () => clearInterval(timer)
	}, [])

	// API 응답 데이터를 화면에 맞게 변환
	const raffle = useMemo((): RaffleDetail | null => {
		if (!raffleData) return null

		// 참여자 수는 participantDisplayNames 배열 길이로 계산
		const currentParticipants = raffleData.participantDisplayNames?.length || 0

		// 참여자 목록은 participantDisplayNames에서 직접 생성
		const participants: Participant[] = (raffleData.participantDisplayNames || []).map(
			(displayName, index) => ({
				id: `participant-${index}`, // 실제 ID는 없으므로 임시 생성
				displayName,
				joinedAt: new Date(), // 상세 정보 없으므로 현재 시간 사용
			}),
		)

		return {
			id: raffleData.raffleId,
			title: raffleData.title,
			description: raffleData.description,
			imageUrl: raffleData.imageUrl,
			entryFee: raffleData.entryFee,
			minParticipants: raffleData.minParticipants,
			maxParticipants: raffleData.maxParticipants,
			currentParticipants,
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
	}, [raffleData])

	const handleParticipate = async () => {
		if (!participantName.trim()) {
			addToast({
				title: RAFFLE_DETAIL_UI_TEXT.VALIDATION_EMPTY_TITLE,
				description: RAFFLE_DETAIL_UI_TEXT.VALIDATION_EMPTY_DESC,
				variant: 'error',
				duration: 3000,
			})
			return
		}

		if (participantName.includes(' ')) {
			addToast({
				title: RAFFLE_DETAIL_UI_TEXT.VALIDATION_EMPTY_TITLE,
				description: RAFFLE_DETAIL_UI_TEXT.VALIDATION_SPACE_DESC,
				variant: 'error',
				duration: 3000,
			})
			return
		}

		// 개인정보 패턴 체크 - 정규식 사용
		const phonePattern = /01[0-9]-?\d{3,4}-?\d{4}/ // 전화번호 패턴 (010-1234-5678, 01012345678)
		const emailPattern = /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ // 이메일 패턴
		const birthPattern = /\d{6}[-.]?\d{7}/ // 주민등록번호 패턴
		const numberPattern = /\d{8,}/ // 8자리 이상 연속 숫자 (생년월일, 계좌번호 등)

		const hasPhoneNumber = phonePattern.test(participantName)
		const hasEmail = emailPattern.test(participantName)
		const hasBirthNumber = birthPattern.test(participantName)
		const hasLongNumber = numberPattern.test(participantName)

		// 민감한 키워드 체크
		const sensitiveKeywords = ['주소', '생년월일', '주민번호', '번호']
		const hasSensitiveKeyword = sensitiveKeywords.some((keyword) =>
			participantName.includes(keyword),
		)

		if (hasPhoneNumber) {
			addToast({
				title: RAFFLE_DETAIL_UI_TEXT.VALIDATION_EMPTY_TITLE,
				description: RAFFLE_DETAIL_UI_TEXT.VALIDATION_PHONE_DESC,
				variant: 'error',
				duration: 3000,
			})
			return
		}

		if (hasEmail) {
			addToast({
				title: RAFFLE_DETAIL_UI_TEXT.VALIDATION_EMPTY_TITLE,
				description: RAFFLE_DETAIL_UI_TEXT.VALIDATION_EMAIL_DESC,
				variant: 'error',
				duration: 3000,
			})
			return
		}

		if (hasBirthNumber) {
			addToast({
				title: RAFFLE_DETAIL_UI_TEXT.VALIDATION_EMPTY_TITLE,
				description: RAFFLE_DETAIL_UI_TEXT.VALIDATION_BIRTH_DESC,
				variant: 'error',
				duration: 3000,
			})
			return
		}

		if (hasLongNumber) {
			addToast({
				title: RAFFLE_DETAIL_UI_TEXT.VALIDATION_EMPTY_TITLE,
				description: RAFFLE_DETAIL_UI_TEXT.VALIDATION_NUMBER_DESC,
				variant: 'error',
				duration: 3000,
			})
			return
		}

		if (hasSensitiveKeyword) {
			addToast({
				title: RAFFLE_DETAIL_UI_TEXT.VALIDATION_EMPTY_TITLE,
				description: RAFFLE_DETAIL_UI_TEXT.VALIDATION_KEYWORD_DESC,
				variant: 'error',
				duration: 3000,
			})
			return
		}

		setIsParticipating(true)

		try {
			// 실제 POST /raffles/{raffleId}/participants API 호출
			await participantApi.participate(id, {
				displayName: participantName,
			})

			// 성공 시 래플 상세 새로고침 (participantDisplayNames 포함)
			queryClient.invalidateQueries({ queryKey: ['raffle', id] })

			addToast({
				title: RAFFLE_DETAIL_UI_TEXT.SUCCESS_TITLE,
				description: RAFFLE_DETAIL_UI_TEXT.SUCCESS_DESC,
				variant: 'success',
				duration: 3000,
			})

			setHasParticipated(true)
			setShowParticipateDialog(false)
			setParticipantName('')
		} catch (error) {
			console.error('참여 실패:', error)
			addToast({
				title: RAFFLE_DETAIL_UI_TEXT.ERROR_PARTICIPATE_TITLE,
				description: RAFFLE_DETAIL_UI_TEXT.ERROR_PARTICIPATE_DESC,
				variant: 'error',
				duration: 4000,
			})
		} finally {
			setIsParticipating(false)
		}
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

	// 세션 내 참여 여부 체크 (새로고침 시 초기화됨, 실제로는 서버 API에서 확인 필요)
	const isUserParticipated = hasParticipated
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
						<div className="absolute left-4 top-4">
							<Badge variant="default">{raffle.status}</Badge>
						</div>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>상품 정보</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{raffle.prizes.map((prize) => (
								<div key={prize.rank} className="flex items-start gap-3">
									<div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
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
												<p className="text-sm font-medium leading-snug">{prize.name}</p>
												<p className="mt-1 text-xs text-muted-foreground">
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
						<p className="mb-4 text-base leading-relaxed text-muted-foreground">
							{raffle.description}
						</p>
						<div className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
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
								<span className="text-sm text-muted-foreground">참여비</span>
								<span className="text-xl font-bold text-primary">
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
									{raffle.status === 'PUBLISHED' ? '남은 시간' : '상태'}
								</span>
								<span
									className={
										raffle.status === 'LOCKED' ||
										raffle.status === 'DRAWN' ||
										raffle.status === 'CANCELLED'
											? 'text-muted-foreground'
											: raffle.endTime.getTime() - currentTime < 60 * 60 * 1000
												? 'text-destructive'
												: 'text-foreground'
									}
								>
									{raffle.status === 'PUBLISHED'
										? formatTimeLeft(raffle.endTime)
										: raffle.status === 'LOCKED'
											? '참가 마감'
											: raffle.status === 'DRAWN'
												? '추첨 완료'
												: raffle.status === 'CANCELLED'
													? '취소됨'
													: raffle.status}
								</span>
							</div>

							<div className="rounded-lg bg-muted p-3">
								<div className="flex items-center gap-2 text-sm">
									<AlertCircle className="h-4 w-4 text-muted-foreground" />
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
											<p className="mt-1 text-xs text-muted-foreground">
												* 개인정보가 포함되지 않도록 주의해주세요
											</p>
										</div>

										<div className="rounded-lg bg-muted p-3">
											<h4 className="mb-2 font-medium">참여 안내</h4>
											<ul className="space-y-1 text-xs text-muted-foreground">
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
									: raffle.status === 'DRAWN'
										? '추첨 완료'
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
									<div key={index} className="flex items-center gap-2 rounded bg-muted p-2">
										<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
											{index + 1}
										</div>
										<span className="text-sm font-medium">{participant.displayName}</span>
									</div>
								))}
							</div>
						) : (
							<p className="text-center text-sm text-muted-foreground">아직 참여자가 없습니다</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

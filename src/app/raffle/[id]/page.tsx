'use client'

import { use, useState, useMemo, useEffect } from 'react'
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
import { Clock, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { formatTimeLeft, formatPrice } from '@/lib/utils'

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
	/**
	 * TODO: API Spec 작성된 이후 '참여자 목록' 외부에서 주입하도록 수정
	 */
	participants: Participant[]
	/**
	 * TODO: API Spec 작성된 이후 '외부 시드' 외부에서 주입하도록 수정
	 */
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
	const [currentTime, setCurrentTime] = useState<number>(0)

	// 하이드레이션 안전성을 위해 useEffect에서 시간 설정
	useEffect(() => {
		const timer = setTimeout(() => {
			setCurrentTime(Date.now())
		}, 0)
		return () => clearTimeout(timer)
	}, [])

	/**
	 * TODO: 실제 API 연동 시 주석 해제
	 * const { data: raffleData, isLoading, isError } = useRaffleDetail(id)
	 */

	// Mock 데이터로 대체 (Apidog API 비용 절감)
	const isLoading = false
	const isError = false

	// API 응답 데이터를 화면에 맞게 변환
	const raffle = useMemo((): RaffleDetail | null => {
		/**
		 * TODO: 실제 API 연동 시 raffleData 사용하도록 수정
		 * if (!raffleData) return null
		 */

		// Mock 데이터 - ID별로 다른 상품 표시
		const mockRaffles: Record<
			string,
			{
				id: string
				title: string
				description: string
				entryFee: number
				minParticipants: number
				maxParticipants: number
				imageUrl: string
				deadlineAt: string
				tiers: Array<{
					rank: number
					name: string
					quantity: number
					imageUrl?: string
				}>
				status: string
				createdAt: string
				participantsCount: number
			}
		> = {
			'1': {
				id: '1',
				title: '넨도로이드 스누피',
				description:
					'세계적 인기 애니메이션 피너츠의 스누피가 넨도로이드로 등장! 표정 파츠 2종(SMILE, LAUGH), 우드스탁, 선글라스, 집 지붕 등 다양한 옵션 파츠가 포함되어 있습니다. 새 상품이며 박스 포장 상태입니다.',
				entryFee: 4500,
				minParticipants: 3,
				maxParticipants: 10,
				imageUrl:
					'https://images.goodsmile.info/cgm/images/product/20230911/14938/120850/large/71230d7edbc29bae0ab3b5c58fa19f54.jpg',
				deadlineAt: new Date(currentTime + 3 * 60 * 60 * 1000).toISOString(),
				tiers: [
					{
						rank: 1,
						name: '넨도로이드 스누피 (우드스탁 + 지붕 포함)',
						quantity: 1,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20230911/14938/120850/large/71230d7edbc29bae0ab3b5c58fa19f54.jpg',
					},
					{
						rank: 2,
						name: '넨도로이드 폼폼푸린 (마핀 + 푸딩 세트)',
						quantity: 2,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20230929/15039/121785/large/69730be34f86844b0bf144d33ef942f7.jpg',
					},
					{
						rank: 3,
						name: '넨도로이드 패트릭 스타 (카니버거 포함)',
						quantity: 2,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20231102/15182/123063/large/7e9b9d24c6541f535f825e2bf2b257aa.jpg',
					},
				],
				status: '진행중',
				createdAt: new Date(currentTime - 12 * 60 * 60 * 1000).toISOString(),
				participantsCount: 7,
			},
			'2': {
				id: '2',
				title: '넨도로이드 폼폼푸린',
				description:
					'고동색 베레모가 트레이드마크인 골든 리트리버 남자아이! 산리오의 인기 캐릭터 폼폼푸린의 넨도로이드입니다. 표정 파츠 2종(평소 얼굴, 싱글벙글 얼굴), 마핀, 푸딩, 스푼 등 귀여운 옵션 파츠가 가득! 새 상품이며 박스 포장 상태입니다.',
				entryFee: 3800,
				minParticipants: 3,
				maxParticipants: 10,
				imageUrl:
					'https://images.goodsmile.info/cgm/images/product/20230929/15039/121785/large/69730be34f86844b0bf144d33ef942f7.jpg',
				deadlineAt: new Date(currentTime + 8 * 60 * 60 * 1000).toISOString(),
				tiers: [
					{
						rank: 1,
						name: '넨도로이드 폼폼푸린 (마핀 + 푸딩 세트)',
						quantity: 1,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20230929/15039/121785/large/69730be34f86844b0bf144d33ef942f7.jpg',
					},
				],
				status: '진행중',
				createdAt: new Date(currentTime - 6 * 60 * 60 * 1000).toISOString(),
				participantsCount: 5,
			},
			'3': {
				id: '3',
				title: '넨도로이드 노하라 신노스케',
				description:
					'짱구는 못말려의 호기심 왕성한 5살 꼬마 신노스케! 표정 파츠 3종(평범한 얼굴, 탈력 얼굴, 흥분한 얼굴), 눈썹 가동/교환으로 더 풍부한 표정 연출 가능! 애견 흰둥이, 초코비, 엉덩이별인 전용 파츠까지 포함된 호화 사양! 새 상품이며 박스 포장 상태입니다.',
				entryFee: 5200,
				minParticipants: 3,
				maxParticipants: 12,
				imageUrl:
					'https://images.goodsmile.info/cgm/images/product/20200413/9424/68958/large/6f7668dc119dc3aebf6c8ad7b78f4fa5.jpg',
				deadlineAt: new Date(currentTime + 12 * 60 * 60 * 1000).toISOString(),
				tiers: [
					{
						rank: 1,
						name: '넨도로이드 노하라 신노스케 (흰둥이 + 엉덩이별인 세트)',
						quantity: 1,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20200413/9424/68958/large/6f7668dc119dc3aebf6c8ad7b78f4fa5.jpg',
					},
					{
						rank: 2,
						name: '넨도로이드 아카자 (나침 시트 포함)',
						quantity: 2,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20230420/14296/114578/large/cd52b264fc29fc9485e68e34d94f8d35.jpg',
					},
					{
						rank: 3,
						name: '넨도로이드 키노모토 사쿠라 (케로짱 포함)',
						quantity: 3,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20140424/4400/28781/large/e9e71d6c222e420823e82f57d22018e8.jpg',
					},
				],
				status: '진행중',
				createdAt: new Date(currentTime - 24 * 60 * 60 * 1000).toISOString(),
				participantsCount: 9,
			},
			'4': {
				id: '4',
				title: '카마도 네즈코 무한열차',
				description:
					'무한열차편 차내 전투 장면을 재현한 네즈코 피규어입니다. 광원 연출이 가능한 USB 케이블 포함, 새 상품이며 박스 포장 상태입니다. 극중 장면 재현을 위해 360도 감상이 아닌 특정 각도 연출에 최적화된 특별한 제작 방식을 채택했습니다.',
				entryFee: 18000,
				minParticipants: 5,
				maxParticipants: 15,
				imageUrl:
					'https://images.goodsmile.info/cgm/images/product/20230803/14775/119190/large/113d794ff4cc8f64a93966ce030f5314.jpg',
				deadlineAt: new Date(currentTime + 2 * 60 * 60 * 1000).toISOString(),
				tiers: [
					{
						rank: 1,
						name: '카마도 네즈코 무한열차 피규어 (USB 광원 포함)',
						quantity: 1,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20230803/14775/119190/large/113d794ff4cc8f64a93966ce030f5314.jpg',
					},
				],
				status: '진행중',
				createdAt: new Date(currentTime - 24 * 60 * 60 * 1000).toISOString(),
				participantsCount: 11,
			},
			'5': {
				id: '5',
				title: '넨도로이드 아리마 카나',
				description:
					'TV 애니메이션 【최애의 아이】의 중조(重曹)짱! 아리마 카나가 넨도로이드로 등장합니다. 표정 파츠 3종(미소 얼굴, 어이없는 얼굴, 푸쿠쿠 얼굴), 모자, 대본 등 옵션 파츠 포함. 새 상품이며 박스 포장 상태입니다.',
				entryFee: 4800,
				minParticipants: 3,
				maxParticipants: 12,
				imageUrl:
					'https://images.goodsmile.info/cgm/images/product/20231018/15099/122334/large/1b9d0098a3182abc3245d2465295e97a.jpg',
				deadlineAt: new Date(currentTime + 45 * 60 * 1000).toISOString(),
				tiers: [
					{
						rank: 1,
						name: '넨도로이드 아리마 카나 (표정 파츠 3종 + 모자)',
						quantity: 1,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20231018/15099/122334/large/1b9d0098a3182abc3245d2465295e97a.jpg',
					},
					{
						rank: 2,
						name: '넨도로이드 스누피 (우드스탁 포함)',
						quantity: 2,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20230911/14938/120850/large/71230d7edbc29bae0ab3b5c58fa19f54.jpg',
					},
				],
				status: '마감임박',
				createdAt: new Date(currentTime - 3 * 60 * 60 * 1000).toISOString(),
				participantsCount: 10,
			},
			'6': {
				id: '6',
				title: '넨도로이드 키노모토 사쿠라',
				description:
					'불후의 명작 카드캡터 사쿠라의 주인공! 표정 파츠 3종(미소, 봉인 해제 얼굴, 하냥 얼굴), 봉인의 지팡이, 크로우 카드, 케로짱이 포함되어 있습니다. 비행 마법 재현도 가능! 새 상품이며 박스 포장 상태입니다.',
				entryFee: 5500,
				minParticipants: 4,
				maxParticipants: 12,
				imageUrl:
					'https://images.goodsmile.info/cgm/images/product/20140424/4400/28781/large/e9e71d6c222e420823e82f57d22018e8.jpg',
				deadlineAt: new Date(currentTime + 6 * 60 * 60 * 1000).toISOString(),
				tiers: [
					{
						rank: 1,
						name: '넨도로이드 키노모토 사쿠라 (봉인의 지팡이 + 케로짱)',
						quantity: 1,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20140424/4400/28781/large/e9e71d6c222e420823e82f57d22018e8.jpg',
					},
				],
				status: '진행중',
				createdAt: new Date(currentTime - 18 * 60 * 60 * 1000).toISOString(),
				participantsCount: 8,
			},
			'7': {
				id: '7',
				title: '넨도로이드 토키토 무이치로',
				description:
					'귀살대 최연소 주(柱)인 토키토 무이치로의 넨도로이드입니다. 3가지 표정 파츠(멍한 얼굴, 전투 얼굴, 미소 얼굴), 일륜도, 이펙트 파츠 등이 포함되어 있습니다. 새 상품이며 박스 포장 상태입니다.',
				entryFee: 5000,
				minParticipants: 3,
				maxParticipants: 10,
				imageUrl:
					'https://images.goodsmile.info/cgm/images/product/20230720/14689/118448/large/464a4074d9d18765aa35f5744f14cbf7.jpg',
				deadlineAt: new Date(currentTime + 10 * 60 * 60 * 1000).toISOString(),
				tiers: [
					{
						rank: 1,
						name: '넨도로이드 토키토 무이치로 (표정 파츠 3종 + 이펙트)',
						quantity: 1,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20230720/14689/118448/large/464a4074d9d18765aa35f5744f14cbf7.jpg',
					},
				],
				status: '진행중',
				createdAt: new Date(currentTime - 8 * 60 * 60 * 1000).toISOString(),
				participantsCount: 6,
			},
			'8': {
				id: '8',
				title: '넨도로이드 패트릭 스타',
				description:
					'세계적 인기 애니메이션 스폰지밥의 패트릭 스타가 넨도로이드로 등장! 표정 파츠 3종(웃는 얼굴, 반짝반짝 얼굴, 으쓱 얼굴), 카니버거 손 파츠 포함. 새 상품이며 박스 포장 상태입니다.',
				entryFee: 3500,
				minParticipants: 3,
				maxParticipants: 10,
				imageUrl:
					'https://images.goodsmile.info/cgm/images/product/20231102/15182/123063/large/7e9b9d24c6541f535f825e2bf2b257aa.jpg',
				deadlineAt: new Date(currentTime + 24 * 60 * 60 * 1000).toISOString(),
				tiers: [
					{
						rank: 1,
						name: '넨도로이드 패트릭 스타 (카니버거 세트)',
						quantity: 1,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20231102/15182/123063/large/7e9b9d24c6541f535f825e2bf2b257aa.jpg',
					},
				],
				status: '진행중',
				createdAt: new Date(currentTime - 4 * 60 * 60 * 1000).toISOString(),
				participantsCount: 4,
			},
			'9': {
				id: '9',
				title: '넨도로이드 아카자',
				description:
					'귀멸의 칼날의 강력한 상현의 참 아카자! 표정 파츠 3종(미소 얼굴, 분노 얼굴, 진심 얼굴), 나침 시트, 연격 이펙트 파츠 등이 포함되어 있습니다. 새 상품이며 박스 포장 상태입니다.',
				entryFee: 6500,
				minParticipants: 4,
				maxParticipants: 12,
				imageUrl:
					'https://images.goodsmile.info/cgm/images/product/20230420/14296/114578/large/cd52b264fc29fc9485e68e34d94f8d35.jpg',
				deadlineAt: new Date(currentTime + 15 * 60 * 60 * 1000).toISOString(),
				tiers: [
					{
						rank: 1,
						name: '넨도로이드 아카자 (나침 시트 + 연격 이펙트)',
						quantity: 1,
						imageUrl:
							'https://images.goodsmile.info/cgm/images/product/20230420/14296/114578/large/cd52b264fc29fc9485e68e34d94f8d35.jpg',
					},
				],
				status: '진행중',
				createdAt: new Date(currentTime - 36 * 60 * 60 * 1000).toISOString(),
				participantsCount: 9,
			},
		}

		const mockRaffleData = mockRaffles[id] || mockRaffles['1']

		/**
		 * TODO: API Spec 작성된 이후 '참여자 목록, 외부 시드' 외부에서 주입하도록 수정
		 * 현재는 Mock 데이터로 대체
		 */
		const mockParticipants: Participant[] = [
			{
				id: '1',
				displayName: '호흡의달인',
				joinedAt: new Date(currentTime - 60 * 60 * 1000),
			},
			{
				id: '2',
				displayName: '귀살대지원자',
				joinedAt: new Date(currentTime - 50 * 60 * 1000),
			},
			{
				id: '3',
				displayName: '탄지로팬',
				joinedAt: new Date(currentTime - 40 * 60 * 1000),
			},
			{
				id: '4',
				displayName: '네즈코러버',
				joinedAt: new Date(currentTime - 30 * 60 * 1000),
			},
			{
				id: '5',
				displayName: '렌고쿠형님',
				joinedAt: new Date(currentTime - 20 * 60 * 1000),
			},
			{
				id: '6',
				displayName: '우즈이텐젠',
				joinedAt: new Date(currentTime - 15 * 60 * 1000),
			},
			{
				id: '7',
				displayName: '이노스케최강',
				joinedAt: new Date(currentTime - 10 * 60 * 1000),
			},
		]

		return {
			id: mockRaffleData.id,
			title: mockRaffleData.title,
			description: mockRaffleData.description,
			imageUrl: mockRaffleData.imageUrl,
			entryFee: mockRaffleData.entryFee,
			minParticipants: mockRaffleData.minParticipants,
			maxParticipants: mockRaffleData.maxParticipants,
			currentParticipants: mockRaffleData.participantsCount,
			endTime: new Date(mockRaffleData.deadlineAt),
			status: mockRaffleData.status,
			createdAt: new Date(mockRaffleData.createdAt),
			prizes: mockRaffleData.tiers.map((tier) => ({
				rank: tier.rank,
				name: tier.name,
				quantity: tier.quantity,
				imageUrl: tier.imageUrl,
			})),
			participants: mockParticipants,
			externalSeed: '내일(2025-10-15) 비트코인 가격 마지막 자릿수',
		}
	}, [id, currentTime])

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
										key={participant.id}
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

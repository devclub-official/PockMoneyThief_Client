'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Gift, ExternalLink, Copy, CheckCircle2, XCircle } from 'lucide-react'
import type { MyRaffleResultV2Response } from '@/types'
import { useState } from 'react'

interface EventResultDisplayProps {
	result: MyRaffleResultV2Response
	onClose?: () => void
}

export function EventResultDisplay({ result, onClose }: EventResultDisplayProps) {
	const [copied, setCopied] = useState(false)

	const handleCopyGiftCode = async () => {
		if (result.winInfo?.giftCodeInfo) {
			try {
				await navigator.clipboard.writeText(result.winInfo.giftCodeInfo.giftCode)
				setCopied(true)
				setTimeout(() => setCopied(false), 2000)
			} catch (error) {
				console.error('복사 실패:', error)
				alert('복사에 실패했습니다.')
			}
		}
	}

	const handleOpenRegistrationUrl = () => {
		if (result.winInfo?.giftCodeInfo?.registrationUrl) {
			window.open(result.winInfo.giftCodeInfo.registrationUrl, '_blank')
		}
	}

	return (
		<div className="space-y-4 p-1">
			{/* 결과 헤더 (공통) */}
			<div className="text-center">
				{result.isWinner ? (
					<>
						<div className="mb-2 flex items-center justify-center gap-2 text-emerald-600">
							<CheckCircle2 className="h-8 w-8 md:h-10 md:w-10" />
							<h1 className="text-2xl font-bold md:text-3xl">축하합니다!</h1>
						</div>
						<p className="text-sm text-muted-foreground">당첨되셨습니다!</p>
					</>
				) : (
					<>
						<div className="mb-2 flex items-center justify-center gap-2 text-gray-600">
							<XCircle className="h-8 w-8 md:h-10 md:w-10" />
							<h1 className="text-2xl font-bold md:text-3xl">아쉽지만...</h1>
						</div>
						<p className="text-sm text-muted-foreground">다음 기회에 도전해보세요!</p>
					</>
				)}
			</div>

			<div className="grid gap-4 md:grid-cols-2 md:items-start">
				{/* 좌측: 상품 이미지 & 당첨 상품명 */}
				{result.isWinner && result.winInfo && (
					<div className="space-y-3">
						<Card className="overflow-hidden">
							<div className="relative aspect-video w-full bg-muted md:aspect-square">
								{result.winInfo.prizeImageUrl ? (
									<Image
										src={result.winInfo.prizeImageUrl}
										alt={result.winInfo.prizeName}
										fill
										className="object-cover"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center">
										<Gift className="h-12 w-12 text-muted-foreground" />
									</div>
								)}
							</div>
							<div className="p-3 text-center">
								<div className="text-xs text-muted-foreground">당첨 상품</div>
								<div className="line-clamp-1 font-bold">{result.winInfo.prizeName}</div>
							</div>
						</Card>
					</div>
				)}

				{/* 우측: 상세 정보 */}
				<div className="space-y-3">
					{result.isWinner && result.winInfo?.giftCodeInfo && (
						<Card>
							<CardContent className="space-y-3 p-4">
								<div className="text-center text-sm font-semibold">선물코드가 발급되었습니다</div>

								{/* 선물코드 */}
								<div className="bg-muted/50 rounded-lg p-3">
									<div className="mb-1 text-xs text-muted-foreground">선물코드</div>
									<div className="flex items-center gap-2">
										<code className="flex-1 font-mono text-base font-bold">
											{result.winInfo.giftCodeInfo.giftCode}
										</code>
										<Button variant="ghost" onClick={handleCopyGiftCode} className="h-8 w-8">
											{copied ? (
												<CheckCircle2 className="h-4 w-4 text-emerald-500" />
											) : (
												<Copy className="h-4 w-4" />
											)}
										</Button>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-2 text-xs">
									<div>
										<span className="text-muted-foreground">유효기간</span>
										<div className="font-medium">{result.winInfo.giftCodeInfo.expiryDate}</div>
									</div>
									<div className="text-right">
										<span className="text-muted-foreground">상품명</span>
										<div className="truncate font-medium">
											{result.winInfo.giftCodeInfo.giftName}
										</div>
									</div>
								</div>

								<Button
									onClick={handleOpenRegistrationUrl}
									className="w-full cursor-pointer bg-[#FEE500] text-[#000000] hover:bg-[#FEE500]/90"
									size="sm"
								>
									<ExternalLink className="mr-2 h-3 w-3" />
									카카오톡 등록하기
								</Button>
							</CardContent>
						</Card>
					)}

					{/* 참여 정보 (작게 표시) */}
					<div className="bg-muted/30 rounded-lg border px-3 py-2 text-xs text-muted-foreground">
						<div className="flex justify-between">
							<span>참여자</span>
							<span className="font-medium text-foreground">
								{result.myParticipation.displayName}
							</span>
						</div>
						<div className="mt-1 flex justify-between">
							<span>참여 시간</span>
							<span>{new Date(result.myParticipation.joinedAt).toLocaleString('ko-KR')}</span>
						</div>
					</div>
				</div>
			</div>

			{/* 닫기 버튼 */}
			{onClose && (
				<Button onClick={onClose} variant="outline" className="mt-2 w-full cursor-pointer">
					닫기
				</Button>
			)}
		</div>
	)
}

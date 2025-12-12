'use client'

import { useQuery } from '@tanstack/react-query'
import { myApi } from '@/lib/api'
import type { MyRaffleSelfResultResponse } from '@/types'
import Image from 'next/image'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'

interface MyRaffleResultClientProps {
	raffleId: string
}

export function MyRaffleResultClient({ raffleId }: MyRaffleResultClientProps) {
	const { data, isLoading, isError } = useQuery<MyRaffleSelfResultResponse>({
		queryKey: ['my-raffle-result', raffleId],
		queryFn: () => myApi.getSelfResult(raffleId),
	})

	if (isLoading) {
		return <LoadingState message="결과를 불러오는 중..." />
	}

	if (isError || !data) {
		return (
			<ErrorState
				title="결과를 불러올 수 없습니다"
				description="결과 정보를 가져오는 중 문제가 발생했습니다."
			/>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-semibold text-foreground">내 결과</h1>
				<span
					className={`rounded-full px-3 py-1 text-xs ${
						data.status === 'DRAWN'
							? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
							: 'bg-gray-50 text-gray-700 ring-1 ring-gray-200'
					}`}
				>
					상태: {data.status}
				</span>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* 좌: 래플/참여 정보 */}
				<div className="rounded-xl border bg-card p-6 lg:col-span-2">
					<div className="mb-4">
						<div className="text-sm text-muted-foreground">래플</div>
						<div className="truncate text-lg font-semibold">{data.raffleName || data.raffleId}</div>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<div className="text-sm text-muted-foreground">내 표시 이름</div>
							<div className="font-medium">{data.myParticipation.displayName || '-'}</div>
						</div>
						<div>
							<div className="text-sm text-muted-foreground">참여 시간</div>
							<div className="font-medium">
								{new Date(data.myParticipation.joinedAt).toLocaleString('ko-KR')}
							</div>
						</div>
						<div>
							<div className="text-sm text-muted-foreground">당첨 여부</div>
							<div
								className={`font-semibold ${data.isWinner ? 'text-emerald-600' : 'text-gray-600'}`}
							>
								{data.isWinner ? '당첨' : '미당첨'}
							</div>
						</div>
						<div className="flex items-center gap-6">
							<div>
								<div className="text-sm text-muted-foreground">배송 필요</div>
								<div className="font-medium">{data.shippingRequired ? '예' : '아니오'}</div>
							</div>
							<div>
								<div className="text-sm text-muted-foreground">배송 정보 제출</div>
								<div className="font-medium">{data.shippingSubmitted ? '완료' : '미제출'}</div>
							</div>
						</div>
					</div>
				</div>

				{/* 우: 당첨 정보+이미지 */}
				<div className="rounded-xl border bg-card p-6">
					<div className="mb-4 flex items-center justify-between">
						<div className="text-sm text-muted-foreground">당첨 정보</div>
						{data.winInfo ? (
							<span className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700 ring-1 ring-amber-200">
								WIN #{data.winInfo.rank}
							</span>
						) : (
							<span className="rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-600 ring-1 ring-gray-200">
								정보 없음
							</span>
						)}
					</div>

					{data.winInfo ? (
						<>
							<div className="mb-3 text-lg font-semibold">{data.winInfo.prizeName}</div>
							<div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
								{data.winInfo.prizeImageUrl ? (
									<Image
										src={data.winInfo.prizeImageUrl}
										alt={data.winInfo.prizeName}
										fill
										sizes="(max-width: 768px) 100vw, 33vw"
										className="object-cover"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
										이미지 없음
									</div>
								)}
							</div>
						</>
					) : (
						<div className="text-sm text-muted-foreground">
							아직 당첨 정보가 없습니다. 추첨 결과 공개 후 다시 확인해 주세요.
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

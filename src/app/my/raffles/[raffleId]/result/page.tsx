import { myApi } from '@/lib/api'
import type { MyRaffleSelfResultResponse } from '@/types'
import Image from 'next/image'

interface PageProps {
	params: { raffleId: string }
}

export const metadata = {
	title: '내 결과 - 가차추첨',
	description: '해당 래플에서 나의 당첨 여부와 정보를 확인하세요.',
}

// 사용자별 동적 데이터이므로 빌드 타임에 prerendering하지 않음
export const dynamic = 'force-dynamic'

export default async function MyRaffleSelfResultPage({ params }: PageProps) {
	const { raffleId } = params
	const data: MyRaffleSelfResultResponse = await myApi.getSelfResult(raffleId)

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

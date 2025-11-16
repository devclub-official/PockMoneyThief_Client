import { myApi } from '@/lib/api'
import type { MyRaffleSelfResultResponse } from '@/types'

interface PageProps {
	params: Promise<{ raffleId: string }>
}

export const metadata = {
	title: '내 결과 - 가차추첨',
	description: '해당 래플에서 나의 당첨 여부와 정보를 확인하세요.',
}

export default async function MyRaffleSelfResultPage({ params }: PageProps) {
	const { raffleId } = await params
	const data: MyRaffleSelfResultResponse = await myApi.getSelfResult(raffleId)

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-foreground mb-6 text-2xl font-semibold">내 결과</h1>
			<div className="rounded-xl border p-6">
				<div className="mb-4">
					<div className="text-muted-foreground text-sm">래플</div>
					<div className="text-lg font-medium">{data.raffleName || data.raffleId}</div>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<div className="text-muted-foreground text-sm">내 표시 이름</div>
						<div className="font-medium">{data.myParticipation.displayName || '-'}</div>
					</div>
					<div>
						<div className="text-muted-foreground text-sm">참여 시간</div>
						<div className="font-medium">
							{new Date(data.myParticipation.joinedAt).toLocaleString('ko-KR')}
						</div>
					</div>
					<div>
						<div className="text-muted-foreground text-sm">당첨 여부</div>
						<div className="font-medium">{data.isWinner ? '당첨' : '미당첨'}</div>
					</div>
					<div>
						<div className="text-muted-foreground text-sm">배송 필요</div>
						<div className="font-medium">{data.shippingRequired ? '예' : '아니오'}</div>
					</div>
					<div>
						<div className="text-muted-foreground text-sm">배송 정보 제출</div>
						<div className="font-medium">{data.shippingSubmitted ? '완료' : '미제출'}</div>
					</div>
				</div>

				{data.winInfo && (
					<div className="mt-6 rounded-lg border p-4">
						<div className="text-muted-foreground mb-2 text-sm">당첨 정보</div>
						<div className="text-lg font-semibold">
							#{data.winInfo.rank} {data.winInfo.prizeName}
						</div>
						{data.winInfo.prizeImageUrl && (
							<div className="text-muted-foreground mt-2 text-sm break-all">
								이미지: {data.winInfo.prizeImageUrl}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

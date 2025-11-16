import { serverApiClient } from '@/lib/api-server'
import { ShippingStatusBadge } from '@/components/dashboard/ShippingStatusBadge'
import type { ShippingStatus } from '@/types/dashboard'

export const metadata = {
	title: '내 당첨 목록 - 가차추첨',
	description: '내가 당첨된 모든 추첨을 확인하세요.',
}

export default async function MyWinsPage() {
	const { wins } = await serverApiClient.getMyWins()

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-foreground mb-6 text-2xl font-semibold">내 당첨 목록</h1>
			{wins.length === 0 ? (
				<div className="text-muted-foreground rounded-xl border p-10 text-center">
					당첨 이력이 없습니다.
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					{wins.map((win) => (
						<div key={win.raffleId} className="rounded-xl border p-5">
							<div className="text-muted-foreground mb-2 text-sm">{win.raffleName}</div>
							<div className="text-lg font-semibold">
								#{win.rank} {win.prizeName}
							</div>
							<div className="mt-3 flex items-center justify-between text-sm">
								<span className="text-muted-foreground">추첨일</span>
								<span className="font-medium">{new Date(win.drawnAt).toLocaleString('ko-KR')}</span>
							</div>
							<div className="mt-2">
								<ShippingStatusBadge status={win.shippingStatus as ShippingStatus} />
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

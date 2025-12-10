'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EventFlow } from '@/components/events/EventFlow'
import { Gift, Sparkles } from 'lucide-react'

interface EventCardProps {
	eventId: string
	title?: string
	description?: string
	imageUrl?: string
}

export function EventCard({
	eventId,
	title = '🍭 사탕뽑기 이벤트',
	description = '지금 참여하고 맛있는 사탕을 받아가세요!',
	imageUrl,
}: EventCardProps) {
	// alert('HIHIHI') removed
	const [showEventFlow, setShowEventFlow] = useState(false)

	return (
		<>
			<Card className="overflow-hidden transition-shadow hover:shadow-lg">
				<CardContent className="p-0">
					{/* 이벤트 배너 */}
					<div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-pink-100 to-purple-200">
						<div className="absolute inset-0 flex items-center justify-center">
							<Sparkles className="absolute left-4 top-4 h-6 w-6 animate-pulse text-pink-500" />
							<Sparkles className="absolute bottom-4 right-4 h-6 w-6 animate-pulse text-pink-500" />
							{imageUrl ? (
								<Image src={imageUrl} alt={title} fill className="object-cover" />
							) : (
								<div className="text-9xl">🍬</div>
							)}
						</div>
						<div className="absolute left-4 top-4 rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold text-white">
							진행중
						</div>
					</div>

					{/* 이벤트 정보 */}
					<div className="space-y-4 p-6">
						<div>
							<div className="mb-2 flex items-center gap-2">
								<Gift className="h-5 w-5 text-pink-600" />
								<h3 className="text-lg font-bold">{title}</h3>
							</div>
							<p className="text-sm text-muted-foreground">{description}</p>
						</div>

						{/* 참여 버튼 */}
						<Button
							onClick={() => setShowEventFlow(true)}
							className="w-full cursor-pointer bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
							size="lg"
						>
							<Sparkles className="mr-2 h-4 w-4" />
							지금 참여하기
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* 이벤트 플로우 */}
			{showEventFlow && (
				<EventFlow eventId={eventId} initialOpen={true} onClose={() => setShowEventFlow(false)} />
			)}
		</>
	)
}

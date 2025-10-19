// 대시보드 관련 타입 정의

export interface MyRaffle {
	id: string
	title: string
	description: string
	imageUrl: string
	status: 'PUBLISHED' | 'LOCKED' | 'CANCELLED' | 'COMPLETED'
	type: 'single' | 'multiple'
	currentParticipants: number
	maxParticipants: number
	deadlineAt: string
	winners?: Winner[]
}

export interface Winner {
	id: string
	raffleId: string
	participantId: string
	displayName: string
	rank: number
	itemName: string
	shippingStatus: 'PENDING' | 'INFO_SUBMITTED' | 'SHIPPED' | 'DELIVERED'
	shippingInfo?: {
		name: string
		phone: string
		zipcode: string
		address1: string
		address2?: string
	}
	trackingNumber?: string
}

export interface ParticipatedRaffle {
	id: string
	title: string
	imageUrl: string
	status: 'PUBLISHED' | 'LOCKED' | 'CANCELLED' | 'COMPLETED'
	isWinner: boolean
	itemName?: string
	shippingStatus?: 'PENDING' | 'INFO_SUBMITTED' | 'SHIPPED' | 'DELIVERED'
	participatedAt: string
}

export interface RaffleCardProps {
	raffle: MyRaffle
	onLock: (id: string) => void
	onCancel: (id: string) => void
	onDraw: (id: string) => void
	onTrackingSubmit: (winner: Winner) => void
	formatTimeLeft: (deadlineAt: string) => string
	router: ReturnType<typeof import('next/navigation').useRouter>
}

export interface StatusBadgeProps {
	status: string
}

export interface ShippingStatusBadgeProps {
	status: string
}

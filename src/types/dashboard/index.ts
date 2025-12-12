// 대시보드 관련 타입 정의
import type { Winner as ApiWinner } from '../raffle'
import type { RAFFLE_STATUS, SHIPPING_STATUS } from '@/lib/constants'

// 상태 타입 정의
export type RaffleStatus = (typeof RAFFLE_STATUS)[keyof typeof RAFFLE_STATUS]
export type ShippingStatus = (typeof SHIPPING_STATUS)[keyof typeof SHIPPING_STATUS]

// 대시보드용 Winner 타입 (API Winner를 확장)
export interface Winner extends ApiWinner {
	id: string
	raffleId: string
	shippingStatus: ShippingStatus
	shippingInfo?: {
		name: string
		phone: string
		zipcode: string
		address1: string
		address2?: string
	}
	trackingNumber?: string
}

export interface MyRaffle {
	id: string
	title: string
	description?: string
	imageUrl: string
	status: RaffleStatus
	type: 'single' | 'multiple'
	currentParticipants: number
	maxParticipants: number
	deadlineAt: string
	winners?: Winner[]
}

export interface ParticipatedRaffle {
	id: string
	title: string
	imageUrl: string
	status: RaffleStatus
	displayName?: string
	entryFee: number
	deadlineAt: string
	isWinner: boolean
	itemName?: string
	shippingStatus?: ShippingStatus
	participatedAt: string
	raffleType?: 'GIFTCON' | 'GENERAL'
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
	status: RaffleStatus
}

export interface ShippingStatusBadgeProps {
	status: ShippingStatus
}

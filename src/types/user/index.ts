// 사용자 관련 타입들

// 사용자 기본 정보
export interface User {
	id: string
	email: string
	nickname: string
	profileImage?: string
	createdAt: string
	updatedAt: string
}

// 사용자 프로필
export interface UserProfile {
	userId: string
	bio?: string
	preferences: UserPreferences
}

export interface UserPreferences {
	theme: 'light' | 'dark' | 'system'
	notifications: NotificationSettings
}

export interface NotificationSettings {
	email: boolean
	push: boolean
	raffleUpdates: boolean
}

// 인증 관련
export interface AuthToken {
	accessToken: string
	refreshToken: string
	expiresIn: number
}

export interface LoginRequest {
	email: string
	password: string
}

export interface RegisterRequest {
	email: string
	password: string
	nickname: string
}

// 사용자 참여 내역
export interface UserParticipation {
	id: string
	userId: string
	raffleId: string
	raffleTitle: string
	participatedAt: string
	status: 'participated' | 'won' | 'lost'
	prize?: string
}

// 사용자 당첨 내역
export interface UserWinning {
	id: string
	userId: string
	raffleId: string
	raffleTitle: string
	tierRank: number
	prize: string
	wonAt: string
	shippingStatus: 'pending' | 'shipped' | 'delivered'
	shippingAddress?: ShippingAddress
}

// 배송 정보
export interface ShippingAddress {
	name: string
	phone: string
	address: string
	detailAddress: string
	postalCode: string
}

// 공통 타입들

// API 공통 응답 타입
export interface ApiResponse<T> {
	data: T
	message: string
	success: boolean
}

export interface PaginatedResponse<T> {
	items: T[]
	total: number
	page: number
	limit: number
	hasNext: boolean
	hasPrev: boolean
}

export interface ApiError {
	code: string
	message: string
	details?: Record<string, unknown>
}

// 공통 ID 타입
export type Id<T = string> = T

// 공통 날짜 타입
export type ISODateString = string

// UI 공통 타입
export type ThemeMode = 'light' | 'dark' | 'system'

export interface Option<T = string> {
	value: T
	label: string
	disabled?: boolean
}

export interface TableColumn<T> {
	key: keyof T
	title: string
	sortable?: boolean
	width?: number
}

// 공통 상태 타입
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface BaseEntity {
	id: string
	createdAt: string
	updatedAt: string
}

// 시드 관련 타입 (공정성 검증용)
export interface SeedSource {
	type: 'kospi' | 'weather' | 'random' | 'manual'
	value: string
	timestamp: string
	description: string
}

export interface VerificationData {
	seed: string
	participants: string[]
	algorithm: string
	hash: string
	generatedAt: string
}

// 외부 API 연동 타입
export interface ExternalApiResponse {
	success: boolean
	data: unknown
	timestamp: string
	source: string
}

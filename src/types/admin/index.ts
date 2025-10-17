// 관리자 관련 타입들

// 대시보드 통계
export interface AdminDashboard {
	totalRaffles: number
	activeRaffles: number
	totalUsers: number
	totalParticipants: number
	totalRevenue: number
	recentActivity: AdminActivity[]
}

export interface AdminActivity {
	id: string
	type: 'raffle_created' | 'user_registered' | 'payment_completed' | 'raffle_ended'
	description: string
	timestamp: string
	userId?: string
	raffleId?: string
}

// 통계 데이터
export interface Statistics {
	period: 'daily' | 'weekly' | 'monthly'
	raffleStats: RaffleStatistics
	userStats: UserStatistics
	revenueStats: RevenueStatistics
}

export interface RaffleStatistics {
	totalCreated: number
	totalCompleted: number
	averageParticipants: number
	completionRate: number
}

export interface UserStatistics {
	totalUsers: number
	newUsers: number
	activeUsers: number
	retentionRate: number
}

export interface RevenueStatistics {
	totalRevenue: number
	averageRevenue: number
	growthRate: number
}

// 관리자 권한
export interface AdminUser {
	id: string
	email: string
	role: 'super_admin' | 'admin' | 'moderator'
	permissions: AdminPermission[]
	lastLoginAt?: string
}

export interface AdminPermission {
	resource: string
	actions: ('create' | 'read' | 'update' | 'delete')[]
}

// 관리자 작업 로그
export interface AdminLog {
	id: string
	adminId: string
	action: string
	target: string
	targetId: string
	details: Record<string, unknown>
	timestamp: string
}

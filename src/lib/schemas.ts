import { z } from 'zod'

// 경품 스키마
export const tierSchema = z.object({
	rank: z.number().int().positive(),
	name: z.string().min(1, '경품명을 입력해주세요'),
	quantity: z.number().int().positive('수량은 1 이상이어야 합니다'),
	imageUrl: z.string().url().optional().or(z.literal('')),
})

// 래플 생성 스키마
export const createRaffleSchema = z.object({
	title: z.string().min(1, '추첨명을 입력해주세요').max(100),
	description: z.string().min(1, '추첨 설명을 입력해주세요').max(500),
	entryFee: z.number().positive('참여비는 0보다 커야 합니다'),
	minParticipants: z.number().int().positive('최소 참여자는 1명 이상이어야 합니다'),
	maxParticipants: z.number().int().positive('최대 참여자는 1명 이상이어야 합니다'),
	deadlineAt: z.string().datetime(),
	imageUrl: z.string().url().optional().or(z.literal('')),
	tiers: z.array(tierSchema).min(1, '최소 1개의 경품을 추가해주세요'),
})

export type CreateRaffleFormData = z.infer<typeof createRaffleSchema>

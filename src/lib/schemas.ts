import { z } from 'zod'

// 경품 스키마
export const tierSchema = z.object({
	rank: z.number().int().positive(),
	name: z.string().min(1, '경품명을 입력해주세요'),
	quantity: z.number().int().positive('수량은 1 이상이어야 합니다'),
	imageUrl: z.string().url('올바른 이미지 URL을 입력해주세요'),
})

// 래플 생성 폼 스키마 (deadlineAt은 submit 시 계산되므로 제외)
export const createRaffleSchema = z.object({
	title: z.string().min(1, '추첨명을 입력해주세요').max(100),
	description: z.string().min(1, '추첨 설명을 입력해주세요').max(500),
	entryFee: z.number().positive('참여비는 0보다 커야 합니다'),
	minParticipants: z.number().int().positive('최소 참여자는 1명 이상이어야 합니다'),
	maxParticipants: z.number().int().positive('최대 참여자는 1명 이상이어야 합니다'),
	imageUrl: z.string().url('올바른 이미지 URL을 입력해주세요'),
	externalSeedDescription: z.string().min(1, '외부 시드 설명을 입력해주세요'),
	tiers: z.array(tierSchema).min(1, '최소 1개의 경품을 추가해주세요'),
})

export type CreateRaffleFormData = z.infer<typeof createRaffleSchema>

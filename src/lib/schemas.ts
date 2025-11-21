import { z } from 'zod'

// 경품 스키마
export const tierSchema = z.object({
	rank: z.number().int().positive(),
	name: z.string().min(1, '경품명을 입력해주세요').trim(),
	quantity: z.number().int().positive('수량은 1 이상이어야 합니다'),
	imageUrl: z
		.string()
		.trim()
		.refine((val) => val === '' || z.string().url().safeParse(val).success, {
			message: '올바른 이미지 URL을 입력해주세요',
		})
		.optional()
		.or(z.literal('')),
})

// 래플 생성 폼 스키마 (deadlineAt은 submit 시 계산되므로 제외)
export const createRaffleSchema = z
	.object({
		title: z.string().min(1, '추첨명을 입력해주세요').max(100),
		description: z.string().min(1, '추첨 설명을 입력해주세요').max(500),
		entryFee: z.number().positive('참여비는 0보다 커야 합니다'),
		minParticipants: z.number().int().positive('최소 참여자는 1명 이상이어야 합니다'),
		maxParticipants: z.number().int().positive('최대 참여자는 1명 이상이어야 합니다'),
		duration: z.number().int().min(1, '진행 시간은 1시간 이상이어야 합니다'),
		imageUrl: z.string().url('올바른 이미지 URL을 입력해주세요').optional().or(z.literal('')),
		externalSeedDescription: z.string().min(1, '외부 시드 설명을 입력해주세요'),
		tiers: z.array(tierSchema).min(1, '최소 1개의 경품을 추가해주세요'),
	})
	.refine((data) => data.maxParticipants >= data.minParticipants, {
		message: '최대 참여자는 최소 참여자보다 크거나 같아야 합니다',
		path: ['maxParticipants'],
	})

export type CreateRaffleFormData = z.infer<typeof createRaffleSchema>

// 배송지 입력 스키마
export const shippingAddressSchema = z.object({
	label: z.string().min(1, '배송지 이름을 입력해주세요').max(50),
	name: z.string().min(1, '수령인 이름을 입력해주세요').max(50),
	phone: z
		.string()
		.min(10, '전화번호를 정확히 입력해주세요')
		.max(20, '전화번호를 정확히 입력해주세요'),
	zipcode: z.string().min(1, '우편번호를 입력해주세요').max(10),
	address1: z.string().min(1, '주소를 입력해주세요').max(200),
	address2: z.string().min(1, '상세 주소를 입력해주세요').max(200),
})

export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>

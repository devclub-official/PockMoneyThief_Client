'use server'

import { cookies } from 'next/headers'
import ky from 'ky'
import type { CreateRaffleRequest, CreateRaffleResponse } from '@/types'
import { RAFFLE_STATUS, UPLOAD_CONSTANTS } from '@/lib/constants'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

/**
 * 서버 액션: 래플 생성
 *
 * 현재 상황: 인증 쿠키가 전달되지 않는 상태
 * 개발 중: USE_MOCK=true일 때 mock 데이터 반환
 */
export async function createRaffleAction(data: CreateRaffleRequest): Promise<CreateRaffleResponse> {
	// Mock 모드 (개발 중)
	if (USE_MOCK) {
		return {
			id: `${UPLOAD_CONSTANTS.MOCK_RAFFLE_ID_PREFIX}${Date.now()}`,
			title: data.title,
			description: data.description,
			entryFee: data.entryFee,
			minParticipants: data.minParticipants,
			maxParticipants: data.maxParticipants,
			deadlineAt: data.deadlineAt,
			imageUrl: data.imageUrl,
			externalSeedDescription: data.externalSeedDescription || '',
			tiers: data.tiers.map((tier) => ({
				rank: tier.rank,
				name: tier.name,
				imageUrl: tier.imageUrl,
				quantity: tier.quantity,
			})),
			status: RAFFLE_STATUS.PUBLISHED,
			createdAt: new Date().toISOString(),
		}
	}

	try {
		const cookieStore = await cookies()
		const cookieHeader = cookieStore.toString()

		const response = await ky
			.post(`${baseURL}/raffles`, {
				json: data,
				headers: {
					Cookie: cookieHeader,
				},
			})
			.json<CreateRaffleResponse>()

		return response
	} catch (error) {
		throw error
	}
}

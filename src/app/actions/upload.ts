'use server'

import { cookies } from 'next/headers'
import ky from 'ky'
import type { PresignedUrlRequest, PresignedUrlResponse } from '@/types'
import { UPLOAD_CONSTANTS } from '@/lib/constants'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

/**
 * 서버 액션: Presigned URL 생성
 *
 * 현재 상황: Spring OAuth2 세션 기반 인증과 Next.js 구조적 충돌로 인해
 * 쿠키가 전달되지 않는 상태. 쿠키 문제 해결되면 자동으로 작동함.
 *
 * 개발 중: USE_MOCK=true일 때 mock 데이터 반환
 */
export async function getPresignedUrlAction(
	data: PresignedUrlRequest,
): Promise<PresignedUrlResponse> {
	// Mock 모드 (개발 중)
	if (USE_MOCK) {
		const mockFileUrl = `${UPLOAD_CONSTANTS.S3_BUCKET_URL}/${data.purpose}/${Date.now()}_${data.filename}`
		return {
			uploadUrl: mockFileUrl,
			fileUrl: mockFileUrl,
			expiresIn: UPLOAD_CONSTANTS.PRESIGNED_URL_EXPIRES_IN,
		}
	}

	try {
		// 서버에서 쿠키 가져오기 (쿠키 문제 해결되면 작동)
		const cookieStore = await cookies()
		const cookieHeader = cookieStore.toString()

		// 서버에서 백엔드 API 호출 (쿠키 포함)
		const response = await ky
			.post(`${baseURL}/upload/presigned-url`, {
				json: data,
				headers: {
					Cookie: cookieHeader,
				},
			})
			.json<PresignedUrlResponse>()

		return response
	} catch (error) {
		// 개발 중 에러 시 mock 반환
		if (process.env.NODE_ENV === 'development') {
			const mockFileUrl = `${UPLOAD_CONSTANTS.S3_BUCKET_URL}/${data.purpose}/${Date.now()}_${data.filename}`
			return {
				uploadUrl: mockFileUrl,
				fileUrl: mockFileUrl,
				expiresIn: UPLOAD_CONSTANTS.PRESIGNED_URL_EXPIRES_IN,
			}
		}
		throw error
	}
}

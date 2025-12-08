// 이미지 업로드 관련 타입 정의

// POST /upload/presigned-url 요청
export interface PresignedUrlRequest {
	filename: string
	contentType: string
	purpose: 'raffle' | 'prize'
}

// POST /upload/presigned-url 응답
export interface PresignedUrlResponse {
	uploadUrl: string
	fileUrl: string
	expiresIn: number
}

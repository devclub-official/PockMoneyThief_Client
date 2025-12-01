import { getPresignedUrlAction } from '@/app/actions/upload'
import type { ImagePurpose, PresignedUrlResponse } from '@/types'

export interface UploadImageOptions {
	file: File
	purpose: ImagePurpose
	onProgress?: (progress: number) => void
}

export interface UploadImageResult {
	fileUrl: string
	success: boolean
	error?: string
}

/**
 * 이미지 파일을 S3에 업로드하는 유틸 함수
 *
 * 플로우:
 * 1. 서버 액션으로 presigned URL 요청 (인증 처리)
 * 2. 받은 uploadUrl로 S3에 직접 파일 업로드 (PUT)
 * 3. 업로드 완료 후 fileUrl 반환
 *
 * @param options 업로드 옵션 (file, purpose, onProgress)
 * @returns 업로드 결과 (fileUrl, success, error)
 */
export async function uploadImage(options: UploadImageOptions): Promise<UploadImageResult> {
	const { file, purpose, onProgress } = options

	try {
		// 1. 파일 검증
		if (!file.type.startsWith('image/')) {
			return {
				fileUrl: '',
				success: false,
				error: '이미지 파일만 업로드 가능합니다.',
			}
		}

		// 2. 서버 액션으로 presigned URL 요청 (인증 처리)
		const presignedData = await getPresignedUrlAction({
			filename: file.name,
			contentType: file.type,
			purpose,
		})

		// 3. S3에 직접 파일 업로드 (PUT 요청)
		const uploadResponse = await fetch(presignedData.uploadUrl, {
			method: 'PUT',
			body: file,
			headers: {
				'Content-Type': file.type,
			},
		})

		if (!uploadResponse.ok) {
			return {
				fileUrl: '',
				success: false,
				error: `업로드 실패: ${uploadResponse.statusText}`,
			}
		}

		// 4. 업로드 완료 - fileUrl 반환
		return {
			fileUrl: presignedData.fileUrl,
			success: true,
		}
	} catch (error) {
		return {
			fileUrl: '',
			success: false,
			error: error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.',
		}
	}
}

/**
 * 여러 이미지를 순차적으로 업로드
 */
export async function uploadImages(
	files: File[],
	purpose: ImagePurpose,
	onProgress?: (current: number, total: number) => void,
): Promise<UploadImageResult[]> {
	const results: UploadImageResult[] = []

	for (let i = 0; i < files.length; i++) {
		const file = files[i]
		onProgress?.(i + 1, files.length)

		const result = await uploadImage({
			file,
			purpose,
		})

		results.push(result)

		// 하나라도 실패하면 중단할지 결정 (현재는 계속 진행)
	}

	return results
}

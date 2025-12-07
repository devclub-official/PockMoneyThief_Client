import { useState, useCallback } from 'react'
import { uploadApi } from '@/lib/api'
import type { PresignedUrlRequest } from '@/types'

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

interface UseImageUploadOptions {
	onSuccess?: (fileUrl: string) => void
	onError?: (error: Error) => void
}

export function useImageUpload(options?: UseImageUploadOptions) {
	const [status, setStatus] = useState<UploadStatus>('idle')
	const [fileUrl, setFileUrl] = useState<string | null>(null)
	const [error, setError] = useState<Error | null>(null)

	const upload = useCallback(
		async (file: File, purpose: 'raffle' | 'prize') => {
			// 파일 검증
			const maxSize = 10 * 1024 * 1024 // 10MB
			if (file.size > maxSize) {
				const error = new Error('파일 크기는 10MB 이하여야 합니다.')
				setError(error)
				setStatus('error')
				options?.onError?.(error)
				return
			}

			const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
			if (!allowedTypes.includes(file.type)) {
				const error = new Error('이미지 파일만 업로드 가능합니다. (JPEG, PNG, WebP)')
				setError(error)
				setStatus('error')
				options?.onError?.(error)
				return
			}

			try {
				setStatus('uploading')
				setError(null)

				// 1. Presigned URL 요청
				const requestData: PresignedUrlRequest = {
					filename: file.name,
					contentType: file.type,
					purpose,
				}

				const presignedResponse = await uploadApi.getPresignedUrl(requestData)

				// 2. S3에 직접 업로드
				await uploadApi.uploadToS3(presignedResponse.uploadUrl, file)

				// 3. 성공 처리
				setFileUrl(presignedResponse.fileUrl)
				setStatus('success')
				options?.onSuccess?.(presignedResponse.fileUrl)
			} catch (err) {
				const error = err instanceof Error ? err : new Error('이미지 업로드에 실패했습니다.')
				setError(error)
				setStatus('error')
				options?.onError?.(error)
			}
		},
		[options],
	)

	const reset = useCallback(() => {
		setStatus('idle')
		setFileUrl(null)
		setError(null)
	}, [])

	return {
		upload,
		reset,
		status,
		fileUrl,
		error,
		isUploading: status === 'uploading',
		isSuccess: status === 'success',
		isError: status === 'error',
	}
}

import { useState } from 'react'
import { uploadImage, type UploadImageOptions, type UploadImageResult } from '@/lib/upload'

export interface UseImageUploadOptions {
	purpose: UploadImageOptions['purpose']
	onSuccess?: (fileUrl: string) => void
	onError?: (error: string) => void
}

export interface UseImageUploadReturn {
	upload: (file: File) => Promise<UploadImageResult>
	isUploading: boolean
	progress: number
	error: string | null
}

/**
 * 이미지 업로드를 위한 커스텀 훅
 *
 * @example
 * ```tsx
 * const { upload, isUploading, error } = useImageUpload({
 *   purpose: 'raffle',
 *   onSuccess: (fileUrl) => {
 *     console.log('업로드 완료:', fileUrl)
 *   }
 * })
 *
 * const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0]
 *   if (file) {
 *     const result = await upload(file)
 *     if (result.success) {
 *       // result.fileUrl 사용
 *     }
 *   }
 * }
 * ```
 */
export function useImageUpload(options: UseImageUploadOptions): UseImageUploadReturn {
	const { purpose, onSuccess, onError } = options
	const [isUploading, setIsUploading] = useState(false)
	const [progress, setProgress] = useState(0)
	const [error, setError] = useState<string | null>(null)

	const upload = async (file: File): Promise<UploadImageResult> => {
		setIsUploading(true)
		setProgress(0)
		setError(null)

		try {
			const result = await uploadImage({
				file,
				purpose,
				onProgress: setProgress,
			})

			if (result.success) {
				setProgress(100)
				onSuccess?.(result.fileUrl)
			} else {
				setError(result.error || '업로드 실패')
				onError?.(result.error || '업로드 실패')
			}

			return result
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다.'
			setError(errorMessage)
			onError?.(errorMessage)

			return {
				fileUrl: '',
				success: false,
				error: errorMessage,
			}
		} finally {
			setIsUploading(false)
		}
	}

	return {
		upload,
		isUploading,
		progress,
		error,
	}
}

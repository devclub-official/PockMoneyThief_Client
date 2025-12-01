'use client'

import * as React from 'react'
import { useRef, useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useImageUpload } from '@/hooks/useImageUpload'
import { validateImageUrl } from '@/lib/image-validation'
import type { ImagePurpose } from '@/types'
import { cn } from '@/lib/cn'

interface ImageUploadButtonProps {
	purpose: ImagePurpose
	onUploadSuccess: (fileUrl: string) => void
	onUploadError?: (error: string) => void
	disabled?: boolean
	className?: string
	children?: React.ReactNode
	value?: string // 현재 이미지 URL (폼 필드와 연동)
}

export function ImageUploadButton({
	purpose,
	onUploadSuccess,
	onUploadError,
	disabled = false,
	className,
	children,
	value,
}: ImageUploadButtonProps) {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(value || null)
	const [urlError, setUrlError] = useState<string | null>(null)

	const {
		upload,
		isUploading,
		error: uploadError,
	} = useImageUpload({
		purpose,
		onSuccess: (fileUrl) => {
			onUploadSuccess(fileUrl)
		},
		onError: (errorMessage) => {
			onUploadError?.(errorMessage)
		},
	})

	// value가 변경되면 미리보기 업데이트 (URL 검증 포함)
	React.useEffect(() => {
		if (!isUploading) {
			if (value && value.trim()) {
				// URL 검증
				const validation = validateImageUrl(value.trim())
				if (validation.valid) {
					// 유효한 URL이면 미리보기 업데이트
					setPreviewUrl((prev) => {
						// 로컬 미리보기(data:) 중이면 유지, 아니면 업데이트
						if (prev && prev.startsWith('data:')) {
							return prev
						}
						return value.trim()
					})
					setUrlError(null)
				} else {
					// 유효하지 않은 URL이면 에러 표시
					setUrlError(validation.error || '올바른 이미지 URL이 아닙니다.')
					setPreviewUrl((prev) => {
						if (prev && prev.startsWith('data:')) {
							return prev
						}
						return null
					})
				}
			} else if (!value || !value.trim()) {
				// value가 비어있으면 초기화 (로컬 미리보기는 유지)
				setPreviewUrl((prev) => {
					if (prev && prev.startsWith('data:')) {
						return prev
					}
					return null
				})
				setUrlError(null)
			}
		}
	}, [value, isUploading])

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		// 미리보기 생성
		const reader = new FileReader()
		reader.onloadend = () => {
			setPreviewUrl(reader.result as string)
		}
		reader.readAsDataURL(file)

		// 업로드 실행
		const result = await upload(file)
		if (result.success && result.fileUrl) {
			// 업로드 성공 시 실제 URL로 미리보기 교체
			setPreviewUrl(result.fileUrl)
			// onUploadSuccess는 useImageUpload의 onSuccess에서 호출됨
		}

		// 파일 입력 초기화 (같은 파일 다시 선택 가능하도록)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	const handleClick = () => {
		if (!disabled && !isUploading) {
			fileInputRef.current?.click()
		}
	}

	const handleRemove = (e: React.MouseEvent) => {
		e.stopPropagation()
		setPreviewUrl(null)
		onUploadSuccess('')
	}

	return (
		<div className={cn('space-y-2', className)}>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileSelect}
				className="hidden"
				disabled={disabled || isUploading}
			/>

			{previewUrl ? (
				<div className="group relative">
					<div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
						<img src={previewUrl} alt="미리보기" className="h-full w-full object-cover" />
						<button
							type="button"
							onClick={handleRemove}
							disabled={disabled || isUploading}
							className="absolute top-2 right-2 cursor-pointer rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70 disabled:opacity-50"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				</div>
			) : (
				<Button
					type="button"
					variant="outline"
					onClick={handleClick}
					disabled={disabled || isUploading}
					className="w-full"
				>
					{isUploading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							업로드 중...
						</>
					) : (
						<>
							<Upload className="mr-2 h-4 w-4" />
							{children || '이미지 업로드'}
						</>
					)}
				</Button>
			)}

			{(uploadError || urlError) && (
				<p className="text-sm text-red-500">{uploadError || urlError}</p>
			)}
		</div>
	)
}

'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useImageUpload } from '@/hooks/useImageUpload'
import { useToast } from '@/components/ui/Toast'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ImageUploadProps {
	value?: string
	onChange?: (url: string) => void
	purpose: 'raffle' | 'prize'
	label?: string
	className?: string
	disabled?: boolean
}

export function ImageUpload({
	value = '',
	onChange,
	purpose,
	label,
	className,
	disabled = false,
}: ImageUploadProps) {
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { addToast } = useToast()

	const { upload, reset, status, fileUrl, error, isUploading } = useImageUpload({
		onSuccess: (url) => {
			onChange?.(url)
			setSelectedFile(null)
			setPreviewUrl(null)
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
			addToast({
				title: '업로드 완료',
				description: '이미지가 성공적으로 업로드되었습니다.',
				variant: 'success',
				duration: 3000,
			})
		},
		onError: (error) => {
			addToast({
				title: '업로드 실패',
				description: error.message || '이미지 업로드에 실패했습니다.',
				variant: 'error',
				duration: 4000,
			})
		},
	})

	const handleFileSelect = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0]
			if (!file) return

			// 파일 검증
			const maxSize = 10 * 1024 * 1024 // 10MB
			if (file.size > maxSize) {
				alert('파일 크기는 10MB 이하여야 합니다.')
				return
			}

			const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
			if (!allowedTypes.includes(file.type)) {
				alert('이미지 파일만 업로드 가능합니다. (JPEG, PNG, WebP)')
				return
			}

			setSelectedFile(file)
			reset()

			// 미리보기 생성
			const reader = new FileReader()
			reader.onloadend = () => {
				setPreviewUrl(reader.result as string)
			}
			reader.readAsDataURL(file)
		},
		[reset],
	)

	const handleUpload = useCallback(() => {
		if (!selectedFile) return
		upload(selectedFile, purpose)
	}, [selectedFile, upload, purpose])

	const handleRemoveFile = useCallback(() => {
		setSelectedFile(null)
		setPreviewUrl(null)
		reset()
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}, [reset])

	const displayUrl = fileUrl || value
	const showPreview = previewUrl || displayUrl

	return (
		<div className={cn('space-y-2', className)}>
			{label && <Label>{label}</Label>}

			{/* 파일 선택 및 업로드 */}
			<div className="space-y-2">
				<div className="flex gap-2">
					<Input
						ref={fileInputRef}
						type="file"
						accept="image/jpeg,image/png,image/webp"
						onChange={handleFileSelect}
						disabled={disabled || isUploading}
						className="cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-medium"
					/>
					{selectedFile && !isUploading && (
						<Button
							type="button"
							variant="default"
							size="sm"
							onClick={handleUpload}
							disabled={disabled}
							className="cursor-pointer"
						>
							<Upload className="h-4 w-4" />
							업로드
						</Button>
					)}
					{selectedFile && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleRemoveFile}
							disabled={disabled || isUploading}
							className="cursor-pointer"
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>

				{isUploading && (
					<div className="text-muted-foreground flex items-center gap-2 text-sm">
						<LoadingSpinner size="sm" className="p-0" />
						<span>업로드 중...</span>
					</div>
				)}

				{error && (
					<div className="bg-destructive/10 border-destructive/20 text-destructive rounded-lg border px-3 py-2 text-sm">
						{error.message}
					</div>
				)}
			</div>

			{/* 미리보기 */}
			{showPreview && (
				<div className="border-input relative aspect-video w-full overflow-hidden rounded-lg border">
					<img
						src={previewUrl || displayUrl || ''}
						alt="미리보기"
						className="h-full w-full object-contain"
					/>
				</div>
			)}
		</div>
	)
}

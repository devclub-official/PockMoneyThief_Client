'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImageWithFallbackProps {
	src?: string
	alt: string
	className?: string
}

const FALLBACK_IMAGE =
	'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'

// src가 유효한지 검증하는 헬퍼 함수
const isValidImageSrc = (src: string | undefined | null): boolean => {
	return !!src && src.trim() !== ''
}

export function ImageWithFallback({ src, alt, className = '' }: ImageWithFallbackProps) {
	// 초기값 설정 시 검증
	const [imgSrc, setImgSrc] = useState<string>(isValidImageSrc(src) ? src! : FALLBACK_IMAGE)

	// src prop 변경 시 검증 및 업데이트
	useEffect(() => {
		if (isValidImageSrc(src)) {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			setImgSrc(src!)
		} else {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			setImgSrc(FALLBACK_IMAGE)
		}
	}, [src])

	return (
		<Image
			src={imgSrc}
			alt={alt}
			className={className}
			fill
			sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
			style={{ objectFit: 'cover' }}
			onError={() => {
				setImgSrc(FALLBACK_IMAGE)
			}}
		/>
	)
}

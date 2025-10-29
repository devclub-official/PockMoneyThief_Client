'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageWithFallbackProps {
	src: string
	alt: string
	className?: string
}

const FALLBACK_IMAGE =
	'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'

export function ImageWithFallback({
	src,
	alt,
	className = '',
}: ImageWithFallbackProps) {
	const [imgSrc, setImgSrc] = useState(src)

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


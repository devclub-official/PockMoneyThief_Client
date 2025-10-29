import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
	images: {
		unoptimized: true, // 이미지 최적화 비활성화 (외부 이미지 에러 방지)
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'loremflickr.com',
			},
			{
				protocol: 'https',
				hostname: 'images.goodsmile.info',
			},
		],
	},
}

// Wrap Next config with Sentry for source maps and error reporting in production
export default withSentryConfig(nextConfig, {
	silent: true,
})

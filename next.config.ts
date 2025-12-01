import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
	images: {
		// 보안: S3 버킷만 허용 (이미지 업로드만 사용)
		remotePatterns: [
			// AWS S3 버킷 (모든 리전)
			{
				protocol: 'https',
				hostname: '*.s3.*.amazonaws.com',
			},
			{
				protocol: 'https',
				hostname: '*.s3.amazonaws.com',
			},
			// 프로젝트 S3 버킷
			{
				protocol: 'https',
				hostname: 'pockmoneythief-images.s3.*.amazonaws.com',
			},
			{
				protocol: 'https',
				hostname: 'pockmoneythief-images.s3.amazonaws.com',
			},
		],
	},
}

// Wrap Next config with Sentry for source maps and error reporting in production
export default withSentryConfig(nextConfig, {
	silent: true,
})

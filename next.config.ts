import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
	/* config options here */
}

// Wrap Next config with Sentry for source maps and error reporting in production
export default withSentryConfig(nextConfig, {
	silent: true,
})

import { AsyncBoundary } from '@/components/boundary/AsyncBoundary'
import OAuthSuccess from '@/components/oauth/OAuthSuccess'

export default function OAuthSuccessPage() {
	return (
		<AsyncBoundary>
			<OAuthSuccess />
		</AsyncBoundary>
	)
}

import { AsyncBoundary } from '@/components/boundary/AsyncBoundary'
import OAuthSuccess from '@/components/oauth/OAuthSuccess'

export const OAuthSuccessPage = () => {
	return (
		<AsyncBoundary>
			<OAuthSuccess />
		</AsyncBoundary>
	)
}

export default OAuthSuccessPage

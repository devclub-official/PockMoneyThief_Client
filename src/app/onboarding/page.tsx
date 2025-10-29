import { Suspense } from 'react'
import { OnboardingRouter } from '@/components/onboarding/OnboardingRouter'

export const metadata = {
	title: '온보딩',
}

export default function OnboardingPage() {
	return (
		<Suspense>
			<OnboardingRouter />
		</Suspense>
	)
}

'use client'
import { useEffect } from 'react'
import { loginApi } from '@/lib/api'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'

export default function OAuthSuccess() {
	const router = useRouter()
	// const pathName = usePathname()
	const searchParams = useSearchParams()
	const returnTo = searchParams.get('returnTo')

	const { data: isOnboardingCompleted } = useSuspenseQuery({
		queryKey: ['user', 'onboarding-status'],
		queryFn: loginApi.checkOnboardingStatus,
	})

	useEffect(() => {
		if (isOnboardingCompleted === undefined) return

		let redirectUrl = ''

		if (isOnboardingCompleted) {
			redirectUrl = returnTo || '/'
		} else if (isOnboardingCompleted == false) {
			redirectUrl = `/onboarding?step=1${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ''}`
		}

		router.replace(redirectUrl)
	}, [router, isOnboardingCompleted, returnTo])

	return null
}

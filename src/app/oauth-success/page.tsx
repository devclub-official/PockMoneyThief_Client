'use client'

import { useEffect } from 'react'
import { loginApi } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export const OAuthSuccessPage = () => {
	const router = useRouter()
	const { data: isOnboardingCompleted, isFetching } = useQuery({
		queryKey: ['user', 'onboarding-status'],
		queryFn: loginApi.checkOnboardingStatus,
	})

	useEffect(() => {
		let redirectUrl = ''

		if (isOnboardingCompleted) {
			redirectUrl = '/'
		} else if (isOnboardingCompleted == false) {
			redirectUrl = '/onboarding?step=2'
		}

		router.replace(redirectUrl)
	}, [router, isOnboardingCompleted])

	if (isFetching) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
				<div className="text-center">
					<div className="mb-4">
						<div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
					</div>
					<h1 className="text-h2-bold text-gray-90 mb-2">로그인 처리 중입니다...</h1>
					<p className="text-b2-medium dark:text-gray-40 text-gray-50">
						잠시만 기다려주세요. 로그인 정보를 확인하고 있습니다.
					</p>
				</div>
			</div>
		)
	}

	return null
}

export default OAuthSuccessPage

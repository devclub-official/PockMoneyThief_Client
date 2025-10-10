'use client'
import { useSearchParams } from 'next/navigation'
import { TermsStep } from '@/components/onboarding/TermsStep'
import { NicknameStep } from '@/components/onboarding/NicknameStep'

export function OnboardingRouter() {
	const searchParams = useSearchParams()
	const stepParam = searchParams.get('step')
	const step = Number(stepParam ?? '1') || 1

	if (step === 2) return <NicknameStep />
	return <TermsStep />
}

'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { OAUTH_ENDPOINTS } from '@/lib/constants'

function getSafeReturnTo(searchParams: ReturnType<typeof useSearchParams>) {
	const raw = searchParams.get('returnTo') || '/'

	// 내부 경로만 허용: 반드시 '/'로 시작, '//'로 시작(프로토콜 상대) 금지
	if (raw.startsWith('/') && !raw.startsWith('//')) return raw
	return '/'
}

export function LoginCard() {
	const searchParams = useSearchParams()
	const handleLogin = () => {
		const returnTo = getSafeReturnTo(searchParams)

		const base = process.env.NEXT_PUBLIC_API_BASE_URL
		if (!base) {
			window.location.href = '/'
			return
		}
		window.location.href = `${base}${OAUTH_ENDPOINTS.KAKAO}?returnTo=${encodeURIComponent(returnTo)}`
	}

	return (
		<div className="relative flex min-h-[calc(100vh-112px)] items-center justify-center px-4 py-10 sm:px-6">
			{/* 배경 블러 원들 */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute top-24 left-10 h-56 w-56 rounded-full bg-purple-400/25 blur-3xl dark:bg-purple-500/25" />
				<div className="absolute bottom-16 left-20 h-40 w-40 rotate-12 rounded-2xl bg-indigo-300/20 blur-2xl dark:bg-indigo-400/20" />
				<div className="absolute top-16 right-16 h-48 w-48 rounded-full bg-fuchsia-300/25 blur-3xl dark:bg-fuchsia-400/25" />
				<div className="absolute right-24 bottom-20 h-56 w-56 -rotate-6 rounded-3xl bg-sky-300/20 blur-2xl dark:bg-sky-400/20" />
			</div>

			{/* 카드 */}
			<div className="mx-auto w-full max-w-[480px] rounded-2xl border border-black/10 bg-white px-6 py-9 shadow-[0_28px_90px_rgba(0,0,0,0.18),0_8px_26px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-[#111213]">
				<div className="mx-auto flex w-full max-w-[440px] flex-col items-center text-center">
					{/* 상단 아이콘 */}
					<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300">
						<span className="text-2xl">🎁</span>
					</div>

					<h1 className="mb-2 text-3xl font-extrabold tracking-tight text-purple-600 dark:text-purple-300">
						가차추첨
					</h1>
					<p className="mb-12 text-[15px] font-medium text-balance whitespace-pre-line text-gray-400 dark:text-gray-300">
						{`공정하고 투명한 가차 추첨 플랫폼에\n오신 것을 환영합니다`}
					</p>

					<p className="mb-6 text-base font-medium text-gray-400 dark:text-gray-300">
						카카오 계정으로 간편하게 시작하세요
					</p>

					{/* 특징 아이콘 3개 */}
					<div className="mb-8 grid w-full grid-cols-3 gap-3">
						<div className="flex flex-col items-center gap-2">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300">
								🎁
							</div>
							<span className="text-xs font-medium text-gray-400 dark:text-gray-300">
								가차 추첨
							</span>
						</div>
						<div className="flex flex-col items-center gap-2">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
								✅
							</div>
							<span className="text-xs font-medium text-gray-400 dark:text-gray-300">투명성</span>
						</div>
						<div className="flex flex-col items-center gap-2">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
								⚡
							</div>
							<span className="text-xs font-medium text-gray-400 dark:text-gray-300">
								빠른 결과
							</span>
						</div>
					</div>

					{/* 카카오 로그인 버튼 (동작은 추후 연동) */}
					<button
						onClick={handleLogin}
						className="mb-5 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl bg-[#F7C600] text-sm font-semibold text-black shadow-[inset_0_-3px_rgba(0,0,0,0.10)] transition active:translate-y-[1px]"
					>
						<span className="mr-2 inline-flex h-5 w-5 items-center justify-center">
							<Image src="/kakao.svg" alt="Kakao" width={20} height={20} />
						</span>
						카카오로 로그인
					</button>

					{/* 하단 배지 및 안내 */}
					<div className="mb-4 flex w-full items-center justify-center gap-2 border-t border-black/5 pt-4 text-xs dark:border-white/10">
						<span className="h-2 w-2 rounded-full bg-emerald-500" />
						<span className="font-medium text-emerald-600 dark:text-emerald-400">
							로또 시드 기반 공정한 추첨 시스템
						</span>
					</div>
					<p className="text-center text-xs leading-relaxed font-medium text-pretty whitespace-pre-line text-gray-400 dark:text-gray-300">
						{`로그인 시 서비스 이용약관 및 개인정보처리방침에 동의합니다.\n카카오 ID와 닉네임만 수집되며, 개인정보는 안전하게 보호됩니다.`}
					</p>
				</div>
			</div>
		</div>
	)
}

'use client'
import { useState } from 'react'
import Link from 'next/link'

export function TermsStep() {
	const [agreed, setAgreed] = useState(false)

	return (
		<div className="relative flex min-h-[calc(100vh-112px)] items-center justify-center px-4 py-10 sm:px-6">
			<div className="mx-auto w-full max-w-[680px] rounded-2xl border border-black/10 bg-white px-8 py-10 shadow-[0_20px_70px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-[#111213]">
				<div className="mx-auto w-full max-w-[560px]">
					<div className="mb-6 flex items-center justify-center">
						<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300">
							<span className="text-2xl">🎁</span>
						</div>
					</div>
					<h2 className="mb-2 text-center text-2xl font-extrabold text-gray-800 dark:text-gray-100">
						서비스 이용약관
					</h2>
					<p className="mb-8 text-center text-sm text-gray-500">
						서비스 이용을 위해 약관에 동의해 주세요
					</p>

					<div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-black/20">
						<div className="max-h-64 overflow-y-auto pr-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
							<ol className="list-decimal pl-5">
								<li className="mb-2 font-semibold">서비스 이용 규칙</li>
							</ol>
							<ul className="mb-4 list-disc pl-6">
								<li>공정한 추첨을 위해 부정한 방법으로 참여하지 않습니다</li>
								<li>허위 정보를 제공하지 않습니다</li>
								<li>타인을 비방하거나 욕설을 사용하지 않습니다</li>
							</ul>
							<ol className="list-decimal pl-5">
								<li className="mb-2 font-semibold">개인정보 처리방침</li>
							</ol>
							<ul className="list-disc pl-6">
								<li>카카오 ID와 닉네임만 수집됩니다</li>
								<li>이메일, 전화번호는 수집되지 않습니다</li>
								<li>배송 정보는 당첨 시에만 수집됩니다</li>
							</ul>
						</div>
					</div>

					<label className="mb-6 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
						<input
							type="checkbox"
							className="h-4 w-4 accent-purple-600"
							checked={agreed}
							onChange={(e) => setAgreed(e.target.checked)}
						/>
						<span>위 약관에 모두 동의합니다</span>
					</label>

					<Link
						href={agreed ? '/onboarding?step=2' : '#'}
						aria-disabled={!agreed}
						className={`inline-flex h-12 w-full items-center justify-center rounded-2xl bg-purple-500 text-white transition ${agreed ? 'opacity-100' : 'pointer-events-none opacity-60'}`}
					>
						<span className="mr-2">→</span>
						다음
					</Link>
				</div>
			</div>
		</div>
	)
}

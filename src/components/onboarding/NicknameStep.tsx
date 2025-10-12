'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function NicknameStep() {
	// 추후 user nickname 서버 측에서 받아 입력해주기
	const [nickname, setNickname] = useState('사용자115')
	const [saving, setSaving] = useState(false)
	const router = useRouter()
	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		try {
			await new Promise(() =>
				setTimeout(() => {
					router.push('/')
				}, 400),
			)
			// TODO: API 연동 시 교체
		} finally {
			setSaving(false)
		}
	}

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
						닉네임 설정
					</h2>
					<p className="mb-8 text-center text-sm text-gray-500">
						추첨 참여 시 사용될 닉네임을 설정해 주세요
					</p>

					<form onSubmit={onSubmit} className="space-y-6">
						<div>
							<label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
								닉네임
							</label>
							<input
								type="text"
								value={nickname}
								onChange={(e) => setNickname(e.target.value)}
								className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition outline-none focus:border-purple-400 dark:border-gray-800 dark:bg-transparent"
							/>
							<p className="mt-2 text-xs text-gray-500">
								* 추첨 결과 공개 시 닉네임이 표시되므로 개인정보가 포함되지 않도록 주의해 주세요
							</p>
						</div>

						<button
							type="submit"
							disabled={saving}
							className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-purple-500 text-white transition disabled:opacity-60"
						>
							{saving ? '저장중…' : '완료'}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}

'use client'

import Link from 'next/link'
import { ThemeMode, useTheme } from '@/lib/theme-provider'

export function Header() {
	const { theme, setTheme } = useTheme()
	return (
		<header className="w-full border-b border-gray-200 dark:border-gray-800">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
				<Link href="/" className="font-semibold">
					Fair Raffle
				</Link>
				<div className="flex items-center gap-3">
					<select
						aria-label="Theme"
						className="rounded border bg-transparent px-2 py-1 text-sm"
						value={theme}
						onChange={(e) => setTheme(e.target.value as ThemeMode)}
					>
						<option value="light">Light</option>
						<option value="dark">Dark</option>
						<option value="system">System</option>
					</select>
					<Link href="/login" className="text-sm hover:underline">
						로그인
					</Link>
				</div>
			</div>
		</header>
	)
}

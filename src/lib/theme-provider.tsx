'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeContextValue {
	theme: ThemeMode
	setTheme: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
	children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
	const [theme, setTheme] = useState<ThemeMode>('system')

	useEffect(() => {
		const prefersDark =
			window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
		const isDark = theme === 'dark' || (theme === 'system' && prefersDark)
		const root = document.documentElement
		if (isDark) {
			root.classList.add('dark')
		} else {
			root.classList.remove('dark')
		}
	}, [theme])

	useEffect(() => {
		const mql = window.matchMedia('(prefers-color-scheme: dark)')
		const handler = () => {
			// Re-apply when system preferences change
			if (theme === 'system') {
				const prefersDark = mql.matches
				const root = document.documentElement
				if (prefersDark) root.classList.add('dark')
				else root.classList.remove('dark')
			}
		}
		mql.addEventListener('change', handler)
		return () => mql.removeEventListener('change', handler)
	}, [theme])

	const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme }), [theme])
	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
	return ctx
}

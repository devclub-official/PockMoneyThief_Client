'use client'

import * as React from 'react'

type TabsContextValue = {
	value: string
	onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

interface TabsProps {
	defaultValue: string
	value?: string
	onValueChange?: (value: string) => void
	children: React.ReactNode
	className?: string
}

export function Tabs({
	defaultValue,
	value: controlledValue,
	onValueChange,
	children,
	className = '',
}: TabsProps) {
	const [uncontrolledValue, setUncontrolledValue] =
		React.useState(defaultValue)
	const value = controlledValue ?? uncontrolledValue
	const handleValueChange = onValueChange ?? setUncontrolledValue

	return (
		<TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
			<div className={className}>{children}</div>
		</TabsContext.Provider>
	)
}

export function TabsList({
	className = '',
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400 ${className}`}
			{...props}
		/>
	)
}

interface TabsTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string
}

export function TabsTrigger({
	value,
	className = '',
	...props
}: TabsTriggerProps) {
	const context = React.useContext(TabsContext)
	if (!context) throw new Error('TabsTrigger must be used within Tabs')

	const isActive = context.value === value

	return (
		<button
			className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 ${
				isActive
					? 'bg-white text-gray-950 shadow-sm dark:bg-gray-950 dark:text-gray-50'
					: ''
			} ${className}`}
			onClick={() => context.onValueChange(value)}
			{...props}
		/>
	)
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string
}

export function TabsContent({
	value,
	className = '',
	...props
}: TabsContentProps) {
	const context = React.useContext(TabsContext)
	if (!context) throw new Error('TabsContent must be used within Tabs')

	if (context.value !== value) return null

	return (
		<div
			className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 ${className}`}
			{...props}
		/>
	)
}


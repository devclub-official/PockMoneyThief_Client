'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface ToastProps {
	id: string
	title?: string
	description?: string
	variant?: 'default' | 'success' | 'error' | 'warning'
	duration?: number
	onClose?: () => void
}

export function Toast({
	id,
	title,
	description,
	variant = 'default',
	duration = 5000,
	onClose,
}: ToastProps) {
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		if (duration > 0) {
			const timer = setTimeout(() => {
				setIsVisible(false)
				setTimeout(() => onClose?.(), 300) // 애니메이션 완료 후 제거
			}, duration)

			return () => clearTimeout(timer)
		}
	}, [duration, onClose])

	const handleClose = () => {
		setIsVisible(false)
		setTimeout(() => onClose?.(), 300)
	}

	const getIcon = () => {
		switch (variant) {
			case 'success':
				return <CheckCircle className="h-5 w-5 text-green-600" />
			case 'error':
				return <AlertCircle className="h-5 w-5 text-red-600" />
			case 'warning':
				return <AlertCircle className="h-5 w-5 text-yellow-600" />
			default:
				return <Info className="h-5 w-5 text-blue-600" />
		}
	}

	const getVariantStyles = () => {
		switch (variant) {
			case 'success':
				return 'border-green-200 bg-green-50 text-green-800'
			case 'error':
				return 'border-red-200 bg-red-50 text-red-800'
			case 'warning':
				return 'border-yellow-200 bg-yellow-50 text-yellow-800'
			default:
				return 'border-blue-200 bg-blue-50 text-blue-800'
		}
	}

	if (!isVisible) return null

	return (
		<div
			className={cn(
				'fixed top-4 right-4 z-50 max-w-sm rounded-lg border p-4 shadow-lg transition-all duration-300',
				isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
				getVariantStyles(),
			)}
		>
			<div className="flex items-start gap-3">
				{getIcon()}
				<div className="flex-1">
					{title && <p className="font-medium">{title}</p>}
					{description && <p className="text-sm opacity-90">{description}</p>}
				</div>
				<button
					onClick={handleClose}
					className="text-gray-400 transition-colors hover:text-gray-600"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		</div>
	)
}

// 토스트 컨텍스트 및 훅
import { createContext, useContext, useCallback, ReactNode } from 'react'

interface ToastContextType {
	toasts: ToastProps[]
	addToast: (toast: Omit<ToastProps, 'id'>) => void
	removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<ToastProps[]>([])

	const addToast = useCallback((toast: Omit<ToastProps, 'id'>) => {
		const id = Math.random().toString(36).substr(2, 9)
		setToasts((prev) => [...prev, { ...toast, id }])
	}, [])

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id))
	}, [])

	return (
		<ToastContext.Provider value={{ toasts, addToast, removeToast }}>
			{children}
			<div className="fixed top-4 right-4 z-50 space-y-2">
				{toasts.map((toast) => (
					<Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
				))}
			</div>
		</ToastContext.Provider>
	)
}

export function useToast() {
	const context = useContext(ToastContext)
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider')
	}
	return context
}

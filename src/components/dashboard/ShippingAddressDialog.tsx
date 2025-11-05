'use client'

import { Suspense, useMemo, useState } from 'react'
import { CirclePlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { shippingAddressSchema, type ShippingAddressFormData } from '@/lib/schemas'
import { useShippingAddresses } from '@/hooks/useShippingAddresses'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/Dialog'
import { useSubmitShippingInfo } from '@/hooks/useSubmitShippingInfo'
import { ShippingInfoRequest } from '@/types'

interface ShippingAddressDialogProps {
	raffleId: string
	participantId: string
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function ShippingAddressDialog({
	raffleId,
	participantId,
	open,
	onOpenChange,
}: ShippingAddressDialogProps) {
	const [isAdding, setIsAdding] = useState(false)
	const submitShippingInfo = useSubmitShippingInfo()
	const form = useForm<ShippingAddressFormData>({
		resolver: zodResolver(shippingAddressSchema),
		defaultValues: {
			name: '',
			phone: '',
			zipcode: '',
			address1: '',
			address2: '',
		},
	})

	const handleSubmit = form.handleSubmit((data) => {
		// TODO: API 연동하여 배송지 저장 후 invalidate
		console.log('submit address', data)
		submitShippingInfo.mutate({
			raffleId: raffleId,
			participantId: participantId,
			data: data,
		})
		onOpenChange(false)
	})

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				if (!v) setIsAdding(false)
				onOpenChange(v)
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>배송지 관리</DialogTitle>
					<DialogDescription>배송 받을 주소를 선택하거나 새로 등록하세요</DialogDescription>
				</DialogHeader>

				<div className="mb-2 flex items-center justify-between">
					<h3 className="text-base font-medium">배송지 선택</h3>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsAdding(true)}
						aria-label="새 배송지 추가"
					>
						<CirclePlus className="h-4 w-4" />
					</Button>
				</div>

				<div className="h-96 overflow-y-auto pr-1">
					{isAdding ? (
						<form className="space-y-4" onSubmit={handleSubmit}>
							<div className="space-y-2">
								<Label htmlFor="name">수령인</Label>
								<Input
									id="name"
									{...form.register('name')}
									aria-invalid={!!form.formState.errors.name}
									className="border-gray-200 focus:border-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:ring-offset-0"
								/>
								{form.formState.errors.name && (
									<p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">연락처</Label>
								<Input
									id="phone"
									{...form.register('phone')}
									aria-invalid={!!form.formState.errors.phone}
									className="border-gray-200 focus:border-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:ring-offset-0"
								/>
								{form.formState.errors.phone && (
									<p className="mt-1 text-sm text-red-600">{form.formState.errors.phone.message}</p>
								)}
							</div>
							<div className="grid grid-cols-3 gap-2">
								<div className="col-span-1 space-y-2">
									<Label htmlFor="postalCode">우편번호</Label>
									<Input
										id="postalCode"
										{...form.register('zipcode')}
										aria-invalid={!!form.formState.errors.zipcode}
										className="border-gray-200 focus:border-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:ring-offset-0"
									/>
									{form.formState.errors.zipcode && (
										<p className="mt-1 text-sm text-red-600">
											{form.formState.errors.zipcode.message}
										</p>
									)}
								</div>
								<div className="col-span-2 space-y-2">
									<Label htmlFor="address">주소</Label>
									<Input
										id="address"
										{...form.register('address1')}
										aria-invalid={!!form.formState.errors.address1}
										className="border-gray-200 focus:border-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:ring-offset-0"
									/>
									{form.formState.errors.address1 && (
										<p className="mt-1 text-sm text-red-600">
											{form.formState.errors.address1.message}
										</p>
									)}
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="detailAddress">상세 주소</Label>
								<Input
									id="detailAddress"
									{...form.register('address2')}
									aria-invalid={!!form.formState.errors.address2}
									className="border-gray-200 focus:border-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:ring-offset-0"
								/>
								{form.formState.errors.address2 && (
									<p className="mt-1 text-sm text-red-600">
										{form.formState.errors.address2.message}
									</p>
								)}
							</div>
							<div className="flex justify-end gap-2 pt-2">
								<Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>
									취소
								</Button>
								<Button type="submit">저장</Button>
							</div>
						</form>
					) : (
						<Suspense
							fallback={<div className="text-muted-foreground text-sm">주소를 불러오는 중...</div>}
						>
							<AddressList raffleId={raffleId} participantId={participantId} />
						</Suspense>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}

function AddressList({ raffleId, participantId }: { raffleId: string; participantId: string }) {
	const { data: addresses } = useShippingAddresses()
	const submitShippingInfo = useSubmitShippingInfo()
	const handleSubmitShippingInfo = (data: ShippingInfoRequest) => {
		submitShippingInfo.mutate({
			raffleId: raffleId,
			participantId: participantId,
			data: data,
		})
	}
	const hasAddresses = addresses && addresses?.length > 0

	if (!hasAddresses) {
		return (
			<div className="rounded-md border border-dashed p-6 text-center text-sm text-gray-500 dark:text-gray-300">
				등록된 배송지 정보가 없습니다.
			</div>
		)
	}

	return (
		<div className="space-y-2">
			{addresses.map((addr, idx) => (
				<div
					key={idx}
					className="cursor-pointer rounded-md border p-3"
					onClick={() => handleSubmitShippingInfo(addr)}
				>
					<p className="font-medium">{addr.name}</p>
					<p className="text-sm text-gray-600 dark:text-gray-300">{addr.phone}</p>
					<p className="text-sm">
						({addr.zipcode}) {addr.address1} {addr.address2}
					</p>
				</div>
			))}
		</div>
	)
}

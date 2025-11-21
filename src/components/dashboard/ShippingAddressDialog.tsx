'use client'

import { useState } from 'react'
import { CirclePlus, Pencil, Trash2, Star } from 'lucide-react'
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
import { useCreateAddress } from '@/hooks/useCreateAddress'
import { useUpdateAddress } from '@/hooks/useUpdateAddress'
import { useDeleteAddress } from '@/hooks/useDeleteAddress'
import { useSetDefaultAddress } from '@/hooks/useSetDefaultAddress'
import { AddressItem } from '@/types'
import { AsyncBoundary } from '../boundary/AsyncBoundary'

interface ShippingAddressDialogProps {
	raffleId: string
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function ShippingAddressDialog({
	raffleId,
	open,
	onOpenChange,
}: ShippingAddressDialogProps) {
	const [isAdding, setIsAdding] = useState(false)
	const [editingId, setEditingId] = useState<string | null>(null)
	const createAddress = useCreateAddress()
	const updateAddress = useUpdateAddress()
	const form = useForm<ShippingAddressFormData>({
		resolver: zodResolver(shippingAddressSchema),
		defaultValues: {
			label: '',
			name: '',
			phone: '',
			zipcode: '',
			address1: '',
			address2: '',
		},
	})

	const handleSubmit = form.handleSubmit((data) => {
		if (editingId) {
			// 수정 모드
			updateAddress.mutate(
				{
					id: editingId,
					data: data,
				},
				{
					onSuccess: () => {
						setEditingId(null)
						setIsAdding(false)
						form.reset()
					},
				},
			)
		} else {
			// 새 배송지 추가
			createAddress.mutate(
				{
					...data,
					isDefault: false,
				},
				{
					onSuccess: () => {
						setIsAdding(false)
						form.reset()
					},
				},
			)
		}
	})

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				if (!v) {
					setIsAdding(false)
					setEditingId(null)
					form.reset()
				}
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
						onClick={() => {
							setEditingId(null)
							setIsAdding(true)
							form.reset({
								label: '',
								name: '',
								phone: '',
								zipcode: '',
								address1: '',
								address2: '',
							})
						}}
						aria-label="새 배송지 추가"
					>
						<CirclePlus className="h-4 w-4" />
					</Button>
				</div>

				<div className="h-[480px] overflow-y-auto pr-1">
					{isAdding || editingId ? (
						<form className="space-y-4" onSubmit={handleSubmit}>
							<div className="space-y-2">
								<Label htmlFor="label">배송지 이름</Label>
								<Input
									id="label"
									placeholder="예: 집, 회사"
									{...form.register('label')}
									aria-invalid={!!form.formState.errors.label}
									className="border-gray-200 focus:border-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:ring-offset-0"
								/>
								{form.formState.errors.label && (
									<p className="mt-1 text-sm text-red-600">{form.formState.errors.label.message}</p>
								)}
							</div>
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
								<Button
									type="button"
									variant="ghost"
									onClick={() => {
										setIsAdding(false)
										setEditingId(null)
										form.reset()
									}}
								>
									취소
								</Button>
								<Button type="submit">{editingId ? '수정' : '저장'}</Button>
							</div>
						</form>
					) : (
						<AsyncBoundary
							loadingFallback={
								<div className="text-muted-foreground text-sm">주소를 불러오는 중...</div>
							}
						>
							<AddressList
								raffleId={raffleId}
								onEdit={(address) => {
									setEditingId(address.addressId)
									form.reset({
										label: address.label,
										name: address.name,
										phone: address.phone,
										zipcode: address.zipcode,
										address1: address.address1,
										address2: address.address2 || '',
									})
								}}
							/>
						</AsyncBoundary>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}

interface AddressListProps {
	raffleId: string
	onEdit: (address: AddressItem) => void
}

function AddressList({ raffleId, onEdit }: AddressListProps) {
	const { data: addresses } = useShippingAddresses()
	const submitShippingInfo = useSubmitShippingInfo()
	const deleteAddress = useDeleteAddress()
	const setDefaultAddress = useSetDefaultAddress()
	const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
	const [setDefaultConfirmId, setSetDefaultConfirmId] = useState<string | null>(null)
	const [selectConfirmAddress, setSelectConfirmAddress] = useState<AddressItem | null>(null)

	const handleConfirmSelect = () => {
		if (selectConfirmAddress) {
			submitShippingInfo.mutate({
				raffleId: raffleId,
				addressId: selectConfirmAddress.addressId,
			})
			setSelectConfirmAddress(null)
		}
	}

	const handleDelete = (id: string) => {
		deleteAddress.mutate(id, {
			onSuccess: () => {
				setDeleteConfirmId(null)
			},
		})
	}

	const handleSetDefault = (id: string) => {
		setDefaultAddress.mutate(id, {
			onSuccess: () => {
				setSetDefaultConfirmId(null)
			},
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
		<>
			<div className="space-y-2">
				{addresses.map((addr) => (
					<div
						key={addr.addressId}
						className="relative cursor-pointer rounded-md border p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
						onClick={() => setSelectConfirmAddress(addr)}
					>
						<div className="mb-2 flex items-start justify-between">
							<div className="flex items-center gap-2">
								<p className="font-medium">{addr.label}</p>
								{addr.isDefault && (
									<span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
										기본
									</span>
								)}
							</div>
							<div className="flex gap-1">
								{!addr.isDefault && (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-9 w-9 p-0 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-950"
										onClick={(e) => {
											e.stopPropagation()
											setSetDefaultConfirmId(addr.addressId)
										}}
										aria-label="기본 배송지로 설정"
									>
										<Star className="h-5 w-5" />
									</Button>
								)}
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-9 w-9 p-0"
									onClick={(e) => {
										e.stopPropagation()
										onEdit(addr)
									}}
									aria-label="배송지 수정"
								>
									<Pencil className="h-5 w-5" />
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-9 w-9 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950"
									onClick={(e) => {
										e.stopPropagation()
										setDeleteConfirmId(addr.addressId)
									}}
									aria-label="배송지 삭제"
								>
									<Trash2 className="h-5 w-5" />
								</Button>
							</div>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-300">{addr.phone}</p>
						<p className="text-sm">
							({addr.zipcode}) {addr.address1} {addr.address2}
						</p>
					</div>
				))}
			</div>

			{/* 배송지 선택 확인 다이얼로그 */}
			<Dialog open={!!selectConfirmAddress} onOpenChange={() => setSelectConfirmAddress(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>배송지 선택</DialogTitle>
						<DialogDescription>이 배송지로 당첨 상품을 받으시겠습니까?</DialogDescription>
					</DialogHeader>
					{selectConfirmAddress && (
						<div className="rounded-md border bg-gray-50 p-4 dark:bg-gray-800">
							<p className="mb-2 font-medium">{selectConfirmAddress.label}</p>
							<p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
								{selectConfirmAddress.phone}
							</p>
							<p className="text-sm">
								({selectConfirmAddress.zipcode}) {selectConfirmAddress.address1}{' '}
								{selectConfirmAddress.address2}
							</p>
						</div>
					)}
					<div className="flex justify-end gap-2">
						<Button variant="ghost" onClick={() => setSelectConfirmAddress(null)}>
							취소
						</Button>
						<Button onClick={handleConfirmSelect}>확인</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* 삭제 확인 다이얼로그 */}
			<Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>배송지 삭제</DialogTitle>
						<DialogDescription>이 배송지를 삭제하시겠습니까?</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end gap-2">
						<Button variant="ghost" onClick={() => setDeleteConfirmId(null)}>
							취소
						</Button>
						<Button
							variant="destructive"
							onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
						>
							삭제
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* 기본 배송지 설정 확인 다이얼로그 */}
			<Dialog open={!!setDefaultConfirmId} onOpenChange={() => setSetDefaultConfirmId(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>기본 배송지 설정</DialogTitle>
						<DialogDescription>이 배송지를 기본 배송지로 설정하시겠습니까?</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end gap-2">
						<Button variant="ghost" onClick={() => setSetDefaultConfirmId(null)}>
							취소
						</Button>
						<Button onClick={() => setDefaultConfirmId && handleSetDefault(setDefaultConfirmId)}>
							확인
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

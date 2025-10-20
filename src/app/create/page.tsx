'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Plus, X, Gift, Users } from 'lucide-react'
import { createRaffleSchema, type CreateRaffleFormData } from '@/lib/schemas'
import { useCreateRaffle } from '@/hooks/useCreateRaffle'
import { useToast } from '@/components/ui/Toast'

export default function CreatePage() {
	const router = useRouter()
	const createRaffle = useCreateRaffle()
	const [duration, setDuration] = useState(24)
	const { addToast } = useToast()

	const { register, handleSubmit, control } = useForm<CreateRaffleFormData>({
		resolver: zodResolver(createRaffleSchema),
		defaultValues: {
			title: '',
			description: '',
			entryFee: 0,
			minParticipants: 1,
			maxParticipants: 10,
			imageUrl: '',
			tiers: [{ rank: 1, name: '', quantity: 1, imageUrl: '' }],
		},
	})

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'tiers',
	})

	const onSubmit = (data: CreateRaffleFormData) => {
		// deadlineAt 계산
		const deadlineAt = new Date(
			new Date().getTime() + Number(duration) * 60 * 60 * 1000,
		).toISOString()

		// imageUrl이 비어있으면 기본 이미지
		const imageUrl =
			data.imageUrl ||
			'https://images.unsplash.com/photo-1615592389070-bcc97e05ad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'

		// tiers의 rank 재정렬 및 빈 imageUrl 제거
		const tiers = data.tiers.map((tier, index) => ({
			rank: index + 1,
			name: tier.name,
			quantity: tier.quantity,
			...(tier.imageUrl ? { imageUrl: tier.imageUrl } : {}),
		}))

		createRaffle.mutate(
			{
				...data,
				deadlineAt,
				imageUrl,
				tiers,
			},
			{
				onSuccess: () => {
					addToast({
						title: '등록 완료',
						description: '성공적으로 등록되었습니다',
						variant: 'success',
						duration: 3000,
					})
					router.push('/')
				},
				onError: () => {
					addToast({
						title: '등록 실패',
						description: '추첨 등록에 실패했습니다. 다시 시도해주세요.',
						variant: 'error',
						duration: 4000,
					})
				},
			},
		)
	}

	const onInvalid = (errors: Record<string, { message?: string }>) => {
		// 첫 번째 에러를 토스트로 표시
		const firstError = Object.values(errors)[0] as { message?: string }
		if (firstError?.message) {
			addToast({
				title: '입력 오류',
				description: firstError.message,
				variant: 'error',
				duration: 4000,
			})
		}
	}

	return (
		<div className="mx-auto max-w-3xl space-y-6">
			<div>
				<h1 className="text-foreground text-2xl font-semibold">추첨 등록</h1>
				<p className="text-muted-foreground">
					새로운 가챠 추첨을 등록하여 다른 사용자들과 함께 즐겨보세요
				</p>
			</div>

			{createRaffle.isError && (
				<div className="bg-destructive/10 border-destructive/20 text-destructive rounded-lg border px-4 py-3">
					추첨 등록에 실패했습니다. 다시 시도해주세요.
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
				{/* 기본 정보 */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Gift className="h-5 w-5" />
							기본 정보
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label htmlFor="title">추첨명 *</Label>
							<Input id="title" {...register('title')} placeholder="예: 피카츄 넨도로이드 #1355" />
						</div>

						<div>
							<Label htmlFor="description">추첨 설명 *</Label>
							<Textarea
								id="description"
								{...register('description')}
								placeholder="추첨에 대한 자세한 설명을 입력해주세요"
								rows={3}
							/>
						</div>

						<div>
							<Label htmlFor="imageUrl">이미지 URL</Label>
							<Input
								id="imageUrl"
								{...register('imageUrl')}
								placeholder="https://example.com/image.jpg"
							/>
							<p className="text-muted-foreground mt-1 text-xs">
								미입력 시 기본 이미지가 사용됩니다
							</p>
						</div>
					</CardContent>
				</Card>

				{/* 참여 정보 */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5" />
							참여 정보
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label htmlFor="entryFee">참여비 (원) *</Label>
							<Input
								id="entryFee"
								type="number"
								{...register('entryFee', { valueAsNumber: true })}
								placeholder="5000"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="minParticipants">최소 참여자 *</Label>
								<Input
									id="minParticipants"
									type="number"
									{...register('minParticipants', { valueAsNumber: true })}
									placeholder="3"
								/>
							</div>
							<div>
								<Label htmlFor="maxParticipants">최대 참여자 *</Label>
								<Input
									id="maxParticipants"
									type="number"
									{...register('maxParticipants', { valueAsNumber: true })}
									placeholder="10"
								/>
							</div>
						</div>

						<div>
							<Label htmlFor="duration">진행 시간 (시간) *</Label>
							<Input
								id="duration"
								type="number"
								value={duration}
								onChange={(e) => setDuration(Number(e.target.value))}
								placeholder="24"
								min={1}
							/>
							<p className="text-muted-foreground mt-1 text-xs">{duration}시간 후 자동 마감</p>
						</div>
					</CardContent>
				</Card>

				{/* 경품 정보 */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span className="flex items-center gap-2">
								<Gift className="h-5 w-5" />
								경품 목록
							</span>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => append({ rank: fields.length + 1, name: '', quantity: 1 })}
							>
								<Plus className="mr-1 h-4 w-4" />
								경품 추가
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{fields.map((field, index) => (
							<div key={field.id} className="bg-muted/50 flex items-start gap-4 rounded-lg p-4">
								<div className="flex-1 space-y-3">
									<div>
										<Label>순위 {index + 1}</Label>
									</div>
									<div>
										<Label htmlFor={`tier-name-${index}`}>경품명 *</Label>
										<Input
											id={`tier-name-${index}`}
											{...register(`tiers.${index}.name`)}
											placeholder="예: 리자몽 피규어"
										/>
									</div>
									<div>
										<Label htmlFor={`tier-quantity-${index}`}>수량 *</Label>
										<Input
											id={`tier-quantity-${index}`}
											type="number"
											{...register(`tiers.${index}.quantity`, {
												valueAsNumber: true,
											})}
											min={1}
										/>
									</div>
									<div>
										<Label htmlFor={`tier-image-${index}`}>이미지 URL</Label>
										<Input
											id={`tier-image-${index}`}
											type="url"
											{...register(`tiers.${index}.imageUrl`)}
											placeholder="https://..."
										/>
									</div>
								</div>
								{fields.length > 1 && (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => remove(index)}
										className="mt-8"
									>
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>
						))}
					</CardContent>
				</Card>

				{/* 제출 버튼 */}
				<div className="flex gap-4">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.push('/')}
						className="flex-1"
						disabled={createRaffle.isPending}
					>
						취소
					</Button>
					<Button type="submit" disabled={createRaffle.isPending} className="flex-1">
						{createRaffle.isPending ? '등록 중...' : '추첨 등록하기'}
					</Button>
				</div>
			</form>
		</div>
	)
}

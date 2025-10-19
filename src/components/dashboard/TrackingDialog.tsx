import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import type { Winner } from '@/types/dashboard'
import { DIALOG_MESSAGES, ACCESSIBILITY_LABELS } from '@/lib/constants/dashboard'

// 동적 import로 Dialog 컴포넌트 지연 로딩
const Dialog = dynamic(
	() => import('@/components/ui/Dialog').then((mod) => ({ default: mod.Dialog })),
	{ ssr: false },
)
const DialogContent = dynamic(
	() => import('@/components/ui/Dialog').then((mod) => ({ default: mod.DialogContent })),
	{ ssr: false },
)
const DialogDescription = dynamic(
	() => import('@/components/ui/Dialog').then((mod) => ({ default: mod.DialogDescription })),
	{ ssr: false },
)
const DialogHeader = dynamic(
	() => import('@/components/ui/Dialog').then((mod) => ({ default: mod.DialogHeader })),
	{ ssr: false },
)
const DialogTitle = dynamic(
	() => import('@/components/ui/Dialog').then((mod) => ({ default: mod.DialogTitle })),
	{ ssr: false },
)

interface TrackingDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	selectedWinner: Winner | null
	trackingNumber: string
	setTrackingNumber: (value: string) => void
	carrier: string
	setCarrier: (value: string) => void
	onSubmit: () => void
}

export function TrackingDialog({
	open,
	onOpenChange,
	selectedWinner,
	trackingNumber,
	setTrackingNumber,
	carrier,
	setCarrier,
	onSubmit,
}: TrackingDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{DIALOG_MESSAGES.TRACKING_TITLE}</DialogTitle>
					<DialogDescription>{DIALOG_MESSAGES.TRACKING_DESCRIPTION}</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					{selectedWinner && (
						<div className="bg-muted rounded-lg p-3">
							<h4 className="mb-1 font-medium">{selectedWinner.displayName}</h4>
							<p className="text-muted-foreground text-sm">{selectedWinner.itemName}</p>
						</div>
					)}

					<div>
						<Label htmlFor="carrier" aria-label={ACCESSIBILITY_LABELS.CARRIER}>
							택배사
						</Label>
						<Input
							id="carrier"
							value={carrier}
							onChange={(e) => setCarrier(e.target.value)}
							placeholder={DIALOG_MESSAGES.CARRIER_PLACEHOLDER}
							aria-describedby="carrier-help"
						/>
					</div>

					<div>
						<Label htmlFor="trackingNumber" aria-label={ACCESSIBILITY_LABELS.TRACKING_NUMBER}>
							송장번호
						</Label>
						<Input
							id="trackingNumber"
							value={trackingNumber}
							onChange={(e) => setTrackingNumber(e.target.value)}
							placeholder={DIALOG_MESSAGES.TRACKING_PLACEHOLDER}
							aria-describedby="tracking-help"
						/>
					</div>

					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => {
								onOpenChange(false)
								setTrackingNumber('')
								setCarrier('')
							}}
							className="flex-1"
						>
							취소
						</Button>
						<Button onClick={onSubmit} className="flex-1">
							등록
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

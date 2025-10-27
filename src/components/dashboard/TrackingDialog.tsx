import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/Dialog'
import type { Winner } from '@/types/dashboard'

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
					<DialogTitle>송장번호 입력</DialogTitle>
					<DialogDescription>당첨자에게 발송한 택배의 송장번호를 입력해주세요</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					{selectedWinner && (
						<div className="bg-muted rounded-lg p-3">
							<h4 className="mb-1 font-medium">{selectedWinner.displayName}</h4>
							<p className="text-muted-foreground text-sm">{selectedWinner.itemName}</p>
						</div>
					)}

					<div>
						<Label htmlFor="carrier" aria-label="택배사">
							택배사
						</Label>
						<Input
							id="carrier"
							value={carrier}
							onChange={(e) => setCarrier(e.target.value)}
							placeholder="예: CJ대한통운"
							aria-describedby="carrier-help"
						/>
					</div>

					<div>
						<Label htmlFor="trackingNumber" aria-label="송장번호">
							송장번호
						</Label>
						<Input
							id="trackingNumber"
							value={trackingNumber}
							onChange={(e) => setTrackingNumber(e.target.value)}
							placeholder="예: 123456789012"
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

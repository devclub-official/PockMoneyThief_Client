import { Button } from '@/components/ui/Button'
import type { EmptyStateProps } from '@/types/common'

export function EmptyState({
	icon: Icon,
	title,
	description,
	buttonText,
	onButtonClick,
	ariaLabel,
}: EmptyStateProps) {
	return (
		<div className="py-12 text-center" aria-label={ariaLabel}>
			<div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
				<Icon className="text-muted-foreground h-8 w-8" />
			</div>
			<h3 className="mb-2 text-lg font-semibold">{title}</h3>
			<p className="text-muted-foreground mb-6">{description}</p>
			{buttonText && onButtonClick && <Button onClick={onButtonClick}>{buttonText}</Button>}
		</div>
	)
}

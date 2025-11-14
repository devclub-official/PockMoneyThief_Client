import { RaffleDetailClient } from './RaffleDetailClient'

interface RaffleDetailPageProps {
	params: Promise<{ id: string }>
}

export default async function RaffleDetailPage({ params }: RaffleDetailPageProps) {
	const { id } = await params

	return <RaffleDetailClient id={id} />
}

import { RaffleDetailClient } from './RaffleDetailClient'

interface RaffleDetailPageProps {
	params: { id: string }
}

export default async function RaffleDetailPage({ params }: RaffleDetailPageProps) {
	const { id } = params

	return <RaffleDetailClient id={id} />
}

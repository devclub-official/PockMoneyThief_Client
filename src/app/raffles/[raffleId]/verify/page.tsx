import RaffleVerify from '@/components/raffles/RaffleVerify'

export default function VerifyPage() {
	// TODO: 실제 데이터 연동 (API) 이후 서버에서 주입
	const participants = [
		'PokeExpert',
		'FigureCollector',
		'GachaKing',
		'AnimeFan123',
		'ToysRUs',
		'Collector99',
		'PikaPika',
	]
	const winnerIndex = 2
	return (
		<RaffleVerify
			participants={participants}
			externalSeedLabel="2025-09-27 삼성전자 주가 마지막 자릿수"
			externalSeedValue="7"
			verifiedMasterSeed="1234567"
			winnerIndex={winnerIndex}
		/>
	)
}

'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { useFadeMount } from '@/hooks/useFadeMount'

interface RaffleResultContainerProps {
	title: string
	description: string
	organizer: string
	closedAt: string
	imageUrl: string
	raffleResultVideoSrc?: string
	raffleId: string
}

// Presentational components
function IntroCard({ visible, onOpen }: { visible: boolean; onOpen: () => void }) {
	return (
		<div
			className={`mt-8 rounded-xl border border-gray-200 bg-white/60 p-8 text-center shadow-sm backdrop-blur-sm transition-opacity duration-500 ${
				visible ? 'opacity-100' : 'opacity-0'
			}`}
		>
			<div className="text-base font-semibold">추첨 결과 확인</div>
			<p className="mt-2 text-sm text-gray-500">투명하고 공정한 추첨 결과를 확인해보세요</p>
			<button
				onClick={onOpen}
				className="mx-auto mt-6 inline-flex min-w-40 items-center justify-center rounded-md bg-indigo-500 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 active:bg-indigo-700"
			>
				결과 확인하기
			</button>
		</div>
	)
}

function Overlay({
	visible,
	onClose,
	video,
}: {
	visible: boolean
	onClose: (showResult: boolean) => void
	video?: string
}) {
	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
			onClick={() => onClose(false)}
		>
			<div
				className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-black shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				{video ? (
					<video
						key={video}
						src={video}
						autoPlay
						playsInline
						muted
						onEnded={() => onClose(true)}
						className="h-auto w-full"
					/>
				) : (
					<div className="flex aspect-video w-full items-center justify-center bg-gradient-to-b from-indigo-900/60 to-indigo-700/60 p-10">
						<div className="flex flex-col items-center">
							<Image
								src="/gacha.svg"
								alt="gacha"
								width={96}
								height={96}
								className="animate-bounce"
							/>
							<p className="mt-4 text-sm text-white/80">추첨 준비 중...</p>
						</div>
					</div>
				)}
				<button
					className="absolute top-2 right-2 rounded-md bg-black/50 px-2 py-1 text-xs text-white hover:bg-black/70"
					onClick={() => onClose(false)}
				>
					닫기
				</button>
			</div>
		</div>
	)
}

function ResultSection({
	title,
	winnerName,
	participants,
	winnerIndex,
}: {
	title: string
	winnerName: string
	participants: string[]
	winnerIndex: number
}) {
	return (
		<div className="mt-10 translate-y-0 transform rounded-xl border border-gray-200 bg-white/80 p-6 opacity-100 shadow-sm backdrop-blur-sm transition-all duration-700 ease-out">
			<div className="mb-4 flex items-center gap-2 text-lg font-semibold">
				<span>🏆</span>
				<span>당첨자 발표</span>
			</div>
			<div className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50/60 p-4">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
						🏅
					</div>
					<div>
						<div className="text-sm font-semibold">{winnerName}</div>
						<div className="text-xs text-gray-500">{title}</div>
					</div>
				</div>
				<div className="text-xs text-emerald-600">배송정보 완료</div>
			</div>

			<div className="mt-6">
				<div className="text-base font-semibold">추첨 검증 정보</div>
				<p className="mt-1 text-sm text-gray-500">투명하고 공정한 추첨을 위한 검증 데이터입니다</p>
				<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
					<div className="rounded-md bg-gray-50 px-4 py-3 text-sm">
						2025-09-27 삼성전자 주가 마지막 자릿수
					</div>
					<div className="rounded-md bg-gray-50 px-4 py-3 text-sm">실제 시드 값: 7</div>
				</div>
			</div>

			<div className="mt-6">
				<div className="text-base font-semibold">참여자 목록 ({participants.length}명)</div>
				<div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
					{participants.map((name, idx) => (
						<div
							key={name}
							className={`rounded-md px-3 py-2 text-sm ${idx === winnerIndex ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-gray-50'}`}
						>
							{idx + 1}. {name}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export function RaffleResult({
	title,
	description,
	organizer,
	closedAt,
	imageUrl,
	raffleResultVideoSrc,
	raffleId,
}: RaffleResultContainerProps) {
	const router = useRouter()
	const intro = useFadeMount({ initialVisible: true })
	const overlay = useFadeMount()
	const result = useFadeMount({ durationMs: 700 })

	/**
	 * TODO: API Spec 작성된 이후 '참여자 목록, 당첨자 정보(인덱스, 이름)' 외부에서 주입하도록 수정
	 */
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
	const winnerName = participants[winnerIndex]

	useBodyScrollLock(overlay.mounted)

	function handleOpenGachaResultOverlay() {
		overlay.show()
	}

	function handleCloseGachaResultOverlay(showWinnerAndVerifyInfoSection: boolean) {
		overlay.hide(() => {
			if (showWinnerAndVerifyInfoSection) {
				intro.hide()
				result.show()
			}
		})
	}

	return (
		<>
			<div className="rounded-xl border border-gray-200 bg-white/60 p-4 shadow-sm backdrop-blur-sm">
				<div className="flex items-center gap-4">
					<div className="h-16 w-16 overflow-hidden rounded-md bg-gray-100">
						<Image
							src={imageUrl}
							alt="raffle"
							width={64}
							height={64}
							className="h-full w-full object-cover"
						/>
					</div>
					<div className="min-w-0 flex-1">
						<div className="truncate text-sm font-semibold">{title}</div>
						<div className="mt-1 truncate text-sm text-gray-600">{description}</div>
						<div className="mt-1 text-xs text-gray-400">
							등록자: {organizer} <span className="mx-2">·</span> 완료시간: {closedAt}
						</div>
					</div>
				</div>
			</div>

			{intro.mounted && <IntroCard visible={intro.visible} onOpen={handleOpenGachaResultOverlay} />}

			{overlay.mounted && (
				<Overlay
					visible={overlay.visible}
					onClose={handleCloseGachaResultOverlay}
					video={raffleResultVideoSrc}
				/>
			)}

			{result.mounted && (
				<div
					className={`transition-all duration-700 ease-out ${
						result.visible
							? 'translate-y-0 opacity-100'
							: 'pointer-events-none -translate-y-3 opacity-0'
					}`}
				>
					<ResultSection
						title={title}
						winnerName={winnerName}
						participants={participants}
						winnerIndex={winnerIndex}
					/>
					<button
						onClick={() => router.push(`/raffles/${raffleId}/verify`)}
						className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 active:bg-indigo-800"
					>
						<span>🔍</span>
						<span>직접 검증하기</span>
					</button>
				</div>
			)}
		</>
	)
}

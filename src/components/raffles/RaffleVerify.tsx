'use client'

import { useCallback, useMemo, useRef, useState } from 'react'

// UI 색상 토큰: 한 곳에서 색을 관리하면 테마 변경이 쉬워집니다
const BRAND = {
	primary: '#7C4DFF',
	primaryHover: '#6B3BFF',
	primaryActive: '#5A2EFF',
	successBorder: 'border-emerald-200',
	successBg: 'bg-emerald-50/80',
	successText: 'text-emerald-700',
	failureBorder: 'border-rose-200',
	failureBg: 'bg-rose-50/80',
	failureText: 'text-rose-700',
}

const SIMULATION_STEP_MS = 600
const STEP_LABELS = [
	'검증 시작',
	'참여자 목록과 외부 시드 확인',
	'Master Seed 생성',
	'난수 생성 및 당첨자 선정',
	'결과 확인',
]

// 순수 검증 알고리즘: 동일 입력이면 언제나 동일한 결과를 반환합니다
function verifyLottery(participants: string[], externalSeed: string) {
	const combined = participants.join('|') + '|' + externalSeed
	let hash = 0
	for (let i = 0; i < combined.length; i++) {
		hash = (hash * 31 + combined.charCodeAt(i)) >>> 0
	}
	let seed = hash
	function nextRandom() {
		seed = (seed * 1103515245 + 12345) & 0x7fffffff
		return seed / 0x7fffffff
	}
	const winnerIndex = Math.floor(nextRandom() * participants.length)
	return { masterSeed: String(hash), winnerIndex }
}

interface RaffleVerifyProps {
	participants: string[]
	externalSeedLabel: string
	externalSeedValue: string
	verifiedMasterSeed: string
	winnerIndex: number
}

// 공통 섹션 래퍼: 타이틀과 카드 스타일을 통일합니다
function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div className="mt-6">
			<div className="text-base font-semibold">{title}</div>
			<div className="mt-3 rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
				{children}
			</div>
		</div>
	)
}

// 실행 버튼: 풀폭 + 브랜드 컬러, 접근성 속성 포함
function VerifyButton({
	label,
	disabled,
	onClick,
}: {
	label: string
	disabled?: boolean
	onClick: () => void
}) {
	return (
		<button
			className={`mt-4 inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white ${
				disabled
					? `cursor-not-allowed bg-[${BRAND.primary}]/70`
					: `bg-[${BRAND.primary}] hover:bg-[${BRAND.primaryHover}] active:bg-[${BRAND.primaryActive}]`
			}`}
			onClick={onClick}
			disabled={disabled}
			aria-disabled={disabled}
		>
			{label}
		</button>
	)
}

// 단계 진행 표시: 현재 단계 이하를 보라색 점으로 채웁니다
function ProgressSteps({ currentStep }: { currentStep: number }) {
	return (
		<div className="mt-4 space-y-2">
			{STEP_LABELS.map((label, idx) => {
				const stepNumber = idx + 1
				const isActive = currentStep >= stepNumber
				return (
					<div
						key={label}
						className={`flex items-center gap-2 text-sm ${isActive ? 'text-[#6B3BFF]' : ''}`}
					>
						<span className={`h-2 w-2 rounded-full ${isActive ? 'bg-[#7C4DFF]' : 'bg-gray-300'}`} />
						{stepNumber}단계: {label}
					</div>
				)
			})}
		</div>
	)
}

// 결과 배너: 성공/실패에 따라 색상 세트를 바꿔서 표시합니다
function ResultBanner({
	status,
	computedSeed,
	computedWinner,
	officialSeed,
	officialWinnerName,
	participants,
}: {
	status: 'success' | 'failure'
	computedSeed: string
	computedWinner: number | null
	officialSeed: string
	officialWinnerName: string
	participants: string[]
}) {
	const colorSet =
		status === 'success'
			? `${BRAND.successBorder} ${BRAND.successBg} ${BRAND.successText}`
			: `${BRAND.failureBorder} ${BRAND.failureBg} ${BRAND.failureText}`
	return (
		<div className={`rounded-xl p-4 text-sm ${colorSet.replaceAll(' ', ' ')}`}>
			<div className="font-semibold">{status === 'success' ? '검증 성공!' : '검증 실패'}</div>
			<div className="mt-1">
				{status === 'success'
					? '추첨 결과가 알고리즘에 의해 정확히 계산되었습니다.'
					: '계산된 결과가 공식 결과와 일치하지 않습니다.'}
			</div>
			<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
				<div className="rounded-md bg-white px-4 py-3">
					계산된 Master Seed: <span className="font-mono">{computedSeed}</span>
				</div>
				<div className="rounded-md bg-white px-4 py-3">
					계산된 당첨자: {computedWinner !== null ? participants[computedWinner] : '-'}
				</div>
				<div className="rounded-md bg-white px-4 py-3">
					공식 Master Seed: <span className="font-mono">{officialSeed}</span>
				</div>
				<div className="rounded-md bg-white px-4 py-3">공식 당첨자: {officialWinnerName}</div>
			</div>
		</div>
	)
}

export default function RaffleVerify({
	participants,
	externalSeedLabel,
	externalSeedValue,
	verifiedMasterSeed,
	winnerIndex,
}: RaffleVerifyProps) {
	// 시뮬레이션/결과를 위한 상태값
	const [isRunning, setIsRunning] = useState(false)
	const [progressStep, setProgressStep] = useState(0) // 0~5
	const [showSteps, setShowSteps] = useState(false)
	const [status, setStatus] = useState<'idle' | 'success' | 'failure'>('idle')
	const [computedSeed, setComputedSeed] = useState('')
	const [computedWinner, setComputedWinner] = useState<number | null>(null)
	const runIdRef = useRef(0) // 동시 클릭 시 이전 실행을 무효화하기 위한 run id

	const officialWinnerName = useMemo(() => participants[winnerIndex], [participants, winnerIndex])

	// 시뮬레이션 실행: 단계 표시 -> 알고리즘 계산 -> 성공/실패 결정
	const runSimulation = useCallback(async () => {
		if (isRunning) return
		setShowSteps(true)
		setStatus('idle')
		setProgressStep(0)
		setIsRunning(true)
		runIdRef.current += 1
		const myRun = runIdRef.current
		for (let step = 1; step <= 5; step++) {
			if (myRun !== runIdRef.current) return // canceled by another run
			setProgressStep(step)

			await new Promise((r) => setTimeout(r, SIMULATION_STEP_MS)) // 단계별 대기 시간
		}
		if (myRun !== runIdRef.current) return
		const { masterSeed, winnerIndex: calcIdx } = verifyLottery(participants, externalSeedValue)
		setComputedSeed(masterSeed)
		setComputedWinner(calcIdx)
		// 공식 결과와 비교하여 성공/실패 판단
		const isSuccess = masterSeed === verifiedMasterSeed && calcIdx === winnerIndex
		setStatus(isSuccess ? 'success' : 'failure')
		setIsRunning(false)
	}, [externalSeedValue, isRunning, participants, verifiedMasterSeed, winnerIndex])

	return (
		<div className="space-y-6">
			<div className="rounded-xl border border-gray-200 bg-white/60 p-6 shadow-sm backdrop-blur-sm">
				<div className="text-lg font-semibold">검증 개요</div>
				<p className="mt-1 text-sm text-gray-500">
					투명하고 공정한 추첨을 위해 모든 과정을 공개합니다
				</p>

				<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
					<div className="rounded-md bg-gray-50 px-4 py-3 text-sm">{externalSeedLabel}</div>
					<div className="rounded-md bg-gray-50 px-4 py-3 text-sm">
						실제 시드 값: {externalSeedValue}
					</div>
				</div>

				<div className="mt-6">
					<div className="text-base font-semibold">참여자 목록 ({participants.length}명)</div>
					<div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
						{participants.map((name, idx) => (
							<div
								key={name}
								className={`rounded-md px-3 py-2 text-sm ${
									idx === winnerIndex ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-gray-50'
								}`}
							>
								{idx}. {name}
							</div>
						))}
					</div>
				</div>

				<div className="mt-6">
					<div className="text-base font-semibold">공식 결과</div>
					<div className="mt-2 rounded-md bg-indigo-50/70 px-4 py-3 text-sm">
						<span className="mr-2 rounded bg-indigo-600 px-2 py-0.5 text-xs text-white">
							당첨자 1
						</span>
						인덱스 {winnerIndex}
					</div>
				</div>
			</div>

			<Section title="검증 알고리즘">
				<div className="rounded-lg bg-black p-4 font-mono text-[13px] leading-relaxed text-[#00FF88]">
					{/* 실제 코드 블록은 간결히 표현 */}
					<pre className="break-words whitespace-pre-wrap">{`
          // 가차추첨 검증 알고리즘
          function verifyLottery(participants, externalSeed) {
            // 1) 결합 문자열
            const combined = participants.join('|') + '|' + externalSeed
            // 2) 간단한 해시(시演용)
            let h = 0; for (let i = 0; i < combined.length; i++) h = (h * 31 + combined.charCodeAt(i)) >>> 0
            // 3) LCG 난수
            let s = h; function rnd(){ s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
            // 4) 단일 당첨자
            const idx = Math.floor(rnd() * participants.length)
            return { masterSeed: String(h), winnerIndex: idx }
          }`}</pre>
				</div>
			</Section>

			<Section title="브라우저에서 직접 검증">
				<ol className="list-decimal space-y-1 pl-5 text-sm text-gray-600">
					<li>브라우저에서 F12 키를 눌러 개발자 도구를 엽니다</li>
					<li>Console 탭을 클릭합니다</li>
					<li>위의 검증 코드를 복사하여 콘솔에 붙여넣기 합니다</li>
					<li>Enter 키를 눌러 코드를 실행합니다</li>
					<li>결과가 공식 결과와 일치하는지 확인합니다</li>
				</ol>

				<VerifyButton
					label={isRunning ? '검증 실행 중…' : '검증 실행 (시뮬레이션)'}
					disabled={isRunning}
					onClick={runSimulation}
				/>

				{showSteps && <ProgressSteps currentStep={progressStep} />}
			</Section>

			{status !== 'idle' && (
				<ResultBanner
					status={status}
					computedSeed={computedSeed}
					computedWinner={computedWinner}
					officialSeed={verifiedMasterSeed}
					officialWinnerName={officialWinnerName}
					participants={participants}
				/>
			)}

			<Section title="검증의 중요성">
				<ul className="space-y-2 text-sm text-gray-600">
					<li>
						<span className="font-semibold">투명성</span>: 모든 추첨 과정과 알고리즘이 공개되어
						누구나 검증할 수 있습니다
					</li>
					<li>
						<span className="font-semibold">공정성</span>: 외부 시드를 사용하여 조작이 불가능한
						진정한 랜덤 추첨을 보장합니다
					</li>
					<li>
						<span className="font-semibold">재현성</span>: 동일한 입력으로 언제든지 같은 결과를 얻을
						수 있습니다
					</li>
					<li>
						<span className="font-semibold">신뢰성</span>: 오픈 소스 알고리즘을 사용하여 신뢰할 수
						있는 추첨을 제공합니다
					</li>
				</ul>
			</Section>
		</div>
	)
}

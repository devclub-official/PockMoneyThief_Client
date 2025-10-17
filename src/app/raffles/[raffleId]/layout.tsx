import { raffleApi } from '@/lib/api'
import React from 'react'

interface LayoutProps extends React.PropsWithChildren {
	params: Promise<{ raffleId: string }>
}

export default async function layout({ children, params }: LayoutProps) {
	const { raffleId } = await params
	// const raffle = await raffleApi.getById(raffleId)
	const title = '피카츄 넌드로이드'

	return (
		<div className="mx-auto max-w-4xl px-4 py-10">
			<h1 className="mb-6 text-2xl font-semibold">추첨 결과</h1>
			<p className="mb-6 text-sm text-gray-500">{title}의 추첨이 완료되었습니다</p>

			{children}
		</div>
	)
}

// 시간 포맷팅
export function formatTimeLeft(endTime: Date): string {
	const timeLeft = endTime.getTime() - Date.now()
	if (timeLeft <= 0) return '종료됨'

	const hours = Math.floor(timeLeft / (1000 * 60 * 60))
	const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

	if (hours > 0) return `${hours}시간 ${minutes}분`
	return `${minutes}분`
}

// 가격 포맷팅
export function formatPrice(price: number): string {
	return new Intl.NumberFormat('ko-KR').format(price)
}


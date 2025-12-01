/**
 * URL에서 호스트명 추출
 */
function extractHostname(url: string): string | null {
	try {
		const urlObj = new URL(url)
		return urlObj.hostname
	} catch {
		return null
	}
}

/**
 * 이미지 URL이 허용된 호스트인지 검증
 * 보안: S3 도메인만 허용 (이미지 업로드만 사용)
 */
export function isAllowedImageUrl(url: string): boolean {
	if (!url || !url.trim()) {
		return false
	}

	const hostname = extractHostname(url)
	if (!hostname) {
		return false
	}

	// S3 버킷 패턴 체크 (*.s3.*.amazonaws.com 또는 *.s3.amazonaws.com)
	return (
		(hostname.includes('.s3.') && hostname.includes('.amazonaws.com')) ||
		hostname.endsWith('.s3.amazonaws.com')
	)
}

/**
 * 이미지 URL 검증 및 에러 메시지 반환
 */
export function validateImageUrl(url: string): { valid: boolean; error?: string } {
	if (!url || !url.trim()) {
		return { valid: true } // 빈 URL은 허용 (기본 이미지 사용)
	}

	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		return {
			valid: false,
			error: '올바른 URL 형식이 아닙니다. (http:// 또는 https://로 시작해야 합니다)',
		}
	}

	if (!isAllowedImageUrl(url)) {
		return {
			valid: false,
			error:
				'허용되지 않은 이미지 호스팅 서비스입니다. S3 또는 허용된 이미지 서비스를 사용해주세요.',
		}
	}

	return { valid: true }
}

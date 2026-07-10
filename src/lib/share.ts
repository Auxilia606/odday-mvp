// 공유 기능. (MVP 문서 섹션 15.4, 16.7)
// Web Share API를 우선 사용하고, 미지원 시 클립보드 복사로 폴백한다.
// 원본 링크에는 유입 경로 추적용 ?ref=friend 를 붙인다.

const SHARE_TEXT = "오늘을 조금 이상하게. — Odday";

export function getShareUrl(): string {
  const url = new URL(window.location.href);
  url.searchParams.set("ref", "friend");
  return url.toString();
}

// 사용된 채널 문자열을 반환 (share_clicked 이벤트에 첨부)
export async function shareOdday(): Promise<string> {
  const url = getShareUrl();

  if (navigator.share) {
    try {
      await navigator.share({ title: "Odday", text: SHARE_TEXT, url });
      return "web_share";
    } catch {
      // 사용자가 취소했거나 실패 → 폴백 시도
    }
  }

  try {
    await navigator.clipboard.writeText(`${SHARE_TEXT} ${url}`);
    return "clipboard";
  } catch {
    return "unavailable";
  }
}

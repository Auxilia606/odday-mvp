// 유입 경로(?ref=) 캡처. (MVP 문서 섹션 18)
// 최초 진입 시 쿼리 파라미터를 세션에 저장해, 이후 이벤트에 계속 첨부한다.

const REF_KEY = "odday-ref";

export function captureRef(): string | undefined {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");

  if (ref) {
    // 최초 유입 경로를 세션 동안 유지 (뒤 페이지 이동으로 덮어쓰지 않음)
    if (!sessionStorage.getItem(REF_KEY)) {
      sessionStorage.setItem(REF_KEY, ref);
    }
    return ref;
  }

  return sessionStorage.getItem(REF_KEY) ?? undefined;
}

export function getRef(): string | undefined {
  return sessionStorage.getItem(REF_KEY) ?? undefined;
}

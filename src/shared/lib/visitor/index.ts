// 익명 방문자 / 세션 식별자. (MVP 문서 섹션 13)
// 사용자 이름·연락처와 절대 연결하지 않는 이벤트 수집용 식별자이므로
// 도메인 무관 인프라(shared)로 둔다. analytics가 이 값을 첨부한다.

const VISITOR_ID_KEY = "odday-visitor-id";

export function getOddayVisitorId(): string {
  const storedVisitorId = localStorage.getItem(VISITOR_ID_KEY);

  if (storedVisitorId) {
    return storedVisitorId;
  }

  const visitorId = crypto.randomUUID();
  localStorage.setItem(VISITOR_ID_KEY, visitorId);

  return visitorId;
}

// 세션 식별자 — 동일 방문(브라우저 세션) 내 행동을 묶기 위한 값.
// sessionStorage를 쓰므로 탭/세션이 끝나면 새로 발급된다.
const SESSION_ID_KEY = "odday-session-id";

export function getOddaySessionId(): string {
  const storedSessionId = sessionStorage.getItem(SESSION_ID_KEY);

  if (storedSessionId) {
    return storedSessionId;
  }

  const sessionId = crypto.randomUUID();
  sessionStorage.setItem(SESSION_ID_KEY, sessionId);

  return sessionId;
}

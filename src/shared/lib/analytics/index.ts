// 이벤트 추상화 레이어. (MVP 문서 섹션 14, 19)
//
// trackEvent()가 유일한 진입점이다. 모든 이벤트에 visitorId / sessionId /
// ref / timestamp를 자동으로 붙인다. 초기 구현은 console + localStorage 싱크이며,
// 나중에 PostHog / Umami를 어댑터로 추가하면 화면 코드는 바꾸지 않아도 된다.

import type { OddayAnalyticsEvent } from "./events";
import { getOddaySessionId, getOddayVisitorId } from "@/shared/lib/visitor";
import { getRef } from "@/shared/lib/ref";

export type { OddayAnalyticsEvent, OddayEventType } from "./events";

export interface TrackedEvent {
  event: OddayAnalyticsEvent;
  visitorId: string;
  sessionId: string;
  ref?: string;
  // ISO 8601 timestamp
  at: string;
}

// 어댑터 인터페이스 — 외부 분석 도구를 붙일 때 이것만 구현하면 된다.
export interface AnalyticsAdapter {
  send(tracked: TrackedEvent): void;
}

// 1) 콘솔 어댑터 — 개발 중 퍼널 확인용
const consoleAdapter: AnalyticsAdapter = {
  send(tracked) {
    // eslint-disable-next-line no-console
    console.log(
      `%c[odday] ${tracked.event.type}`,
      "color:#f5a623;font-weight:bold",
      tracked,
    );
  },
};

// 2) localStorage 어댑터 — 로컬에서 수집된 이벤트를 사후 확인용으로 적재
const EVENT_LOG_KEY = "odday-event-log";
const MAX_LOG = 500;

const localStorageAdapter: AnalyticsAdapter = {
  send(tracked) {
    try {
      const raw = localStorage.getItem(EVENT_LOG_KEY);
      const log: TrackedEvent[] = raw ? JSON.parse(raw) : [];
      log.push(tracked);
      // 무한정 쌓이지 않도록 최근 것만 유지
      const trimmed = log.slice(-MAX_LOG);
      localStorage.setItem(EVENT_LOG_KEY, JSON.stringify(trimmed));
    } catch {
      // 저장 실패는 조용히 무시 (분석 실패가 UX를 막지 않도록)
    }
  },
};

// 활성 어댑터 목록. PostHog/Umami를 붙일 때 여기에 push 하면 된다.
const adapters: AnalyticsAdapter[] = [consoleAdapter, localStorageAdapter];

export function registerAdapter(adapter: AnalyticsAdapter): void {
  adapters.push(adapter);
}

export function trackEvent(event: OddayAnalyticsEvent): void {
  const tracked: TrackedEvent = {
    event,
    visitorId: getOddayVisitorId(),
    sessionId: getOddaySessionId(),
    ref: getRef(),
    at: new Date().toISOString(),
  };

  for (const adapter of adapters) {
    adapter.send(tracked);
  }
}

// 개발/디버깅용: 수집된 로컬 이벤트 로그 조회
export function getEventLog(): TrackedEvent[] {
  try {
    const raw = localStorage.getItem(EVENT_LOG_KEY);
    return raw ? (JSON.parse(raw) as TrackedEvent[]) : [];
  } catch {
    return [];
  }
}

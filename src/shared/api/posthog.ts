// PostHog 어댑터. (MVP 문서 섹션 14, 19)
//
// analytics의 AnalyticsAdapter를 구현해 trackEvent() 이벤트를 PostHog로
// 흘려보낸다. 화면 코드는 전혀 바뀌지 않는다 — app/main.tsx에서 registerAdapter로
// 이 어댑터를 붙이기만 하면 된다.
//
// 익명 visitorId를 PostHog distinct_id로 사용하므로, localStorage 개인 기록과
// 동일한 식별자로 사용자별 응답을 대조할 수 있다. (섹션 13)

import posthog from "posthog-js";
import type { AnalyticsAdapter, TrackedEvent } from "@/shared/lib/analytics";

const DEFAULT_HOST = "https://us.i.posthog.com";

// PostHog SDK는 한 번만 초기화한다.
let initialized = false;

function ensureInitialized(key: string, host: string, tracked: TrackedEvent) {
  if (initialized) {
    return;
  }

  posthog.init(key, {
    api_host: host,
    // page_view는 App에서 직접 발생시키므로 자동 수집을 끈다. (섹션 14)
    capture_pageview: false,
    // MVP는 문서에 정의된 명시적 이벤트만 수집한다.
    autocapture: false,
    // 익명이지만 사용자별로 이벤트를 묶어야 하므로 프로필을 항상 생성한다.
    person_profiles: "always",
  });

  // 우리 익명 식별자를 distinct_id로 고정해 재방문/기록 대조를 가능하게 한다.
  posthog.identify(tracked.visitorId);

  initialized = true;
}

export function createPosthogAdapter(): AnalyticsAdapter | null {
  const key = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
  const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST ?? DEFAULT_HOST;

  // 키가 없으면 어댑터를 붙이지 않는다 (로컬 개발 등).
  if (!key) {
    return null;
  }

  return {
    send(tracked) {
      ensureInitialized(key, host, tracked);

      const { type, ...props } = tracked.event;

      // 모든 이벤트에 세션/유입 경로를 붙여 퍼널·유입 분석을 가능하게 한다.
      // (섹션 15, 18)
      posthog.capture(type, {
        ...props,
        session_id: tracked.sessionId,
        ref: tracked.ref,
      });
    },
  };
}

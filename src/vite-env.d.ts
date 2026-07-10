/// <reference types="vite/client" />

// PostHog 연동에 사용하는 환경변수. (MVP 문서 섹션 19)
// 값이 없으면 PostHog 어댑터는 비활성화되고 console/localStorage만 동작한다.
interface ImportMetaEnv {
  readonly VITE_PUBLIC_POSTHOG_KEY?: string;
  readonly VITE_PUBLIC_POSTHOG_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

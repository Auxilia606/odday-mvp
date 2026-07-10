import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerAdapter } from "./lib/analytics";
import { createPosthogAdapter } from "./lib/posthog";

// PostHog 키가 설정돼 있으면 수집 어댑터를 붙인다. (MVP 문서 섹션 19)
// 키가 없으면(로컬 개발 등) console/localStorage 어댑터만 동작한다.
const posthogAdapter = createPosthogAdapter();
if (posthogAdapter) {
  registerAdapter(posthogAdapter);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

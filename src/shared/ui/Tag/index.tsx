// 작은 라벨 태그.

import type { ReactNode } from "react";

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-odday-border px-2.5 py-1 text-xs text-odday-muted">
      {children}
    </span>
  );
}

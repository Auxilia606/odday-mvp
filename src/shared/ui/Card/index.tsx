// 공용 카드. onClick을 주면 클릭 가능한(role=button) 카드가 된다.

import type { ReactNode } from "react";

export function Card({
  children,
  onClick,
  selected = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
}) {
  const clickable = onClick != null;
  return (
    <div
      onClick={onClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick?.();
            }
          : undefined
      }
      className={[
        "rounded-2xl border p-5 transition",
        selected
          ? "border-odday-accent bg-odday-accent/10"
          : "border-odday-border bg-odday-surface",
        clickable
          ? "cursor-pointer touch-manipulation hover:border-odday-accent/60 active:scale-[0.99]"
          : "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

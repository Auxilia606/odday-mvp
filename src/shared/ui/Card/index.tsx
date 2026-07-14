// 공용 카드. onClick을 주면 클릭 가능한(role=button) 카드가 된다.

import type { ReactNode } from "react";

export function Card({
  children,
  onClick,
  selected = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
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
        "rounded-[1.4rem] border p-5 transition-all duration-300",
        selected
          ? "border-odday-accent bg-odday-accent/10"
          : "border-odday-border bg-odday-surface",
        clickable
          ? "cursor-pointer touch-manipulation hover:-translate-y-0.5 hover:border-odday-accent/60 active:scale-[0.985]"
          : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

// 공용 UI 컴포넌트 모음.

import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Screen({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    // 바깥: 모바일은 꽉 차게, sm 이상에서는 화면 중앙에 폰 프레임으로 배치
    <div className="flex min-h-[100dvh] justify-center bg-odday-bg sm:items-center sm:py-8">
      <div
        className={[
          "relative flex w-full max-w-md flex-col bg-odday-bg",
          // 모바일: 뷰포트 전체 높이
          "min-h-[100dvh]",
          // 데스크톱: 폰 형태의 카드 (테두리·둥근 모서리·그림자, 내부 스크롤)
          "sm:h-[calc(100dvh-4rem)] sm:max-h-[880px] sm:min-h-0 sm:overflow-hidden sm:rounded-[2.25rem] sm:border sm:border-odday-border sm:shadow-2xl sm:shadow-black/50",
        ].join(" ")}
      >
        {/* 스크롤 영역: 상단 여백에 노치(safe-area) 반영 */}
        <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-5 pb-6 pt-[max(2.5rem,env(safe-area-inset-top))]">
          {children}
        </div>

        {/* 고정 하단 액션 바: 홈 인디케이터(safe-area) 반영, 엄지로 닿는 위치 */}
        {footer && (
          <div className="border-t border-white/5 bg-odday-bg/85 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const base =
    "w-full select-none touch-manipulation rounded-2xl px-5 py-4 text-base font-semibold transition active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none";
  const styles: Record<string, string> = {
    primary: "bg-odday-accent text-black hover:brightness-105",
    secondary:
      "bg-odday-surface text-white border border-odday-border hover:border-odday-accent/60",
    ghost: "bg-transparent text-odday-muted hover:text-white",
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

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

// 단일 선택 옵션 그룹
export function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-sm text-odday-muted">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={[
              "touch-manipulation rounded-xl border px-3 py-3.5 text-sm font-medium transition active:scale-[0.97]",
              value === opt.value
                ? "border-odday-accent bg-odday-accent/15 text-white"
                : "border-odday-border bg-odday-surface text-odday-muted hover:text-white",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-odday-border px-2.5 py-1 text-xs text-odday-muted">
      {children}
    </span>
  );
}

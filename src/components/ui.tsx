// 공용 UI 컴포넌트 모음.

import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full flex flex-col items-center px-5 py-10">
      <div className="w-full max-w-md flex-1 flex flex-col">{children}</div>
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
    "w-full rounded-2xl px-5 py-4 text-base font-semibold transition active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none";
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
        clickable ? "cursor-pointer hover:border-odday-accent/60" : "",
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
              "rounded-xl border px-3 py-3 text-sm font-medium transition",
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

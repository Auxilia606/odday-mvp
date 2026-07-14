// 공용 버튼. primary / secondary / ghost 3가지 변형.

import type { ButtonHTMLAttributes } from "react";

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const base =
    "relative isolate w-full select-none overflow-hidden touch-manipulation rounded-[1.15rem] px-5 py-[1.05rem] text-base font-bold transition-all active:scale-[0.975] disabled:pointer-events-none disabled:opacity-40";
  const styles: Record<string, string> = {
    primary: "button-shimmer bg-odday-accent text-black shadow-[0_10px_30px_rgba(255,176,32,.22)] hover:brightness-105",
    secondary:
      "border border-white/10 bg-white/[0.06] text-white hover:border-odday-accent/50",
    ghost: "bg-transparent text-odday-muted hover:text-white",
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

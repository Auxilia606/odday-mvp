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

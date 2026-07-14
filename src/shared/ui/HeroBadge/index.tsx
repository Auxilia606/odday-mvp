// 화면 상단 히어로 아이콘 배지. 순수 프레젠테이션 컴포넌트로, 크기·톤 변형만 props로 받는다.
// (SOLID 가이드: SRP — 렌더 전용 / OCP — 새 변형은 SIZES·TONES에 추가)

import type { ReactNode } from "react";

const SIZES = {
  sm: "h-12 w-12 rounded-2xl text-2xl",
  md: "h-14 w-14 rounded-full text-2xl",
  lg: "h-24 w-24 rounded-full text-4xl",
} as const;

const TONES = {
  subtle: "bg-white/[.06] text-white",
  emerald: "bg-emerald-400/15 text-emerald-300",
  accent:
    "bg-gradient-to-br from-odday-accent to-orange-500 shadow-[0_20px_60px_rgba(255,176,32,.25)]",
} as const;

export function HeroBadge({
  children,
  size = "sm",
  tone = "subtle",
  className = "",
}: {
  children: ReactNode;
  size?: keyof typeof SIZES;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center ${SIZES[size]} ${TONES[tone]} ${className}`}
    >
      {children}
    </div>
  );
}

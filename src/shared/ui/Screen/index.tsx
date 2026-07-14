// 화면 골격 컴포넌트. 모바일은 꽉 차게, sm 이상에서는 폰 프레임으로 배치한다.

import type { ReactNode } from "react";

export function Screen({
  children,
  footer,
  label,
  progress,
}: {
  children: ReactNode;
  footer?: ReactNode;
  label?: string;
  progress?: number;
}) {
  return (
    // 바깥: 모바일은 꽉 차게, sm 이상에서는 화면 중앙에 폰 프레임으로 배치
    <div className="flex min-h-[100dvh] justify-center bg-[#050507] sm:items-center sm:py-8">
      <div
        className={[
          "relative isolate flex w-full max-w-md flex-col overflow-hidden bg-odday-bg",
          // 모바일: 뷰포트 전체 높이
          "min-h-[100dvh]",
          // 데스크톱: 폰 형태의 카드 (테두리·둥근 모서리·그림자, 내부 스크롤)
          "sm:h-[calc(100dvh-4rem)] sm:max-h-[880px] sm:min-h-0 sm:overflow-hidden sm:rounded-[2.25rem] sm:border sm:border-odday-border sm:shadow-2xl sm:shadow-black/50",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-odday-accent/[0.08] blur-3xl float-orb" />
        <header className="relative z-20 flex items-center gap-3 px-5 pb-3 pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-odday-accent text-sm font-black text-black">O</div>
          <div className="min-w-0 flex-1"><p className="text-[10px] font-bold tracking-[.22em] text-white/40">ODDAY</p><p className="truncate text-xs text-white/80">{label ?? "오늘을 조금 이상하게"}</p></div>
          {progress != null && <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/60">{progress} / 4</span>}
        </header>
        {progress != null && <div className="relative z-20 flex gap-1.5 px-5 pb-2">{[1,2,3,4].map(step => <span key={step} className={`h-1 flex-1 rounded-full ${step <= progress ? "bg-odday-accent" : "bg-white/10"}`} />)}</div>}
        {/* 스크롤 영역: 상단 여백에 노치(safe-area) 반영 */}
        <div className="no-scrollbar relative z-10 flex flex-1 flex-col overflow-y-auto px-5 pb-8 pt-5">
          {children}
        </div>

        {/* 고정 하단 액션 바: 홈 인디케이터(safe-area) 반영, 엄지로 닿는 위치 */}
        {footer && (
          <div className="relative z-30 border-t border-white/[.07] bg-[#101014]/90 px-5 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-16px_40px_rgba(0,0,0,.28)] backdrop-blur-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

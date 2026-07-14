// 화면 골격 컴포넌트. 모바일은 꽉 차게, sm 이상에서는 폰 프레임으로 배치한다.

import type { ReactNode } from "react";

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

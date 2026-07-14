// 시작 화면. (MVP 문서 섹션 9, 24)

import { Button } from "@/shared/ui/Button";
import { Screen } from "@/shared/ui/Screen";

export function StartScreen({
  onStart,
  onViewHistory,
}: {
  onStart: () => void;
  onViewHistory: () => void;
}) {
  return (
    <Screen label="매일 한 번, 일상을 벗어나는 퀘스트"
      footer={
        <div className="space-y-3">
          <Button onClick={onStart}>오늘의 Odday 시작하기</Button>
          <Button variant="ghost" onClick={onViewHistory}>
            내 기록 보기
          </Button>
        </div>
      }
    >
      <div className="flex flex-1 flex-col justify-center pb-6">
        <div className="relative mb-10 flex h-32 items-center justify-center"><div className="pulse-ring absolute h-24 w-24 rounded-full border border-odday-accent/50" /><div className="relative flex h-24 w-24 rotate-3 items-center justify-center rounded-[2rem] bg-gradient-to-br from-odday-accent to-orange-500 text-4xl shadow-[0_24px_70px_rgba(255,176,32,.28)]">✦</div></div>
        <p className="mb-3 text-xs font-bold tracking-[.28em] text-odday-accent">BREAK THE ROUTINE</p>
        <h1 className="text-[2.75rem] font-black leading-[1.08] tracking-[-.04em]">
          오늘을
          <br />
          조금 이상하게.
        </h1>
        <p className="mt-5 text-base text-odday-muted">
          지금 상황에 맞는 작은 현실 퀘스트를 받아보세요.
        </p>
      </div>
    </Screen>
  );
}

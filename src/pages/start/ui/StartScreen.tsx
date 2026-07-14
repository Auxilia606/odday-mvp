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
    <Screen
      footer={
        <div className="space-y-3">
          <Button onClick={onStart}>오늘의 Odday 시작하기</Button>
          <Button variant="ghost" onClick={onViewHistory}>
            내 기록 보기
          </Button>
        </div>
      }
    >
      <div className="flex flex-1 flex-col justify-center">
        <p className="mb-3 text-sm tracking-widest text-odday-accent">ODDAY</p>
        <h1 className="text-4xl font-bold leading-tight">
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

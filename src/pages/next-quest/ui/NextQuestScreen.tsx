// 다음 Odday 요청 화면. (MVP 문서 섹션 10.7)

import { Button } from "@/shared/ui/Button";
import { HeroBadge } from "@/shared/ui/HeroBadge";
import { Screen } from "@/shared/ui/Screen";

export function NextQuestScreen({
  onRequest,
  onFinish,
  onShare,
}: {
  onRequest: (requestType: "similar" | "harder" | "different") => void;
  onFinish: () => void;
  onShare: () => void;
}) {
  return (
    <Screen label="오늘의 Odday 완료" progress={4}
      footer={
        <div className="space-y-3">
          <Button onClick={() => onRequest("similar")}>비슷한 퀘스트 받기</Button>
          <Button variant="secondary" onClick={() => onRequest("harder")}>
            조금 더 어려운 퀘스트 받기
          </Button>
          <Button variant="secondary" onClick={() => onRequest("different")}>
            완전히 다른 퀘스트 받기
          </Button>
          <Button variant="ghost" onClick={onShare}>
            결과 공유하기
          </Button>
          <Button variant="ghost" onClick={onFinish}>
            오늘은 여기까지
          </Button>
        </div>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <HeroBadge size="lg" tone="accent" className="mb-8">
          ✦
        </HeroBadge>
        <h2 className="text-2xl font-bold">기록했어요.</h2>
        <p className="mt-3 text-sm text-odday-muted">
          이어서 또 다른 Odday를 받아볼까요?
        </p>
      </div>
    </Screen>
  );
}

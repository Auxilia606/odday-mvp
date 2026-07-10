// 다음 Odday 요청 화면. (MVP 문서 섹션 10.7)

import { Button, Screen } from "../components/ui";

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
    <Screen>
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl font-bold">기록했어요.</h2>
        <p className="mt-3 text-sm text-odday-muted">
          이어서 또 다른 Odday를 받아볼까요?
        </p>
      </div>

      <div className="space-y-3 pb-2">
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
    </Screen>
  );
}

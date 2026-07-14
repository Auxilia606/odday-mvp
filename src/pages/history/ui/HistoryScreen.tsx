// 개인 기록 "My Oddays" 화면. (MVP 문서 섹션 10.8, 24)

import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Screen } from "@/shared/ui/Screen";
import { Tag } from "@/shared/ui/Tag";
import { CATEGORY_LABELS } from "@/entities/quest";
import { getRecords } from "@/entities/record";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function HistoryScreen({
  onStart,
  onShare,
}: {
  onStart: () => void;
  onShare: () => void;
}) {
  const records = getRecords();

  return (
    <Screen label="나의 Odday 아카이브"
      footer={
        <div className="space-y-3">
          {records.length > 0 && (
            <Button variant="secondary" onClick={onShare}>
              기록 공유하기
            </Button>
          )}
          <Button onClick={onStart}>새로운 Odday 받기</Button>
        </div>
      }
    >
      <div className="mb-5 rounded-2xl bg-white/[.04] p-4"><p className="text-xs text-odday-muted">완료한 퀘스트</p><p className="mt-1 text-3xl font-black text-odday-accent">{records.length}</p></div><h2 className="mb-1 text-[1.75rem] font-extrabold">당신의 이상한 날들</h2>
      <p className="mb-6 text-sm text-odday-muted">
        Odday로 평소와 다르게 행동한 기록이에요.
      </p>

      {records.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-odday-muted">아직 기록이 없어요.</p>
          <p className="text-sm text-odday-muted">
            첫 Odday를 수행하면 여기에 쌓여요.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <Card key={r.id}>
              <div className="mb-2 flex items-center justify-between">
                <Tag>{CATEGORY_LABELS[r.category]}</Tag>
                <span className="text-xs text-odday-muted">
                  {formatDate(r.at)}
                </span>
              </div>
              <h3 className="font-semibold">{r.questTitle}</h3>
              {r.note && (
                <p className="mt-1 text-sm text-odday-muted">“{r.note}”</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </Screen>
  );
}

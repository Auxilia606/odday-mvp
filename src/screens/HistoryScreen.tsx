// 개인 기록 "My Oddays" 화면. (MVP 문서 섹션 10.8, 24)

import { Button, Card, Screen, Tag } from "../components/ui";
import { CATEGORY_LABELS } from "../types/quest";
import { getRecords } from "../lib/storage";

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
    <Screen>
      <h2 className="mb-1 text-2xl font-bold">당신의 이상한 날들</h2>
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

      <div className="mt-8 space-y-3">
        {records.length > 0 && (
          <Button variant="secondary" onClick={onShare}>
            기록 공유하기
          </Button>
        )}
        <Button onClick={onStart}>새로운 Odday 받기</Button>
      </div>
    </Screen>
  );
}

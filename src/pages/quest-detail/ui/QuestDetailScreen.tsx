// 퀘스트 상세 + 수행 화면. (MVP 문서 섹션 10.3, 10.4, 10.6)

import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Screen } from "@/shared/ui/Screen";
import { Tag } from "@/shared/ui/Tag";
import { CATEGORY_LABELS, INTENSITY_LABELS, type Quest } from "@/entities/quest";

const SKIP_REASONS = [
  "재미없어 보임",
  "너무 귀찮음",
  "지금 상황과 맞지 않음",
  "시간이 부족함",
  "혼자 하기 싫음",
  "결과 기록이 부담스러움",
  "너무 유치하게 느껴짐",
  "다른 종류의 퀘스트를 원함",
  "기타",
];

const DURATION_LABEL: Record<string, string> = {
  "1m": "약 1분",
  "5m": "약 5분",
  "20m": "약 20분",
};

export function QuestDetailScreen({
  quest,
  started,
  onStart,
  onComplete,
  onSkip,
  onBack,
}: {
  quest: Quest;
  started: boolean;
  onStart: () => void;
  onComplete: (elapsed?: "under_5m" | "5_20m" | "over_20m") => void;
  onSkip: (reason?: string) => void;
  onBack: () => void;
}) {
  const [skipping, setSkipping] = useState(false);

  const minDuration = quest.durations[0];

  const footer = skipping ? (
    <Button variant="ghost" onClick={() => setSkipping(false)}>
      취소
    </Button>
  ) : !started ? (
    <div className="space-y-3">
      <Button onClick={onStart}>이걸 해볼래요</Button>
      <Button variant="ghost" onClick={() => setSkipping(true)}>
        오늘은 이건 별로예요
      </Button>
    </div>
  ) : (
    <div className="space-y-3">
      <p className="text-center text-sm text-odday-muted">
        직접 해본 뒤 눌러주세요.
      </p>
      <Button onClick={() => onComplete()}>해봤어요</Button>
    </div>
  );

  return (
    <Screen footer={footer}>
      <button
        onClick={onBack}
        className="mb-6 self-start text-sm text-odday-muted hover:text-white"
      >
        ← 다른 퀘스트 보기
      </button>

      <Card>
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Tag>{CATEGORY_LABELS[quest.category]}</Tag>
          <Tag>{INTENSITY_LABELS[quest.intensity]}</Tag>
        </div>
        <h2 className="text-2xl font-bold">{quest.title}</h2>
        <p className="mt-2 text-base text-odday-muted">{quest.description}</p>

        <dl className="mt-5 grid grid-cols-2 gap-y-3 text-sm">
          <dt className="text-odday-muted">시간</dt>
          <dd className="text-right">{DURATION_LABEL[minDuration]}</dd>
          <dt className="text-odday-muted">장소</dt>
          <dd className="text-right">
            {quest.places.includes("indoor") && quest.places.includes("outdoor")
              ? "실내·실외"
              : quest.places.includes("indoor")
                ? "실내"
                : "실외"}
          </dd>
          <dt className="text-odday-muted">인원</dt>
          <dd className="text-right">
            {quest.parties.length === 2
              ? "혼자 또는 함께"
              : quest.parties[0] === "alone"
                ? "혼자"
                : "함께"}
          </dd>
          <dt className="text-odday-muted">비용</dt>
          <dd className="text-right">{quest.costsMoney ? "소액 지출" : "없음"}</dd>
        </dl>
      </Card>

      {skipping && (
        <div className="mt-6">
          <p className="mb-3 text-sm text-odday-muted">
            이 퀘스트가 별로인 이유는?
          </p>
          <div className="space-y-2">
            {SKIP_REASONS.map((reason) => (
              <button
                key={reason}
                onClick={() => onSkip(reason)}
                className="w-full touch-manipulation rounded-xl border border-odday-border bg-odday-surface px-4 py-3 text-left text-base transition active:scale-[0.99] hover:border-odday-accent/60"
              >
                {reason}
              </button>
            ))}
          </div>
        </div>
      )}
    </Screen>
  );
}

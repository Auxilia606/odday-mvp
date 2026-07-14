// 완료 후 피드백 화면. (MVP 문서 섹션 10.5)

import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/shared/ui/Button";
import { HeroBadge } from "@/shared/ui/HeroBadge";
import { Screen } from "@/shared/ui/Screen";
import type { FeedbackDraft, FeedbackInput } from "../model/feedback";

// 핵심 질문 선택지 → wouldNotHaveDoneWithoutOdday 매핑 (섹션 10.5)
const CAUSED_OPTIONS: {
  label: string;
  wouldNotHaveDone: boolean;
}[] = [
  { label: "전혀 하지 않았을 것이다", wouldNotHaveDone: true },
  { label: "아마 하지 않았을 것이다", wouldNotHaveDone: true },
  { label: "상황에 따라 했을 수도 있다", wouldNotHaveDone: false },
  { label: "원래 할 예정이었다", wouldNotHaveDone: false },
];

const RETRY_OPTIONS: {
  label: string;
  value: FeedbackInput["retryIntent"];
}[] = [
  { label: "바로 다른 퀘스트도 해보고 싶다", value: "high" },
  { label: "다음에 다시 해보고 싶다", value: "medium" },
  { label: "한 번이면 충분하다", value: "low" },
  { label: "별로 하고 싶지 않다", value: "none" },
];

export function FeedbackScreen({
  draft,
  onDraftChange,
  onSubmit,
}: {
  draft: FeedbackDraft;
  onDraftChange: Dispatch<SetStateAction<FeedbackDraft>>;
  onSubmit: (input: FeedbackInput) => void;
}) {
  const { causedIdx, retryIntent: retry, note } = draft;
  const setCausedIdx = (idx: number) =>
    onDraftChange((prev) => ({ ...prev, causedIdx: idx }));
  const setRetry = (value: FeedbackInput["retryIntent"]) =>
    onDraftChange((prev) => ({ ...prev, retryIntent: value }));
  const setNote = (value: string) =>
    onDraftChange((prev) => ({ ...prev, note: value }));

  const ready = causedIdx !== null && retry !== null;

  return (
    <Screen label="경험 기록하기" progress={4}
      footer={
        <Button
          disabled={!ready}
          onClick={() =>
            ready &&
            onSubmit({
              wouldNotHaveDoneWithoutOdday:
                CAUSED_OPTIONS[causedIdx!].wouldNotHaveDone,
              retryIntent: retry!,
              note: note.trim() || undefined,
            })
          }
        >
          기록하기
        </Button>
      }
    >
      <HeroBadge size="md" tone="emerald" className="mb-5">
        ✓
      </HeroBadge>
      <h2 className="mb-1 text-[1.75rem] font-extrabold">
        오늘이 조금 달라졌네요.
      </h2>
      <p className="mb-8 text-sm text-odday-muted">두 가지만 여쭤볼게요.</p>

      <p className="mb-3 text-sm font-medium">
        Odday가 없었다면 실제로 이 행동을 했을까요?
      </p>
      <div className="mb-8 space-y-2">
        {CAUSED_OPTIONS.map((opt, idx) => (
          <button
            key={opt.label}
            onClick={() => setCausedIdx(idx)}
            className={[
              "w-full rounded-xl border px-4 py-3 text-left text-sm transition",
              causedIdx === idx
                ? "border-odday-accent bg-odday-accent/15"
                : "border-odday-border bg-odday-surface text-odday-muted hover:text-white",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <p className="mb-3 text-sm font-medium">비슷한 Odday를 다시 해보고 싶나요?</p>
      <div className="mb-8 space-y-2">
        {RETRY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setRetry(opt.value)}
            className={[
              "w-full rounded-xl border px-4 py-3 text-left text-sm transition",
              retry === opt.value
                ? "border-odday-accent bg-odday-accent/15"
                : "border-odday-border bg-odday-surface text-odday-muted hover:text-white",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <p className="mb-2 text-sm font-medium">
        한 줄 기록 <span className="text-odday-muted">(선택)</span>
      </p>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="어땠는지 한 줄로 남겨보세요."
        rows={2}
        className="w-full resize-none rounded-xl border border-odday-border bg-odday-surface px-4 py-3 text-base outline-none focus:border-odday-accent/60"
      />
    </Screen>
  );
}

// Odday 사용자 흐름 상태 관리. (MVP 문서 섹션 8)
// 스텝 전환 지점에서 대응 이벤트를 trackEvent로 발생시킨다.

import { useCallback, useState } from "react";
import type { ContextSelection, Quest } from "../types/quest";
import { getQuestById, pickQuests } from "../data/quests";
import { trackEvent } from "../lib/analytics";
import { addRecord } from "../lib/storage";

export type Step =
  | "start"
  | "context"
  | "quests"
  | "detail"
  | "feedback"
  | "next"
  | "history";

export interface FeedbackInput {
  wouldNotHaveDoneWithoutOdday: boolean;
  retryIntent: "high" | "medium" | "low" | "none";
  satisfaction?: number;
  note?: string;
}

export interface OddayFlow {
  step: Step;
  context: ContextSelection | null;
  candidates: Quest[];
  activeQuest: Quest | null;

  start: () => void;
  selectContext: (ctx: ContextSelection) => void;
  selectQuest: (quest: Quest) => void;
  skipQuest: (quest: Quest, reason?: string) => void;
  reshuffle: () => void;
  startQuest: () => void;
  completeQuest: (elapsed?: "under_5m" | "5_20m" | "over_20m") => void;
  submitFeedback: (input: FeedbackInput) => void;
  requestNext: (requestType: "similar" | "harder" | "different") => void;
  finishForToday: () => void;
  viewHistory: () => void;
  goToStart: () => void;
  goToQuests: () => void;
}

export function useOddayFlow(): OddayFlow {
  const [step, setStep] = useState<Step>("start");
  const [context, setContext] = useState<ContextSelection | null>(null);
  const [candidates, setCandidates] = useState<Quest[]>([]);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  // 이미 노출/수행한 퀘스트는 다음 추천에서 제외 (섹션 22.1 중복 방지 취지)
  const [seenIds, setSeenIds] = useState<string[]>([]);

  const emitImpressions = useCallback((quests: Quest[]) => {
    for (const q of quests) {
      trackEvent({
        type: "quest_impression",
        questId: q.id,
        category: q.category,
      });
    }
  }, []);

  const start = useCallback(() => {
    trackEvent({ type: "odday_started" });
    setStep("context");
  }, []);

  const selectContext = useCallback(
    (ctx: ContextSelection) => {
      setContext(ctx);
      trackEvent({
        type: "context_selected",
        place: ctx.place,
        party: ctx.party,
        duration: ctx.duration,
      });
      const picked = pickQuests(ctx);
      setCandidates(picked);
      setSeenIds((prev) => [...prev, ...picked.map((q) => q.id)]);
      emitImpressions(picked);
      setStep("quests");
    },
    [emitImpressions],
  );

  const selectQuest = useCallback((quest: Quest) => {
    trackEvent({
      type: "quest_selected",
      questId: quest.id,
      category: quest.category,
    });
    setActiveQuest(quest);
    setStep("detail");
  }, []);

  const skipQuest = useCallback((quest: Quest, reason?: string) => {
    trackEvent({ type: "quest_skipped", questId: quest.id, reason });
  }, []);

  // 후보를 모두 건너뛰거나 새 후보를 원할 때 다시 뽑기
  const reshuffle = useCallback(() => {
    if (!context) return;
    const picked = pickQuests(context, { exclude: seenIds });
    setCandidates(picked);
    setSeenIds((prev) => [...prev, ...picked.map((q) => q.id)]);
    emitImpressions(picked);
  }, [context, seenIds, emitImpressions]);

  const startQuest = useCallback(() => {
    if (!activeQuest) return;
    trackEvent({ type: "quest_started", questId: activeQuest.id });
  }, [activeQuest]);

  const completeQuest = useCallback(
    (elapsed?: "under_5m" | "5_20m" | "over_20m") => {
      if (!activeQuest) return;
      trackEvent({
        type: "quest_completed",
        questId: activeQuest.id,
        elapsedBucket: elapsed,
      });
      setStep("feedback");
    },
    [activeQuest],
  );

  const submitFeedback = useCallback(
    (input: FeedbackInput) => {
      if (!activeQuest) return;
      trackEvent({
        type: "quest_feedback_submitted",
        questId: activeQuest.id,
        wouldNotHaveDoneWithoutOdday: input.wouldNotHaveDoneWithoutOdday,
        retryIntent: input.retryIntent,
      });
      // 개인 기록 저장 (섹션 10.8)
      addRecord({
        questId: activeQuest.id,
        questTitle: activeQuest.title,
        category: activeQuest.category,
        completed: true,
        satisfaction: input.satisfaction,
        note: input.note,
      });
      setStep("next");
    },
    [activeQuest],
  );

  const requestNext = useCallback(
    (requestType: "similar" | "harder" | "different") => {
      if (!activeQuest || !context) return;
      trackEvent({
        type: "next_quest_requested",
        previousQuestId: activeQuest.id,
        requestType,
      });
      const picked = pickQuests(context, {
        exclude: seenIds,
        bias: requestType,
        previous: getQuestById(activeQuest.id),
      });
      setCandidates(picked);
      setSeenIds((prev) => [...prev, ...picked.map((q) => q.id)]);
      setActiveQuest(null);
      emitImpressions(picked);
      setStep("quests");
    },
    [activeQuest, context, seenIds, emitImpressions],
  );

  const finishForToday = useCallback(() => {
    trackEvent({ type: "history_viewed" });
    setStep("history");
  }, []);

  const viewHistory = useCallback(() => {
    trackEvent({ type: "history_viewed" });
    setStep("history");
  }, []);

  const goToStart = useCallback(() => {
    setStep("start");
    setActiveQuest(null);
  }, []);

  const goToQuests = useCallback(() => {
    setActiveQuest(null);
    setStep("quests");
  }, []);

  return {
    step,
    context,
    candidates,
    activeQuest,
    start,
    selectContext,
    selectQuest,
    skipQuest,
    reshuffle,
    startQuest,
    completeQuest,
    submitFeedback,
    requestNext,
    finishForToday,
    viewHistory,
    goToStart,
    goToQuests,
  };
}

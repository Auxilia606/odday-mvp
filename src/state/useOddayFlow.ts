// Odday 사용자 흐름 상태 관리. (MVP 문서 섹션 8)
// 스텝 전환 지점에서 대응 이벤트를 trackEvent로 발생시킨다.

import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { ContextSelection, Quest } from "../types/quest";
import { getQuestById, pickQuests } from "../data/quests";
import { trackEvent } from "../lib/analytics";
import { addRecord } from "../lib/storage";

// 진행 중 흐름을 세션 동안 유지한다. 새로고침엔 복원되고, 탭을 닫으면 초기화된다.
// 퀘스트/후보는 id만 저장하고 복원 시 데이터셋에서 다시 조회한다.
const FLOW_KEY = "odday-flow";

interface PersistedFlow {
  step: Step;
  context: ContextSelection | null;
  candidateIds: string[];
  activeQuestId: string | null;
  seenIds: string[];
  questStarted: boolean;
  feedbackDraft: FeedbackDraft;
}

function loadPersistedFlow(): PersistedFlow | null {
  try {
    const raw = sessionStorage.getItem(FLOW_KEY);
    return raw ? (JSON.parse(raw) as PersistedFlow) : null;
  } catch {
    return null;
  }
}

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

// 피드백 화면 입력값 초안. 제출 전 새로고침에도 유지되도록 flow에 둔다.
export interface FeedbackDraft {
  causedIdx: number | null;
  retryIntent: FeedbackInput["retryIntent"] | null;
  note: string;
}

export const EMPTY_FEEDBACK_DRAFT: FeedbackDraft = {
  causedIdx: null,
  retryIntent: null,
  note: "",
};

export interface OddayFlow {
  step: Step;
  context: ContextSelection | null;
  candidates: Quest[];
  activeQuest: Quest | null;
  // "이걸 해볼래요"를 눌러 수행에 진입했는지 여부 (detail 화면 하위 상태)
  questStarted: boolean;
  // 피드백 화면 입력 초안 (feedback 화면 하위 상태)
  feedbackDraft: FeedbackDraft;
  setFeedbackDraft: Dispatch<SetStateAction<FeedbackDraft>>;

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
  // 세션에 저장된 흐름이 있으면 그대로 이어서 시작한다. (lazy init: 최초 1회)
  const [initial] = useState(loadPersistedFlow);

  const [step, setStep] = useState<Step>(() => initial?.step ?? "start");
  const [context, setContext] = useState<ContextSelection | null>(
    () => initial?.context ?? null,
  );
  const [candidates, setCandidates] = useState<Quest[]>(() =>
    (initial?.candidateIds ?? [])
      .map(getQuestById)
      .filter((q): q is Quest => q != null),
  );
  const [activeQuest, setActiveQuest] = useState<Quest | null>(() =>
    initial?.activeQuestId ? (getQuestById(initial.activeQuestId) ?? null) : null,
  );
  // 이미 노출/수행한 퀘스트는 다음 추천에서 제외 (섹션 22.1 중복 방지 취지)
  const [seenIds, setSeenIds] = useState<string[]>(() => initial?.seenIds ?? []);
  const [questStarted, setQuestStarted] = useState<boolean>(
    () => initial?.questStarted ?? false,
  );
  const [feedbackDraft, setFeedbackDraft] = useState<FeedbackDraft>(
    () => initial?.feedbackDraft ?? EMPTY_FEEDBACK_DRAFT,
  );

  // 상태가 바뀔 때마다 세션에 저장. 복원은 setState로만 하므로 이벤트는 재발생하지 않는다.
  useEffect(() => {
    const data: PersistedFlow = {
      step,
      context,
      candidateIds: candidates.map((q) => q.id),
      activeQuestId: activeQuest?.id ?? null,
      seenIds,
      questStarted,
      feedbackDraft,
    };
    try {
      sessionStorage.setItem(FLOW_KEY, JSON.stringify(data));
    } catch {
      // 저장 실패는 무시
    }
  }, [step, context, candidates, activeQuest, seenIds, questStarted, feedbackDraft]);

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
    setQuestStarted(false);
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
    setQuestStarted(true);
  }, [activeQuest]);

  const completeQuest = useCallback(
    (elapsed?: "under_5m" | "5_20m" | "over_20m") => {
      if (!activeQuest) return;
      trackEvent({
        type: "quest_completed",
        questId: activeQuest.id,
        elapsedBucket: elapsed,
      });
      // 매번 새 피드백은 빈 폼으로 시작 (이후 입력은 새로고침에도 유지)
      setFeedbackDraft(EMPTY_FEEDBACK_DRAFT);
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
      setFeedbackDraft(EMPTY_FEEDBACK_DRAFT);
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
      setQuestStarted(false);
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
    setQuestStarted(false);
  }, []);

  const goToQuests = useCallback(() => {
    setActiveQuest(null);
    setQuestStarted(false);
    setStep("quests");
  }, []);

  return {
    step,
    context,
    candidates,
    activeQuest,
    questStarted,
    feedbackDraft,
    setFeedbackDraft,
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

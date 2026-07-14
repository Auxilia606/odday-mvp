// Odday MVP 루트. 스텝에 따라 화면을 전환한다. (MVP 문서 섹션 8)
// 스텝 전환 = 우리 앱의 "라우터" 역할.

import { useEffect, useState } from "react";
import { useOddayFlow } from "./flow/useOddayFlow";
import { captureRef } from "@/shared/lib/ref";
import { trackEvent } from "@/shared/lib/analytics";
import { shareOdday } from "@/features/share-odday";
import { StartScreen } from "@/pages/start";
import { ContextScreen } from "@/pages/context";
import { QuestListScreen } from "@/pages/quest-list";
import { QuestDetailScreen } from "@/pages/quest-detail";
import { FeedbackScreen } from "@/pages/feedback";
import { NextQuestScreen } from "@/pages/next-quest";
import { HistoryScreen } from "@/pages/history";

export default function App() {
  const flow = useOddayFlow();
  const [toast, setToast] = useState<string | null>(null);

  // 최초 진입: 유입 경로 캡처 후 page_view 1회 발생 (섹션 14, 18)
  useEffect(() => {
    const ref = captureRef();
    trackEvent({
      type: "page_view",
      referrer: ref ?? (document.referrer || undefined),
    });
  }, []);

  const handleShare = async () => {
    const channel = await shareOdday();
    trackEvent({
      type: "share_clicked",
      questId: flow.activeQuest?.id ?? "history",
      channel,
    });
    if (channel === "clipboard") {
      setToast("링크를 복사했어요.");
      window.setTimeout(() => setToast(null), 2000);
    }
  };

  return (
    <div className="relative min-h-full">
      {/* key가 스텝마다 바뀌어 래퍼가 리마운트되고, screen-enter 진입 애니메이션이 화면 전환마다 재생된다 */}
      <div key={flow.step} className="screen-enter">
      {flow.step === "start" && (
        <StartScreen onStart={flow.start} onViewHistory={flow.viewHistory} />
      )}

      {flow.step === "context" && (
        <ContextScreen onSubmit={flow.selectContext} />
      )}

      {flow.step === "quests" && (
        <QuestListScreen
          candidates={flow.candidates}
          onSelect={flow.selectQuest}
          onReshuffle={flow.reshuffle}
        />
      )}

      {flow.step === "detail" && flow.activeQuest && (
        <QuestDetailScreen
          quest={flow.activeQuest}
          started={flow.questStarted}
          onStart={flow.startQuest}
          onComplete={flow.completeQuest}
          onSkip={(reason) => {
            flow.skipQuest(flow.activeQuest!, reason);
            flow.reshuffle();
            flow.goToQuests();
          }}
          onBack={flow.goToQuests}
        />
      )}

      {flow.step === "feedback" && (
        <FeedbackScreen
          draft={flow.feedbackDraft}
          onDraftChange={flow.setFeedbackDraft}
          onSubmit={flow.submitFeedback}
        />
      )}

      {flow.step === "next" && (
        <NextQuestScreen
          onRequest={flow.requestNext}
          onFinish={flow.finishForToday}
          onShare={handleShare}
        />
      )}

      {flow.step === "history" && (
        <HistoryScreen onStart={flow.goToStart} onShare={handleShare} />
      )}
      </div>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-5">
          <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

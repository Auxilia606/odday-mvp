// Odday MVP 루트. 스텝에 따라 화면을 전환한다. (MVP 문서 섹션 8)

import { useEffect, useState } from "react";
import { useOddayFlow } from "./state/useOddayFlow";
import { captureRef } from "./lib/ref";
import { trackEvent } from "./lib/analytics";
import { shareOdday } from "./lib/share";
import { StartScreen } from "./screens/StartScreen";
import { ContextScreen } from "./screens/ContextScreen";
import { QuestListScreen } from "./screens/QuestListScreen";
import { QuestDetailScreen } from "./screens/QuestDetailScreen";
import { FeedbackScreen } from "./screens/FeedbackScreen";
import { NextQuestScreen } from "./screens/NextQuestScreen";
import { HistoryScreen } from "./screens/HistoryScreen";

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
        <FeedbackScreen onSubmit={flow.submitFeedback} />
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

      {toast && (
        <div className="fixed inset-x-0 bottom-6 flex justify-center px-5">
          <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

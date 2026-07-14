// MVP 문서 섹션 14의 이벤트 설계를 그대로 옮긴 정의.
// trackEvent()는 이 유니온만 받는다.

export type OddayAnalyticsEvent =
  | {
      type: "page_view";
      referrer?: string;
    }
  | {
      type: "odday_started";
    }
  | {
      type: "context_selected";
      place: "indoor" | "outdoor";
      party: "alone" | "together";
      duration: "1m" | "5m" | "20m";
    }
  | {
      type: "quest_impression";
      questId: string;
      category: string;
    }
  | {
      type: "quest_selected";
      questId: string;
      category: string;
    }
  | {
      type: "quest_skipped";
      questId: string;
      reason?: string;
    }
  | {
      type: "quest_started";
      questId: string;
    }
  | {
      type: "quest_completed";
      questId: string;
      elapsedBucket?: "under_5m" | "5_20m" | "over_20m";
    }
  | {
      type: "quest_feedback_submitted";
      questId: string;
      wouldNotHaveDoneWithoutOdday: boolean;
      retryIntent: "high" | "medium" | "low" | "none";
    }
  | {
      type: "next_quest_requested";
      previousQuestId: string;
      requestType: "similar" | "harder" | "different";
    }
  | {
      type: "share_clicked";
      questId: string;
      channel?: string;
    }
  | {
      type: "history_viewed";
    };

export type OddayEventType = OddayAnalyticsEvent["type"];

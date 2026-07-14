// 피드백 입력 관련 타입. (MVP 문서 섹션 10.5)
//
// FeedbackScreen(같은 슬라이스)과 app/flow 오케스트레이터가 함께 쓴다.
// 흐름(app)이 pages 를 import 하는 방향은 허용되므로, 피드백 도메인 타입은
// 피드백 화면과 같은 슬라이스에 둔다.

export interface FeedbackInput {
  wouldNotHaveDoneWithoutOdday: boolean;
  retryIntent: "high" | "medium" | "low" | "none";
  satisfaction?: number;
  note?: string;
}

// 피드백 화면 입력값 초안. 제출 전 새로고침에도 유지되도록 flow에 보관한다.
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

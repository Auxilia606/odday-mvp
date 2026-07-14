// 퀘스트 및 상황 선택 관련 타입. (MVP 문서 섹션 10, 11)

// 상황 조건 (섹션 10.1) — 초기 MVP는 3가지만 사용.
export type Place = "indoor" | "outdoor";
export type Party = "alone" | "together";
export type Duration = "1m" | "5m" | "20m";

export interface ContextSelection {
  place: Place;
  party: Party;
  duration: Duration;
}

// 퀘스트 카테고리 (섹션 11)
export type Category =
  | "observe" // 관찰
  | "explore" // 탐험
  | "sense" // 감각
  | "tidy" // 정리
  | "relation" // 관계
  | "create" // 창작
  | "recall" // 회상
  | "courage"; // 용기

export const CATEGORY_LABELS: Record<Category, string> = {
  observe: "관찰",
  explore: "탐험",
  sense: "감각",
  tidy: "정리",
  relation: "관계",
  create: "창작",
  recall: "회상",
  courage: "용기",
};

// 활동 강도 (섹션 10.3)
export type Intensity = "light" | "medium" | "bold";

export const INTENSITY_LABELS: Record<Intensity, string> = {
  light: "가벼움",
  medium: "보통",
  bold: "약간의 모험",
};

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: Category;
  // 어떤 상황에서 제안 가능한지 (여러 값 허용 → 필터 유연성)
  places: Place[];
  parties: Party[];
  // 이 퀘스트를 제안할 수 있는 최대 소요 시간 버킷
  durations: Duration[];
  intensity: Intensity;
  // 비용 발생 여부
  costsMoney: boolean;
  // 외출(위치 이동)이 필요한지 — 완료율 분석에 유용 (섹션 21)
  requiresGoingOut: boolean;
}

// "My Oddays" 완료 기록 모델. (MVP 문서 섹션 10.8)

import type { Category } from "@/entities/quest/@x/record";

export interface OddayRecord {
  id: string;
  // 수행 날짜 (ISO)
  at: string;
  questId: string;
  questTitle: string;
  category: Category;
  completed: boolean;
  // 만족도 1~5 (선택)
  satisfaction?: number;
  // 선택적 한 줄 기록
  note?: string;
}

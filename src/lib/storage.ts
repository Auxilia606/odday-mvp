// "My Oddays" 개인 기록. (MVP 문서 섹션 10.8)
// 로그인 없이 localStorage에만 저장한다. 서버 전송 없음.

import type { Category } from "../types/quest";

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

const RECORDS_KEY = "odday-records";

export function getRecords(): OddayRecord[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    const records = raw ? (JSON.parse(raw) as OddayRecord[]) : [];
    // 최신순 정렬
    return records.sort((a, b) => b.at.localeCompare(a.at));
  } catch {
    return [];
  }
}

export function addRecord(record: Omit<OddayRecord, "id" | "at">): OddayRecord {
  const full: OddayRecord = {
    ...record,
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
  };

  try {
    const records = getRecords();
    records.push(full);
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch {
    // 저장 실패는 무시
  }

  return full;
}

export function clearRecords(): void {
  localStorage.removeItem(RECORDS_KEY);
}

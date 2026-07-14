// 상황에 맞는 퀘스트 후보를 뽑는 추천 로직. (MVP 문서 섹션 10.2, 10.7)

import type { ContextSelection, Duration, Intensity, Quest } from "./quest";
import { QUESTS } from "./dataset";

// 시간 버킷 순위 — "20m 가능"이면 1m/5m 퀘스트도 수행할 수 있다.
const DURATION_RANK: Record<Duration, number> = { "1m": 1, "5m": 2, "20m": 3 };

function fitsContext(quest: Quest, ctx: ContextSelection): boolean {
  const placeOk = quest.places.includes(ctx.place);
  const partyOk = quest.parties.includes(ctx.party);
  // 사용 가능 시간 이내에 끝나는 퀘스트만 (퀘스트 최소 소요 ≤ 가용 시간)
  const minQuestDuration = Math.min(
    ...quest.durations.map((d) => DURATION_RANK[d]),
  );
  const durationOk = minQuestDuration <= DURATION_RANK[ctx.duration];
  return placeOk && partyOk && durationOk;
}

// 결정론적이지만 매 호출마다 다르게 섞기 위한 seed 회전용 카운터.
let pickCounter = 0;

function rotate<T>(arr: T[], by: number): T[] {
  if (arr.length === 0) return arr;
  const n = by % arr.length;
  return [...arr.slice(n), ...arr.slice(0, n)];
}

export interface PickOptions {
  // 제외할 퀘스트 id (이미 본/수행한 것)
  exclude?: string[];
  // 난이도 편향: 다음 퀘스트 요청 시 사용 (섹션 10.7)
  bias?: "similar" | "harder" | "different";
  // "similar"/"different" 판단 기준이 되는 직전 퀘스트
  previous?: Quest;
  count?: number;
}

const INTENSITY_RANK: Record<Intensity, number> = {
  light: 1,
  medium: 2,
  bold: 3,
};

// 상황에 맞는 퀘스트 후보를 뽑는다. 조건이 빡빡해 3개가 안 되면 점진적으로 완화.
export function pickQuests(
  ctx: ContextSelection,
  options: PickOptions = {},
): Quest[] {
  const { exclude = [], bias, previous, count = 3 } = options;
  pickCounter += 1;

  const excludeSet = new Set(exclude);
  const notExcluded = (q: Quest) => !excludeSet.has(q.id);

  // 1순위: 상황 완전 일치
  let pool = QUESTS.filter((q) => notExcluded(q) && fitsContext(q, ctx));

  // 난이도/유사성 편향 적용
  if (bias && previous) {
    if (bias === "harder") {
      const harder = pool.filter(
        (q) => INTENSITY_RANK[q.intensity] > INTENSITY_RANK[previous.intensity],
      );
      if (harder.length > 0) pool = harder;
    } else if (bias === "similar") {
      const similar = pool.filter((q) => q.category === previous.category);
      if (similar.length >= 1) {
        // 유사 카테고리를 앞에 오도록
        pool = [
          ...similar,
          ...pool.filter((q) => q.category !== previous.category),
        ];
      }
    } else if (bias === "different") {
      pool = pool.filter((q) => q.category !== previous.category);
    }
  }

  // 후보가 부족하면 상황 조건을 완화(place/party만 유지, 시간 무시 → 전체)
  if (pool.length < count) {
    const relaxed = QUESTS.filter(
      (q) =>
        notExcluded(q) &&
        q.places.includes(ctx.place) &&
        q.parties.includes(ctx.party),
    );
    for (const q of relaxed) {
      if (!pool.includes(q)) pool.push(q);
    }
  }
  // 그래도 부족하면 제외 목록만 지킨 전체에서 채운다
  if (pool.length < count) {
    for (const q of QUESTS.filter(notExcluded)) {
      if (!pool.includes(q)) pool.push(q);
    }
  }

  // 매번 같은 순서가 나오지 않도록 회전 후 상위 count개
  return rotate(pool, pickCounter).slice(0, count);
}

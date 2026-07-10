// 하드코딩 퀘스트 데이터셋. (MVP 문서 섹션 11)
// pickQuests(context)로 상황에 맞는 후보 3개를 뽑는다.

import type {
  ContextSelection,
  Duration,
  Intensity,
  Quest,
} from "../types/quest";

const ALL_PLACES: Quest["places"] = ["indoor", "outdoor"];
const ALL_PARTIES: Quest["parties"] = ["alone", "together"];

export const QUESTS: Quest[] = [
  // ── 관찰 (observe) ──────────────────────────────
  {
    id: "observe-oldest-thing",
    title: "가장 오래돼 보이는 물건 찾기",
    description: "지금 주변에서 가장 오래돼 보이는 물건을 하나 찾아보세요.",
    category: "observe",
    places: ALL_PLACES,
    parties: ALL_PARTIES,
    durations: ["1m", "5m", "20m"],
    intensity: "light",
    costsMoney: false,
    requiresGoingOut: false,
  },
  {
    id: "observe-weird-sign",
    title: "가장 이상한 간판 찾기",
    description: "주변에서 가장 이상하거나 웃긴 간판을 하나 찾아보세요.",
    category: "observe",
    places: ["outdoor"],
    parties: ALL_PARTIES,
    durations: ["5m", "20m"],
    intensity: "light",
    costsMoney: false,
    requiresGoingOut: true,
  },
  {
    id: "observe-same-color",
    title: "같은 색 물건 5개 찾기",
    description: "지금 눈에 보이는 것 중 같은 색 물건 다섯 개를 찾아보세요.",
    category: "observe",
    places: ALL_PLACES,
    parties: ALL_PARTIES,
    durations: ["1m", "5m"],
    intensity: "light",
    costsMoney: false,
    requiresGoingOut: false,
  },

  // ── 탐험 (explore) ──────────────────────────────
  {
    id: "explore-unfamiliar-alley",
    title: "평소 가지 않던 방향으로 걷기",
    description:
      "평소 가지 않던 방향으로 10분간 걸은 뒤 가장 눈에 띄는 장소를 기록해보세요.",
    category: "explore",
    places: ["outdoor"],
    parties: ALL_PARTIES,
    durations: ["20m"],
    intensity: "bold",
    costsMoney: false,
    requiresGoingOut: true,
  },
  {
    id: "explore-other-entrance",
    title: "다른 출입구 사용하기",
    description: "평소와 다른 문이나 출입구로 나가거나 들어와 보세요.",
    category: "explore",
    places: ALL_PLACES,
    parties: ALL_PARTIES,
    durations: ["1m", "5m"],
    intensity: "medium",
    costsMoney: false,
    requiresGoingOut: false,
  },
  {
    id: "explore-unseen-space",
    title: "낯선 공간의 이상한 점 찾기",
    description:
      "평소 자세히 보지 않았던 공간을 하나 골라 이상한 점을 찾아보세요.",
    category: "explore",
    places: ALL_PLACES,
    parties: ALL_PARTIES,
    durations: ["5m", "20m"],
    intensity: "medium",
    costsMoney: false,
    requiresGoingOut: false,
  },

  // ── 감각 (sense) ────────────────────────────────
  {
    id: "sense-three-sounds",
    title: "주변 소리 세 가지 구분하기",
    description: "눈을 감고 지금 들리는 소리를 세 가지로 구분해보세요.",
    category: "sense",
    places: ALL_PLACES,
    parties: ALL_PARTIES,
    durations: ["1m", "5m"],
    intensity: "light",
    costsMoney: false,
    requiresGoingOut: false,
  },
  {
    id: "sense-one-song",
    title: "노래 한 곡을 아무것도 하지 않고 듣기",
    description: "노래 한 곡을 다른 것 없이 처음부터 끝까지 들어보세요.",
    category: "sense",
    places: ALL_PLACES,
    parties: ["alone"],
    durations: ["5m"],
    intensity: "light",
    costsMoney: false,
    requiresGoingOut: false,
  },
  {
    id: "sense-new-drink",
    title: "처음 보는 음료 맛보기",
    description: "평소 마시지 않던 음료를 하나 골라 맛보세요.",
    category: "sense",
    places: ["outdoor"],
    parties: ALL_PARTIES,
    durations: ["20m"],
    intensity: "medium",
    costsMoney: true,
    requiresGoingOut: true,
  },

  // ── 정리 (tidy) ─────────────────────────────────
  {
    id: "tidy-throw-one",
    title: "물건 하나 버리기",
    description: "지금 필요 없는 물건 하나를 골라 버려보세요.",
    category: "tidy",
    places: ["indoor"],
    parties: ALL_PARTIES,
    durations: ["1m", "5m"],
    intensity: "light",
    costsMoney: false,
    requiresGoingOut: false,
  },
  {
    id: "tidy-delete-app",
    title: "사용하지 않는 앱 하나 삭제하기",
    description: "한동안 열지 않은 앱을 하나 골라 삭제해보세요.",
    category: "tidy",
    places: ALL_PLACES,
    parties: ALL_PARTIES,
    durations: ["1m"],
    intensity: "light",
    costsMoney: false,
    requiresGoingOut: false,
  },
  {
    id: "tidy-mystery-sauce",
    title: "냉장고의 정체불명 소스 확인하기",
    description: "냉장고에서 정체를 알기 어려운 것을 하나 찾아 확인해보세요.",
    category: "tidy",
    places: ["indoor"],
    parties: ALL_PARTIES,
    durations: ["5m"],
    intensity: "light",
    costsMoney: false,
    requiresGoingOut: false,
  },

  // ── 관계 (relation) ─────────────────────────────
  {
    id: "relation-thanks",
    title: "구체적인 감사 한마디 전하기",
    description: "누군가에게 구체적인 이유를 담아 감사 한마디를 전해보세요.",
    category: "relation",
    places: ALL_PLACES,
    parties: ALL_PARTIES,
    durations: ["1m", "5m"],
    intensity: "medium",
    costsMoney: false,
    requiresGoingOut: false,
  },
  {
    id: "relation-old-contact",
    title: "오랫동안 연락하지 않은 사람 떠올리기",
    description:
      "오랫동안 연락하지 않은 사람 한 명을 떠올리고, 원한다면 안부를 전해보세요.",
    category: "relation",
    places: ALL_PLACES,
    parties: ["alone"],
    durations: ["5m"],
    intensity: "medium",
    costsMoney: false,
    requiresGoingOut: false,
  },
  {
    id: "relation-send-photo",
    title: "상대방에게 사진 한 장 보내기",
    description: "지금 눈앞의 무언가를 찍어 누군가에게 보내보세요.",
    category: "relation",
    places: ALL_PLACES,
    parties: ALL_PARTIES,
    durations: ["1m"],
    intensity: "light",
    costsMoney: false,
    requiresGoingOut: false,
  },

  // ── 창작 (create) ───────────────────────────────
  {
    id: "create-title-of-today",
    title: "오늘 하루의 제목 짓기",
    description: "오늘 하루를 영화라고 생각하고 제목을 하나 지어보세요.",
    category: "create",
    places: ALL_PLACES,
    parties: ALL_PARTIES,
    durations: ["1m", "5m"],
    intensity: "light",
    costsMoney: false,
    requiresGoingOut: false,
  },
  {
    id: "create-face-from-objects",
    title: "주변 사물로 얼굴 만들기",
    description: "주변 사물을 배치해 얼굴 모양을 하나 만들어보세요.",
    category: "create",
    places: ALL_PLACES,
    parties: ALL_PARTIES,
    durations: ["5m"],
    intensity: "light",
    costsMoney: false,
    requiresGoingOut: false,
  },
  {
    id: "create-three-sentence-story",
    title: "세 문장짜리 이야기 쓰기",
    description: "지금 상황을 소재로 세 문장짜리 짧은 이야기를 써보세요.",
    category: "create",
    places: ALL_PLACES,
    parties: ["alone"],
    durations: ["5m", "20m"],
    intensity: "medium",
    costsMoney: false,
    requiresGoingOut: false,
  },

  // ── 회상 (recall) ───────────────────────────────
  {
    id: "recall-oldest-photo",
    title: "가장 오래된 사진 찾기",
    description: "휴대폰이나 앨범에서 가장 오래된 사진을 찾아보세요.",
    category: "recall",
    places: ALL_PLACES,
    parties: ALL_PARTIES,
    durations: ["5m"],
    intensity: "light",
    costsMoney: false,
    requiresGoingOut: false,
  },
  {
    id: "recall-school-music",
    title: "학창 시절 좋아했던 음악 듣기",
    description: "학창 시절 자주 듣던 노래를 하나 찾아 들어보세요.",
    category: "recall",
    places: ALL_PLACES,
    parties: ["alone"],
    durations: ["5m"],
    intensity: "light",
    costsMoney: false,
    requiresGoingOut: false,
  },
  {
    id: "recall-old-neighborhood",
    title: "오래전 살던 동네 지도 보기",
    description: "예전에 살던 동네를 지도로 찾아보며 기억을 떠올려보세요.",
    category: "recall",
    places: ALL_PLACES,
    parties: ALL_PARTIES,
    durations: ["5m", "20m"],
    intensity: "light",
    costsMoney: false,
    requiresGoingOut: false,
  },

  // ── 용기 (courage) ──────────────────────────────
  {
    id: "courage-new-menu",
    title: "평소 주문하지 않던 메뉴 선택하기",
    description: "늘 고르던 것 대신 한 번도 시켜보지 않은 메뉴를 골라보세요.",
    category: "courage",
    places: ["outdoor"],
    parties: ALL_PARTIES,
    durations: ["20m"],
    intensity: "bold",
    costsMoney: true,
    requiresGoingOut: true,
  },
  {
    id: "courage-short-call",
    title: "미뤄둔 짧은 전화 걸기",
    description: "미뤄두었던 짧은 전화를 한 통 걸어보세요.",
    category: "courage",
    places: ALL_PLACES,
    parties: ["alone"],
    durations: ["5m"],
    intensity: "bold",
    costsMoney: false,
    requiresGoingOut: false,
  },
  {
    id: "courage-ask-question",
    title: "궁금했던 것을 직접 질문하기",
    description: "평소 궁금했지만 묻지 못했던 것을 누군가에게 직접 물어보세요.",
    category: "courage",
    places: ALL_PLACES,
    parties: ["together"],
    durations: ["1m", "5m"],
    intensity: "bold",
    costsMoney: false,
    requiresGoingOut: false,
  },
];

export function getQuestById(id: string): Quest | undefined {
  return QUESTS.find((q) => q.id === id);
}

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

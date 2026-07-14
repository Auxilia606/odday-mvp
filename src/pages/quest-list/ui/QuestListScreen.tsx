// 퀘스트 후보 화면. (MVP 문서 섹션 10.2)

import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Screen } from "@/shared/ui/Screen";
import { Tag } from "@/shared/ui/Tag";
import { CATEGORY_LABELS, INTENSITY_LABELS, type Quest } from "@/entities/quest";

export function QuestListScreen({
  candidates,
  onSelect,
  onReshuffle,
}: {
  candidates: Quest[];
  onSelect: (quest: Quest) => void;
  onReshuffle: () => void;
}) {
  return (
    <Screen label="오늘의 추천" progress={2}
      footer={
        <Button variant="secondary" onClick={onReshuffle}>
          다른 퀘스트 보기
        </Button>
      }
    >
      <div className="mb-4 self-start rounded-full bg-odday-accent/10 px-3 py-1.5 text-xs font-semibold text-odday-accent">
        <span aria-hidden>● </span>지금 상황에 맞춰 골랐어요
      </div>
      <h2 className="mb-1 text-[1.75rem] font-extrabold tracking-tight">
        오늘의 Odday를 골라보세요.
      </h2>
      <p className="mb-6 text-sm text-odday-muted">
        마음에 드는 걸 하나 고르거나, 새로 받아볼 수 있어요.
      </p>

      <div className="space-y-3">
        {candidates.map((quest, index) => (
          <Card
            key={quest.id}
            onClick={() => onSelect(quest)}
            className="relative overflow-hidden"
          >
            <span
              aria-hidden
              className="absolute right-4 top-4 text-4xl font-black text-white/[.035]"
            >
              0{index + 1}
            </span>
            <div className="mb-2 flex flex-wrap gap-1.5">
              <Tag>{CATEGORY_LABELS[quest.category]}</Tag>
              <Tag>{INTENSITY_LABELS[quest.intensity]}</Tag>
              {quest.costsMoney && <Tag>소액 지출</Tag>}
              {quest.requiresGoingOut && <Tag>외출</Tag>}
            </div>
            <h3 className="text-lg font-semibold">{quest.title}</h3>
            <p className="mt-1 text-sm text-odday-muted">{quest.description}</p>
          </Card>
        ))}
      </div>
    </Screen>
  );
}

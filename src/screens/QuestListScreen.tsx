// 퀘스트 후보 화면. (MVP 문서 섹션 10.2)

import { Button, Card, Screen, Tag } from "../components/ui";
import {
  CATEGORY_LABELS,
  INTENSITY_LABELS,
  type Quest,
} from "../types/quest";

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
    <Screen
      footer={
        <Button variant="secondary" onClick={onReshuffle}>
          다른 퀘스트 보기
        </Button>
      }
    >
      <h2 className="mb-1 text-2xl font-bold">오늘의 Odday를 골라보세요.</h2>
      <p className="mb-6 text-sm text-odday-muted">
        마음에 드는 걸 하나 고르거나, 새로 받아볼 수 있어요.
      </p>

      <div className="space-y-3">
        {candidates.map((quest) => (
          <Card key={quest.id} onClick={() => onSelect(quest)}>
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

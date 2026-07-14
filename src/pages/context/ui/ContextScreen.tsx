// 상황 선택 화면. (MVP 문서 섹션 10.1)

import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { OptionGroup } from "@/shared/ui/OptionGroup";
import { Screen } from "@/shared/ui/Screen";
import type { ContextSelection, Duration, Party, Place } from "@/entities/quest";

export function ContextScreen({
  onSubmit,
}: {
  onSubmit: (ctx: ContextSelection) => void;
}) {
  const [place, setPlace] = useState<Place | null>(null);
  const [party, setParty] = useState<Party | null>(null);
  const [duration, setDuration] = useState<Duration | null>(null);

  const ready = place && party && duration;

  return (
    <Screen
      footer={
        <Button
          disabled={!ready}
          onClick={() =>
            ready &&
            onSubmit({ place: place!, party: party!, duration: duration! })
          }
        >
          퀘스트 받아보기
        </Button>
      }
    >
      <h2 className="mb-1 text-2xl font-bold">지금 상황은 어떤가요?</h2>
      <p className="mb-8 text-sm text-odday-muted">
        딱 맞는 Odday를 골라드릴게요.
      </p>

      <OptionGroup<Place>
        label="지금 어디에 있나요?"
        value={place}
        onChange={setPlace}
        options={[
          { value: "indoor", label: "실내" },
          { value: "outdoor", label: "실외" },
        ]}
      />

      <OptionGroup<Party>
        label="누구와 있나요?"
        value={party}
        onChange={setParty}
        options={[
          { value: "alone", label: "혼자" },
          { value: "together", label: "함께" },
        ]}
      />

      <OptionGroup<Duration>
        label="시간은 얼마나 있나요?"
        value={duration}
        onChange={setDuration}
        options={[
          { value: "1m", label: "1분" },
          { value: "5m", label: "5분" },
          { value: "20m", label: "20분" },
        ]}
      />
    </Screen>
  );
}

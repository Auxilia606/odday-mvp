// 단일 선택 옵션 그룹.

export function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-sm text-odday-muted">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={[
              "touch-manipulation rounded-xl border px-3 py-3.5 text-sm font-medium transition active:scale-[0.97]",
              value === opt.value
                ? "border-odday-accent bg-odday-accent/15 text-white"
                : "border-odday-border bg-odday-surface text-odday-muted hover:text-white",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { BiasType } from "@prisma/client";
import { BIAS_TYPES, BIAS_TYPE_LABELS } from "@/lib/constants";

type BiasTagSelectorProps = {
  value: BiasType[];
  onChange: (next: BiasType[]) => void;
  disabled?: boolean;
};

// Multi-select clickable tags for bias types.
export function BiasTagSelector({
  value,
  onChange,
  disabled,
}: BiasTagSelectorProps) {
  function toggle(tag: BiasType) {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Types de biais">
      {BIAS_TYPES.map((tag) => {
        const selected = value.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            onClick={() => toggle(tag)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors disabled:opacity-50 ${
              selected
                ? "border-brand bg-brand text-white"
                : "border-gray-300 bg-white text-gray-700 hover:border-brand hover:text-brand"
            }`}
          >
            {BIAS_TYPE_LABELS[tag]}
          </button>
        );
      })}
    </div>
  );
}

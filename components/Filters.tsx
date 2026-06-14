"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  BIAS_TYPES,
  BIAS_TYPE_LABELS,
  DOMAINS,
  DOMAIN_LABELS,
  PUBLIC_STATUSES,
  STATUS_LABELS,
} from "@/lib/constants";

// Filter bar for /reports. Drives the URL query string (server reads it).
export function Filters() {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page"); // reset pagination on any filter change
    router.push(`/reports?${next.toString()}`);
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Select
        label="Domaine"
        value={params.get("domain") ?? ""}
        onChange={(v) => update("domain", v)}
        options={DOMAINS.map((d) => ({ value: d, label: DOMAIN_LABELS[d] }))}
      />
      <Select
        label="Type de biais"
        value={params.get("biasType") ?? ""}
        onChange={(v) => update("biasType", v)}
        options={BIAS_TYPES.map((b) => ({ value: b, label: BIAS_TYPE_LABELS[b] }))}
      />
      <Select
        label="Statut"
        value={params.get("status") ?? ""}
        onChange={(v) => update("status", v)}
        options={PUBLIC_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
      />
    </div>
  );
}

type SelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
};

function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <label className="block text-sm">
      <span className="text-gray-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:ring-brand"
      >
        <option value="">Tous</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

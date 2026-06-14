import { Domain } from "@prisma/client";
import { DOMAIN_COLORS, DOMAIN_LABELS } from "@/lib/constants";

// Color-coded badge for a report's domain.
export function DomainBadge({ domain }: { domain: Domain }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${DOMAIN_COLORS[domain]}`}
    >
      {DOMAIN_LABELS[domain]}
    </span>
  );
}

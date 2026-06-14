import { ReportStatus } from "@prisma/client";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";

// Badge reflecting a report's moderation status.
export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

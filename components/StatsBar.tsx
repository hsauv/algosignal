// Three key metrics shown on the landing page.
type StatsBarProps = {
  totalReports: number;
  systemsIdentified: number;
  domainsCovered: number;
};

const items = [
  { key: "totalReports", label: "Signalements" },
  { key: "systemsIdentified", label: "Systèmes identifiés" },
  { key: "domainsCovered", label: "Domaines couverts" },
] as const;

export function StatsBar(props: StatsBarProps) {
  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map(({ key, label }) => (
        <div
          key={key}
          className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
        >
          <dt className="text-sm font-medium text-gray-500">{label}</dt>
          <dd className="mt-2 text-3xl font-bold text-brand">{props[key]}</dd>
        </div>
      ))}
    </dl>
  );
}

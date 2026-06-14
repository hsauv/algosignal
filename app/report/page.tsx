import { ReportForm } from "@/components/ReportForm";
import { issueFormToken } from "@/lib/form-token";

// Rendered per-request so the anti-spam token carries a fresh timestamp.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Faire un signalement — AlgoSignal",
};

export default function ReportPage() {
  const formToken = issueFormToken();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Signaler un biais</h1>
      <p className="mt-2 text-gray-600">
        Décrivez une situation où un système d'IA a produit, selon vous, un
        résultat biaisé ou discriminatoire. Le signalement est anonyme par
        défaut.
      </p>

      <div className="mt-8">
        <ReportForm formToken={formToken} />
      </div>
    </div>
  );
}

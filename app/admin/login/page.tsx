"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Connexion impossible.");
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold text-gray-900">Espace modération</h1>
      <p className="mt-2 text-sm text-gray-600">
        Saisissez le mot de passe de modération pour accéder au tableau de bord.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:ring-brand"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-brand px-4 py-2.5 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

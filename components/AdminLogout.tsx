"use client";

import { useRouter } from "next/navigation";

// Logs the moderator out by clearing the admin cookie.
export function AdminLogout() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="text-sm text-gray-500 hover:text-brand"
    >
      Se déconnecter
    </button>
  );
}

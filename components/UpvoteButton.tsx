"use client";

import { useState } from "react";

type UpvoteButtonProps = {
  reportId: string;
  initialUpvotes: number;
  initialVoted?: boolean;
};

// Optimistic upvote button. Server-side dedup lives in an httpOnly cookie; the
// initial voted state is read from it server-side and passed in here.
export function UpvoteButton({
  reportId,
  initialUpvotes,
  initialVoted = false,
}: UpvoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [voted, setVoted] = useState(initialVoted);
  const [pending, setPending] = useState(false);

  async function handleVote() {
    if (voted || pending) return;
    setPending(true);
    setUpvotes((n) => n + 1); // optimistic
    setVoted(true);

    try {
      const res = await fetch(`/api/reports/${reportId}/upvote`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("vote failed");
      const data = await res.json();
      setUpvotes(data.upvotes); // reconcile with server value
    } catch {
      // Roll back on failure.
      setUpvotes((n) => n - 1);
      setVoted(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleVote}
      disabled={voted || pending}
      aria-label="Soutenir ce signalement"
      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
        voted
          ? "border-brand bg-brand-light text-brand"
          : "border-gray-300 bg-white text-gray-700 hover:border-brand hover:text-brand"
      } disabled:opacity-70`}
    >
      ▲ <span>{upvotes}</span>
      <span className="text-gray-400">·</span>
      <span>{voted ? "Soutenu" : "Soutenir"}</span>
    </button>
  );
}

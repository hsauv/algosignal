import Link from "next/link";

// Global navigation header.
export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-brand">
          IA au féminin
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/reports" className="text-gray-600 hover:text-brand">
            Signalements
          </Link>
          <Link
            href="/report"
            className="rounded-lg bg-brand px-3 py-1.5 font-medium text-white hover:bg-brand-dark"
          >
            Signaler
          </Link>
        </nav>
      </div>
    </header>
  );
}

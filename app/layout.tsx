import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlgoSignal — Signaler les biais algorithmiques",
  description:
    "Plateforme citoyenne de signalement des biais et discriminations produits par les systèmes d'IA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-gray-400">
            <p>AlgoSignal — plateforme citoyenne contre les biais algorithmiques.</p>
            <p className="mt-2 space-x-3">
              <Link href="/confidentialite" className="hover:text-brand">
                Confidentialité
              </Link>
              <Link href="/mentions-legales" className="hover:text-brand">
                Mentions légales
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

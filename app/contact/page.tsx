import { ContactForm } from "@/components/ContactForm";
import { issueFormToken } from "@/lib/form-token";
import { CONTACT_EMAIL } from "@/lib/constants";

// Rendered per-request so the anti-spam token carries a fresh timestamp.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact — IA au féminin",
};

export default function ContactPage() {
  const formToken = issueFormToken();

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">
        Nous contacter
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">Écrivez-nous</h1>
      <p className="mt-3 text-gray-600">
        Une question, l'envie d'organiser un atelier, de soutenir l'association ou
        de collaborer&nbsp;? Utilisez le formulaire ci-dessous — ou écrivez
        directement à{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <div className="mt-8">
        <ContactForm formToken={formToken} />
      </div>
    </div>
  );
}

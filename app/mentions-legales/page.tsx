import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata = {
  title: "Mentions légales — IA au féminin",
};

// NOTE: have this reviewed before relying on it.
export default function LegalNoticePage() {
  return (
    <article className="prose mx-auto max-w-2xl text-gray-800">
      <h1 className="text-2xl font-bold text-gray-900">Mentions légales</h1>

      <h2 className="mt-6 text-lg font-semibold">Éditeur</h2>
      <p className="mt-2">
        Site édité par l'association <strong>IA au féminin</strong>, représentée
        par Hanen Mizouni. Contact :{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand underline">
          {CONTACT_EMAIL}
        </a>
        . Responsable de la publication : Hanen Mizouni.
      </p>

      <h2 className="mt-6 text-lg font-semibold">Hébergement</h2>
      <p className="mt-2">
        Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis —
        exécution configurée en région européenne (Paris). Base de données
        hébergée dans l'Union européenne.
      </p>

      <h2 className="mt-6 text-lg font-semibold">
        Statut et responsabilité éditoriale
      </h2>
      <p className="mt-2">
        IA au féminin héberge des témoignages publiés par ses utilisateur·rice·s. Les
        signalements sont mis en ligne <strong>sans validation préalable</strong>
        {" "}
        et n'engagent que leurs auteur·rice·s. Conformément à la loi pour la
        confiance dans l'économie numérique (LCEN, 2004), l'éditeur agit en qualité
        d'<strong>hébergeur</strong> et ne saurait être tenu responsable des
        contenus avant leur signalement.
      </p>

      <h2 className="mt-6 text-lg font-semibold">
        Signalement de contenu illicite
      </h2>
      <p className="mt-2">
        Tout contenu manifestement illicite (diffamation, atteinte à la vie
        privée, etc.) peut être signalé via le lien « Signaler ce contenu »
        présent sur chaque signalement, ou par e-mail à{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand underline">
          {CONTACT_EMAIL}
        </a>
        . Tout contenu manifestement illicite porté à notre connaissance est
        retiré <strong>promptement</strong>.
      </p>
    </article>
  );
}

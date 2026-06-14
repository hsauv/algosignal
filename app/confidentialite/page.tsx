import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata = {
  title: "Politique de confidentialité — AlgoSignal",
};

// NOTE: legal template. Replace the {{...}} placeholders with your real details
// and have it reviewed before launch (RGPD compliance is your responsibility).
export default function PrivacyPolicyPage() {
  return (
    <article className="prose mx-auto max-w-2xl text-gray-800">
      <h1 className="text-2xl font-bold text-gray-900">
        Politique de confidentialité
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Dernière mise à jour : {"{{date}}"}
      </p>

      <h2 className="mt-6 text-lg font-semibold">Responsable de traitement</h2>
      <p className="mt-2">
        Le responsable du traitement des données est{" "}
        <strong>{"{{nom du responsable / association}}"}</strong>,
        {" "}
        {"{{adresse}}"}, joignable à{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <h2 className="mt-6 text-lg font-semibold">Données collectées</h2>
      <p className="mt-2">
        AlgoSignal applique le principe de <strong>minimisation des données</strong>.
        Un signalement ne contient que : le domaine concerné, le nom du système
        d'IA, le ou les types de biais, la description rédigée par l'auteur·rice,
        et éventuellement un lien ou une description de preuve.
      </p>
      <p className="mt-2">
        <strong>Aucun compte n'est requis.</strong> Nous ne collectons ni nom, ni
        adresse e-mail, ni adresse IP des personnes qui déposent un signalement ou
        un commentaire. Les signalements sont publiés de manière anonyme.
      </p>
      <p className="mt-2">
        ⚠️ Les descriptions étant rédigées librement, elles peuvent contenir des
        <strong> données sensibles</strong> (santé, origine, handicap…). Nous
        invitons les auteur·rice·s à ne mentionner que les informations
        strictement nécessaires et à ne pas divulguer l'identité de tiers.
      </p>

      <h2 className="mt-6 text-lg font-semibold">Base légale</h2>
      <p className="mt-2">
        Le traitement repose sur votre <strong>consentement explicite</strong>,
        recueilli au moment du dépôt du signalement (article 6.1.a et, le cas
        échéant, article 9.2.a du RGPD pour les données sensibles).
      </p>

      <h2 className="mt-6 text-lg font-semibold">Durée de conservation</h2>
      <p className="mt-2">
        Les signalements sont conservés tant qu'ils restent pertinents pour la
        mission d'intérêt public de la plateforme, ou jusqu'à leur suppression par
        l'auteur·rice. {"{{préciser une durée maximale, ex. 3 ans}}"}
      </p>

      <h2 className="mt-6 text-lg font-semibold">Vos droits</h2>
      <p className="mt-2">
        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification,
        d'opposition et d'<strong>effacement</strong>. Un{" "}
        <strong>lien de suppression</strong> vous est fourni au moment du dépôt :
        il vous permet d'effacer vous-même votre signalement à tout moment. Pour
        toute autre demande, écrivez à{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand underline">
          {CONTACT_EMAIL}
        </a>
        . Vous pouvez également introduire une réclamation auprès de la CNIL.
      </p>

      <h2 className="mt-6 text-lg font-semibold">Hébergement</h2>
      <p className="mt-2">
        L'application est hébergée par Vercel, avec exécution configurée en région
        européenne (Paris). La base de données est hébergée dans l'Union
        européenne ({"{{préciser le prestataire et la région}}"}).
      </p>
    </article>
  );
}

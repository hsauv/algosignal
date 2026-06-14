// ---------------------------------------------------------------------------
// Contenu éditorial de la page « Comprendre les biais algorithmiques ».
// 👉 Pour gérer le contenu : modifie simplement les textes ci-dessous.
//    La mise en page s'adapte automatiquement.
//
// NB : les faits cités s'appuient sur des travaux connus ; vérifie / source-les
//      selon tes besoins avant diffusion large.
// ---------------------------------------------------------------------------

export const COMPRENDRE_INTRO =
  "Un biais algorithmique, c'est lorsqu'un système d'IA produit des résultats injustes pour certaines personnes — souvent les femmes et les minorités. Ce n'est pas de la science-fiction : ça arrive déjà, dans des décisions qui changent des vies.";

// Comment le biais apparaît.
export const BIAS_CAUSES = [
  {
    icon: "📊",
    title: "Des données du passé",
    body: "L'IA apprend sur des données historiques. Si elles reflètent des discriminations passées, l'IA les reproduit — et peut les amplifier.",
  },
  {
    icon: "🎯",
    title: "Des objectifs mal pensés",
    body: "Optimiser un seul critère (rapidité, rentabilité) peut désavantager certains groupes, sans que personne ne l'ait voulu.",
  },
  {
    icon: "👥",
    title: "Un manque de diversité",
    body: "Conçus par des équipes peu diverses, ces outils oublient des profils entiers : accents, morphologies, parcours de vie.",
  },
  {
    icon: "🕳️",
    title: "L'opacité",
    body: "Beaucoup de décisions automatisées sont impossibles à expliquer ou à contester. On les subit sans comprendre.",
  },
];

// « Le saviez-vous ? » — faits marquants (qualitatifs, attribués).
export const BIAS_FACTS = [
  {
    label: "Reconnaissance faciale",
    body: "Des travaux du MIT (2018) ont montré que certains systèmes identifient bien moins les femmes à la peau foncée que les hommes à la peau claire.",
  },
  {
    label: "Recrutement",
    body: "Des outils de tri de candidatures ont été abandonnés après avoir systématiquement désavantagé les femmes.",
  },
  {
    label: "Santé",
    body: "Une étude publiée dans Science (2019) a montré qu'un algorithme de santé sous-estimait les besoins de patients de certaines origines.",
  },
];

// Domaines concrets touchés.
export const BIAS_DOMAINS = [
  { label: "Emploi", example: "Des candidatures écartées à cause d'un prénom, d'un genre ou d'un âge." },
  { label: "Crédit", example: "Des scores plus bas selon le quartier ou le profil, à situation égale." },
  { label: "Santé", example: "Des symptômes minimisés pour certaines personnes." },
  { label: "Justice", example: "Des scores de « risque » qui pénalisent certains groupes." },
  { label: "Logement", example: "Des annonces ou des dossiers filtrés de façon discriminante." },
  { label: "Éducation", example: "Des copies ou des élèves mal évalués par des automatismes." },
];

// Que faire ?
export const BIAS_ACTIONS = [
  {
    title: "S'informer",
    body: "Comprendre comment l'IA décide, c'est déjà reprendre du pouvoir. Participez à nos ateliers de vulgarisation.",
  },
  {
    title: "Signaler",
    body: "Vous avez vécu une décision injuste ? Témoignez sur AlgoSignal, de façon anonyme.",
  },
  {
    title: "Demander des comptes",
    body: "Le RGPD (article 22) encadre les décisions automatisées : vous avez droit à une explication et à une intervention humaine.",
  },
];

// Pour aller plus loin.
export const BIAS_RESOURCES = [
  { label: "CNIL — Intelligence artificielle", href: "https://www.cnil.fr" },
  { label: "Défenseur des droits — Discriminations", href: "https://www.defenseurdesdroits.fr" },
];

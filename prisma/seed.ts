import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Launch seed: anonymised, illustrative lived experiences centred on people who
// are often made invisible by algorithms — women and minorities in particular.
// System names are kept generic on purpose (no real companies named) so these
// demo entries carry no defamation risk. Replace them with real submissions
// over time.
// ---------------------------------------------------------------------------
async function main() {
  const now = new Date();

  await prisma.report.createMany({
    data: [
      {
        domain: "EMPLOYMENT",
        systemName: "Application de recrutement (tri automatique)",
        biasTypes: ["GENDER"],
        description:
          "Sur une appli de recherche d'emploi, on me propose surtout des postes d'assistanat alors que mon collègue, à profil et diplôme équivalents, reçoit des offres de management et de postes techniques. J'ai l'impression que l'algorithme me range d'office.",
        anonymous: true,
        status: "VERIFIED",
        upvotes: 58,
        consentedAt: now,
      },
      {
        domain: "CREDIT",
        systemName: "Scoring de crédit automatisé",
        biasTypes: ["GENDER"],
        description:
          "Mon conjoint et moi avons demandé une carte de crédit. Je gagne plus que lui, mais on m'a accordé une limite bien plus basse, sans explication. Le conseiller m'a dit que « c'est l'algorithme qui décide ».",
        anonymous: true,
        status: "VERIFIED",
        upvotes: 71,
        consentedAt: now,
      },
      {
        domain: "EMPLOYMENT",
        systemName: "Filtre automatique de CV",
        biasTypes: ["ETHNICITY"],
        description:
          "J'ai envoyé deux fois le même CV pour des offres similaires, une fois avec mon vrai prénom et une fois avec un prénom à consonance française. Je n'ai été rappelée que pour la seconde version. Le tri semble se faire sur le nom.",
        anonymous: true,
        status: "PUBLISHED",
        upvotes: 44,
        consentedAt: now,
      },
      {
        domain: "OTHER",
        systemName: "Vérification d'identité par reconnaissance faciale",
        biasTypes: ["ETHNICITY"],
        description:
          "Une application bancaire m'a bloquée à l'étape de vérification : le système ne « reconnaissait » pas mon visage. Une amie à la peau plus claire n'a eu aucun problème avec la même appli. Je me suis sentie effacée.",
        anonymous: true,
        status: "VERIFIED",
        upvotes: 63,
        consentedAt: now,
      },
      {
        domain: "HEALTHCARE",
        systemName: "Chatbot d'orientation de symptômes",
        biasTypes: ["GENDER"],
        description:
          "J'ai décrit de fortes douleurs à un assistant médical en ligne. Il a conclu à du « stress » et de l'« anxiété » et m'a conseillé du repos. Une amie a décrit les mêmes symptômes en se présentant comme un homme : on lui a recommandé une consultation urgente.",
        anonymous: true,
        status: "PUBLISHED",
        upvotes: 39,
        consentedAt: now,
      },
      {
        domain: "OTHER",
        systemName: "Assistant vocal / reconnaissance de la parole",
        biasTypes: ["LANGUAGE"],
        description:
          "L'assistant vocal de mon téléphone ne comprend quasiment jamais ce que je dis à cause de mon accent. Je dois répéter trois fois ou abandonner. Des proches sans accent régional n'ont jamais ce souci.",
        anonymous: true,
        status: "PUBLISHED",
        upvotes: 27,
        consentedAt: now,
      },
      {
        domain: "OTHER",
        systemName: "Outil de traduction automatique",
        biasTypes: ["GENDER"],
        description:
          "Quand je traduis des phrases neutres, l'outil met « il » pour « médecin » ou « ingénieur » et « elle » pour « infirmière » ou « secrétaire ». Il reproduit et renforce les clichés sur les métiers.",
        anonymous: true,
        status: "PUBLISHED",
        upvotes: 33,
        consentedAt: now,
      },
      {
        domain: "EDUCATION",
        systemName: "Logiciel de surveillance d'examen à distance",
        biasTypes: ["DISABILITY"],
        description:
          "À cause de mouvements liés à mon handicap, le logiciel de télésurveillance d'examen m'a signalée plusieurs fois pour « comportement suspect ». J'ai dû me justifier comme si je trichais.",
        anonymous: true,
        status: "VERIFIED",
        upvotes: 49,
        consentedAt: now,
      },
      {
        domain: "HOUSING",
        systemName: "Plateforme de mise en relation locative",
        biasTypes: ["ETHNICITY", "GEOGRAPHY"],
        description:
          "Sur une plateforme de location, mes demandes restaient sans réponse. En changeant mon nom et le quartier indiqué dans mon profil, j'ai soudain reçu des réponses. Le tri des candidatures paraît discriminant.",
        anonymous: true,
        status: "PUBLISHED",
        upvotes: 41,
        consentedAt: now,
      },
      {
        domain: "OTHER",
        systemName: "Modération automatique de réseau social",
        biasTypes: ["GENDER"],
        description:
          "Mes publications dénonçant du harcèlement ont été masquées ou supprimées automatiquement, tandis que les messages qui m'insultaient restaient en ligne. La modération automatique semble se retourner contre les victimes.",
        anonymous: true,
        status: "PUBLISHED",
        upvotes: 52,
        consentedAt: now,
      },
      {
        domain: "EMPLOYMENT",
        systemName: "Ciblage automatique d'offres d'emploi",
        biasTypes: ["AGE"],
        description:
          "À plus de 50 ans, je ne vois quasiment plus passer d'offres d'emploi en ligne. Des candidats plus jeunes, dans mon secteur, en reçoivent énormément. Le ciblage publicitaire semble m'écarter à cause de mon âge.",
        anonymous: true,
        status: "PUBLISHED",
        upvotes: 36,
        consentedAt: now,
      },
      {
        domain: "OTHER",
        systemName: "Filtre photo / « score de beauté »",
        biasTypes: ["ETHNICITY"],
        description:
          "Une appli de retouche éclaircit systématiquement ma peau et « corrige » mes traits. Sa fonction de note esthétique attribue de meilleurs scores aux visages à la peau claire. C'est humiliant.",
        anonymous: true,
        status: "PUBLISHED",
        upvotes: 47,
        consentedAt: now,
      },
      {
        domain: "EDUCATION",
        systemName: "Correction automatique de copies",
        biasTypes: ["LANGUAGE"],
        description:
          "Un outil de notation automatique attribue de moins bonnes notes à mes rédactions parce que je n'écris pas dans un français « standard », alors que le fond est juste. Mes camarades non concernés ont de meilleures notes à contenu équivalent.",
        anonymous: true,
        status: "PUBLISHED",
        upvotes: 22,
        consentedAt: now,
      },
      {
        domain: "CREDIT",
        systemName: "Score de risque par code postal",
        biasTypes: ["GEOGRAPHY"],
        description:
          "Ma demande de financement a été refusée. En cherchant, j'ai compris que le score se basait en partie sur mon quartier. Des personnes avec des revenus similaires, mais habitant ailleurs, sont acceptées.",
        anonymous: true,
        status: "PUBLISHED",
        upvotes: 30,
        consentedAt: now,
      },
    ],
  });

  console.log("Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

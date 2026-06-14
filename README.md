# AlgoSignal

Plateforme citoyenne de signalement des **biais et discriminations algorithmiques**
produits par des systèmes d'IA (santé, emploi, crédit, justice, éducation,
logement, etc.).

> Les citoyen·ne·s peuvent signaler une situation où un système d'IA a produit
> un résultat qu'ils estiment biaisé ou discriminatoire — de manière **anonyme
> par défaut**.

---

## Stack technique

| Couche        | Technologie                          |
| ------------- | ------------------------------------ |
| Framework     | Next.js 14 (App Router) + TypeScript |
| Base de données | PostgreSQL (hébergée sur Railway)  |
| ORM           | Prisma                               |
| Validation    | Zod (client **et** serveur)          |
| Style         | Tailwind CSS (mobile-first)          |
| Modération    | Mot de passe unique (`/admin`)       |
| Déploiement   | Conteneur Docker (cloud souverain)   |

---

## Structure du projet

```
algosignal/
├── app/
│   ├── layout.tsx                # Layout global (header/footer)
│   ├── globals.css
│   ├── page.tsx                  # / — accueil : stats + derniers signalements
│   ├── report/page.tsx           # /report — formulaire de signalement
│   ├── reports/
│   │   ├── page.tsx              # /reports — liste paginée + filtres
│   │   └── [id]/page.tsx         # /reports/[id] — détail + upvote + commentaires
│   ├── admin/page.tsx            # /admin — file de modération (protégée)
│   ├── admin/login/page.tsx      # /admin/login — saisie du mot de passe
│   └── api/
│       ├── reports/route.ts                  # POST (créer) + GET (lister)
│       ├── reports/[id]/route.ts             # GET (détail)
│       ├── reports/[id]/upvote/route.ts      # PATCH (upvote)
│       ├── reports/[id]/comments/route.ts    # POST (commenter)
│       ├── admin/reports/[id]/route.ts       # PATCH (statut, modérateur)
│       └── admin/login/route.ts              # POST/DELETE (connexion modérateur)
├── components/                   # ReportCard, ReportForm, BiasTagSelector,
│                                 # DomainBadge, StatsBar, Filters, etc.
├── lib/
│   ├── prisma.ts                 # Singleton Prisma
│   ├── admin-auth.ts             # Garde par mot de passe unique (cookie HMAC)
│   ├── validations.ts            # Schémas Zod partagés
│   ├── constants.ts              # Libellés FR + couleurs des enums
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── .env.example
```

---

## Démarrage local

### 1. Prérequis

- Node.js 18.17+ (ou 20+)
- Une base PostgreSQL (locale ou Railway)

### 2. Installation

```bash
git clone <repo>
cd algosignal
npm install
```

### 3. Variables d'environnement

```bash
cp .env.example .env
```

Renseignez au minimum `DATABASE_URL`. Définissez aussi `ADMIN_PASSWORD` pour
protéger l'espace de modération `/admin` (un seul mot de passe, aucun compte
utilisateur).

Générez un secret :

```bash
openssl rand -base64 32
```

### 4. Base de données

```bash
# Crée les tables à partir du schéma
npm run db:push

# (Optionnel) jeu de données de démonstration
npm run db:seed
```

### 5. Lancer le serveur

```bash
npm run dev
```

Application disponible sur http://localhost:3000.

---

## Déploiement — Railway (base de données)

1. Créez un compte sur [railway.app](https://railway.app).
2. **New Project → Provision PostgreSQL**.
3. Dans l'onglet **Variables** du service Postgres, copiez la valeur de
   `DATABASE_URL` (format `postgresql://...`).
4. Appliquez le schéma à la base distante depuis votre machine :

   ```bash
   DATABASE_URL="<url-railway>" npm run db:push
   # et éventuellement :
   DATABASE_URL="<url-railway>" npm run db:seed
   ```

> 💡 Railway expose à la fois une URL privée et une URL publique. Pour les
> migrations depuis votre poste, utilisez l'URL **publique**.

---

## Déploiement — Vercel (application)

1. Poussez le dépôt sur GitHub / GitLab.
2. Sur [vercel.com](https://vercel.com) : **New Project → Import** le dépôt.
3. Framework détecté automatiquement : **Next.js**.
4. Dans **Settings → Environment Variables**, ajoutez :

   | Variable         | Valeur                                  |
   | ---------------- | --------------------------------------- |
   | `DATABASE_URL`   | URL PostgreSQL Railway                   |
   | `ADMIN_PASSWORD` | mot de passe d'accès à `/admin`          |

5. **Deploy**.

Le script `build` exécute `prisma generate` automatiquement avant `next build`,
le client Prisma est donc toujours à jour côté Vercel.

> Pour gérer les migrations en production de façon versionnée, utilisez
> `npx prisma migrate deploy` (au lieu de `db push`) dans votre pipeline.

---

## Déploiement — Cloud souverain (alternative à Vercel/Railway)

Vercel et Railway sont des sociétés américaines soumises au *CLOUD Act*. Comme
AlgoSignal traite des données potentiellement **sensibles** (origine ethnique,
santé… — catégories particulières au sens de l'art. 9 RGPD), un hébergement
**souverain européen** est recommandé.

L'application est conteneurisée (`Dockerfile`, sortie Next.js `standalone`),
donc portable sur n'importe quel cloud acceptant un conteneur OCI.

### Options recommandées

| Fournisseur            | Type        | Souveraineté            | Idéal pour                          |
| ---------------------- | ----------- | ----------------------- | ----------------------------------- |
| **Clever Cloud**       | PaaS (FR)   | UE, HDS possible        | Le plus simple (proche de Vercel)   |
| **Scaleway**           | Conteneurs + PG managé (FR) | UE          | Conteneurs serverless + DB managée  |
| **OVHcloud**           | VPS/PG managé (FR) | UE, **SecNumCloud** (offres dédiées) | Contrôle + qualification ANSSI |
| **Outscale / Numspot / S3NS** | IaaS (FR) | **SecNumCloud** | Secteur public / exigence maximale  |

> Pour un usage public sensible, visez une offre **qualifiée SecNumCloud**
> (ANSSI) et une **région UE**.

> 🇫🇷 **Cible retenue : 3DS Outscale (SecNumCloud).** Guide pas à pas dédié →
> [`docs/DEPLOY_OUTSCALE.md`](docs/DEPLOY_OUTSCALE.md). Fichiers associés :
> `docker-compose.prod.yml`, `Caddyfile`, `scripts/backup-db.sh`.

### A. Déploiement conteneur (Scaleway, OVHcloud, Clever Cloud…)

1. Provisionnez un **PostgreSQL managé** dans une région UE → récupérez son
   `DATABASE_URL`.
2. Construisez et poussez l'image vers le registre du fournisseur :

   ```bash
   docker build -t algosignal .
   docker tag algosignal <registry>/algosignal:latest
   docker push <registry>/algosignal:latest
   ```

3. Déployez l'image en définissant les variables d'environnement
   (`DATABASE_URL`, `ADMIN_PASSWORD`).

   Le conteneur applique automatiquement les migrations
   (`prisma migrate deploy`) **puis** démarre le serveur.

### B. VPS auto-hébergé (Docker Compose)

```bash
export POSTGRES_PASSWORD="..." ADMIN_PASSWORD="..."
docker compose up -d --build
```

Placez un reverse-proxy TLS (Caddy / Traefik / Nginx) devant le port 3000.

### Migrations en production

Le projet utilise désormais des **migrations versionnées**
(`prisma/migrations/`) au lieu de `db push`. La commande appliquée au
déploiement est :

```bash
npm run db:deploy   # = prisma migrate deploy
```

### Stockage des preuves (uploads)

Le champ `evidenceUrl` accepte aujourd'hui un **lien ou une description**. Pour
un véritable **upload de fichiers**, branchez un stockage objet **S3-compatible
souverain** (Scaleway Object Storage, OVHcloud Object Storage) plutôt qu'un
service US, et stockez l'URL résultante dans `evidenceUrl`.

---

## Modération (modèle à un seul modérateur)

- **Aucun compte utilisateur.** Les citoyens signalent et commentent toujours de
  manière **anonyme** (`userId` reste `null`).
- L'espace de modération `/admin` est protégé par un **mot de passe unique**
  (`ADMIN_PASSWORD`). Pas de NextAuth, pas de rôles.
- Connexion : page `/admin/login` → le mot de passe est échangé contre un cookie
  httpOnly (valeur = HMAC du mot de passe, voir `lib/admin-auth.ts`). Changer
  `ADMIN_PASSWORD` invalide les sessions existantes.
- Le tableau `/admin` et la route `PATCH /api/admin/reports/[id]` exigent ce
  cookie ; sinon redirection vers `/admin/login` (page) ou réponse `403` (API).
- Évolutivité : les colonnes `userId` sont conservées (nullables) pour ajouter
  des comptes par utilisateur plus tard si besoin.

---

## API

| Méthode | Route                          | Description                          | Accès        |
| ------- | ------------------------------ | ------------------------------------ | ------------ |
| `POST`  | `/api/reports`                 | Créer un signalement                 | Public       |
| `GET`   | `/api/reports`                 | Lister (filtres + pagination)        | Public       |
| `GET`   | `/api/reports/[id]`            | Détail d'un signalement              | Public       |
| `PATCH` | `/api/reports/[id]/upvote`     | Incrémenter les votes                | Public       |
| `POST`  | `/api/reports/[id]/comments`   | Ajouter un commentaire               | Public       |
| `PATCH` | `/api/admin/reports/[id]`      | Modifier le statut                   | Modérateur   |

Toutes les routes valident leurs entrées avec **Zod** et renvoient des messages
d'erreur en français.

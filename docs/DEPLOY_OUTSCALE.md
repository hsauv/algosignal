# Déploiement sur 3DS Outscale (SecNumCloud)

Outscale est un IaaS **qualifié SecNumCloud** (ANSSI), adapté à AlgoSignal qui
traite des données potentiellement sensibles (art. 9 RGPD). Outscale ne propose
pas de PaaS ni de PostgreSQL managé : on déploie l'application **conteneurisée
sur une VM**, avec **OOS** (stockage objet S3-compatible) pour les sauvegardes
et, à terme, les preuves uploadées.

- **Région recommandée :** `cloudgouv-eu-west-1` (région SecNumCloud, France).
- **Modèle de déploiement :** 1 VM Linux + Docker Compose (`caddy` + `web` + `db`).
- **Console :** Cockpit (`https://cockpit.outscale.com`).

> Pour une montée en charge ultérieure : base sur une VM dédiée + réplication,
> ou orchestration via OKS (Outscale Kubernetes Service). Hors périmètre ici.

---

## Vue d'ensemble de l'architecture

```
Internet ──► Public IP ──► Security Group (22/80/443)
                              │
                        ┌─────▼─────────────────────────┐
                        │  VM (Debian 12, Docker)        │
                        │  ┌──────┐  ┌─────┐  ┌────────┐ │
                        │  │caddy │─►│ web │─►│  db     │ │
                        │  │80/443│  │3000 │  │postgres │ │
                        │  └──────┘  └─────┘  └────────┘ │
                        └────────────────────────────────┘
                                       │ pg_dump (cron)
                                       ▼
                              OOS  (s3://…-backups)
```

---

## 1. Pré-requis

- Un compte Outscale avec accès à la région `cloudgouv-eu-west-1`.
- Une **Access Key / Secret Key** (Cockpit → *Access Keys*) pour OOS / CLI.
- Un nom de domaine pointant (enregistrement **A**) vers la Public IP de la VM
  (nécessaire pour le certificat TLS automatique).
- En local : `ssh`, et éventuellement [`osc-cli`](https://docs.outscale.com)
  ou le provider Terraform `outscale` pour automatiser.

---

## 2. Provisionner l'infrastructure (Cockpit)

Créez ces ressources dans la région `cloudgouv-eu-west-1` :

1. **Net** (VPC) — ex. CIDR `10.0.0.0/16`.
2. **Subnet** — ex. `10.0.1.0/24`.
3. **Internet Service** — créez-le et **attachez-le au Net**.
4. **Route Table** — route `0.0.0.0/0` → Internet Service, associée au Subnet.
5. **Keypair** — importez votre clé SSH publique (ou générez-en une).
6. **Security Group** avec les règles entrantes :
   | Port | Source            | Usage              |
   | ---- | ----------------- | ------------------ |
   | 22   | **votre IP /32**  | SSH (admin)        |
   | 80   | `0.0.0.0/0`       | HTTP (redir. → 443 + ACME) |
   | 443  | `0.0.0.0/0`       | HTTPS              |

   > N'ouvrez **jamais** le port 5432 (Postgres) sur Internet : la base reste
   > sur le réseau interne Docker.

7. **VM** :
   - OMI : **Debian 12** officielle (depuis le catalogue d'images).
   - Type : ~2 vCPU / 4 Go (famille `tinav`, p. ex. `tinav6.c2r4p2`).
   - Subnet + Security Group + Keypair créés ci-dessus.
   - Volume racine ≥ 20 Go.
8. **Public IP** — allouez-la et **associez-la à la VM**.

> Équivalents CLI (`osc-cli api …`) : `CreateNet`, `CreateSubnet`,
> `CreateInternetService` / `LinkInternetService`, `CreateRouteTable` /
> `CreateRoute` / `LinkRouteTable`, `CreateSecurityGroup` /
> `CreateSecurityGroupRule`, `CreateKeypair`, `CreateVms`, `CreatePublicIp` /
> `LinkPublicIp`. Vérifiez la syntaxe exacte des paramètres dans la doc Outscale.

---

## 3. Préparer la VM

SSH sur la VM (`ssh -i <clé> outscale@<public-ip>` — l'utilisateur par défaut
des OMI Outscale est souvent `outscale`), puis installez Docker :

```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl git
# Docker Engine + Compose plugin (script officiel)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER" && newgrp docker
```

---

## 4. Déployer l'application

```bash
git clone <votre-repo> algosignal && cd algosignal

# Variables d'environnement de production
cat > .env <<'EOF'
DOMAIN=algosignal.exemple.fr
ACME_EMAIL=admin@exemple.fr
POSTGRES_PASSWORD=<mot-de-passe-fort>
ADMIN_PASSWORD=<mot-de-passe-modération-fort>
EOF

# Build + démarrage (caddy + web + db)
docker compose -f docker-compose.prod.yml up -d --build
```

Au démarrage, le conteneur `web` applique automatiquement les migrations
(`prisma migrate deploy`) puis lance le serveur. Caddy obtient le certificat
TLS Let's Encrypt pour `DOMAIN` dès que le DNS pointe sur la VM.

Vérifiez :

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f web
curl -I https://algosignal.exemple.fr
```

### (Optionnel) Données de démonstration

```bash
docker compose -f docker-compose.prod.yml exec web node_modules/.bin/prisma db seed
```

### Accès à la modération

Rendez-vous sur `https://algosignal.exemple.fr/admin` : vous serez redirigé vers
`/admin/login`. Saisissez la valeur d'`ADMIN_PASSWORD` définie dans `.env`. Aucun
compte à créer — un seul mot de passe protège l'espace de modération.

---

## 5. Sauvegardes vers OOS (S3-compatible)

Configurez l'AWS CLI avec vos clés Outscale, puis planifiez `scripts/backup-db.sh` :

```bash
sudo apt-get install -y awscli
aws configure   # Access Key + Secret Key Outscale ; region: cloudgouv-eu-west-1

# Créez le bucket (une fois)
aws s3 mb s3://algosignal-backups \
  --endpoint-url https://oos.cloudgouv-eu-west-1.outscale.com

# Sauvegarde quotidienne à 3h du matin
( crontab -l 2>/dev/null; \
  echo "0 3 * * * cd $HOME/algosignal && OOS_BUCKET=algosignal-backups OOS_REGION=cloudgouv-eu-west-1 ./scripts/backup-db.sh >> backup.log 2>&1" \
) | crontab -
```

> Pensez à une **politique de rétention** (cycle de vie OOS ou purge dans le
> script) cohérente avec votre durée de conservation RGPD.

---

## 6. Mises à jour

```bash
cd algosignal && git pull
docker compose -f docker-compose.prod.yml up -d --build
```

Les nouvelles migrations Prisma sont appliquées automatiquement au redémarrage
du conteneur `web`.

---

## Check-list conformité

Implémenté dans le code :

- [x] Hébergement **UE / SecNumCloud** (`cloudgouv-eu-west-1`).
- [x] **Consentement explicite** obligatoire (case non pré-cochée) au dépôt.
- [x] **Droit à l'effacement** : lien de suppression unique par signalement.
- [x] **Statut hébergeur** : publication immédiate + retrait (« Retirer »).
- [x] **Notice-and-takedown** visible (« Signaler ce contenu » + mentions légales).
- [x] **Minimisation** : ni nom, ni e-mail, ni IP (logs d'accès Caddy désactivés).
- [x] Pages **politique de confidentialité** et **mentions légales** publiées.

À finaliser avant le lancement (action de ta part) :

- [ ] Renseigner `CONTACT_EMAIL` (`lib/constants.ts`) et les placeholders
      `{{…}}` des pages légales (responsable de traitement, éditeur, adresses).
- [ ] **Faire relire** la politique de confidentialité par un·e juriste / la CNIL.
- [ ] Définir une **durée de conservation** + purge des sauvegardes OOS.
- [ ] Si ajout d'**upload de fichiers** : stocker les preuves sur **OOS**.

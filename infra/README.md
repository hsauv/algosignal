# Infrastructure — Terraform (Outscale + Gandi)

Provisions the full AlgoSignal stack on **3DS Outscale** (SecNumCloud region
`cloudgouv-eu-west-1`) and points your **Gandi** domain at it:

- Net + public Subnet + Internet Service + route table
- Security group (SSH from your IP, HTTP/HTTPS from anywhere)
- A Debian 12 VM that installs Docker on first boot (cloud-init)
- A Public IP attached to the VM
- A **Gandi A record** → that Public IP
- An **OOS bucket** for database backups

> This is **IaaS**: the database is a PostgreSQL **container on the VM**
> (Outscale has no managed Postgres), with backups to OOS. See the deploy guide
> for the app layer: [`../docs/DEPLOY_OUTSCALE.md`](../docs/DEPLOY_OUTSCALE.md).

---

## Prerequisites

1. **Terraform** ≥ 1.3.
2. **Outscale** Access Key / Secret Key (Cockpit → *Access Keys*).
3. **Gandi Personal Access Token** (Gandi account → *Security → Personal Access
   Tokens*, with DNS management scope).
4. A **Debian 12 OMI id** for your region — find it in Cockpit (Images) or:
   ```bash
   osc-cli api ReadImages --Filters '{"ImageNames":["Debian-12*"]}'
   ```
5. An **SSH key pair** locally (`ssh-keygen -t ed25519`).

---

## Usage

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars   # then edit it
terraform init
terraform plan
terraform apply
```

Outputs include the **public IP**, the **FQDN**, an **SSH command**, and the
**app URL**. The Gandi A record is created automatically (unless
`manage_dns = false`).

### Then deploy the app

```bash
# 1. SSH in (user may be outscale / admin / debian depending on the OMI)
ssh outscale@<public_ip>

# 2. Clone + configure + run (see ../docs/DEPLOY_OUTSCALE.md for the .env block)
git clone <your-repo> algosignal && cd algosignal
# create .env with DOMAIN, ACME_EMAIL, POSTGRES_PASSWORD, ADMIN_PASSWORD
docker compose -f docker-compose.prod.yml up -d --build
```

Caddy obtains a TLS certificate automatically once the Gandi DNS record has
propagated. Visit `https://<fqdn>` → `/admin` is protected by `ADMIN_PASSWORD`.

---

## Notes & gotchas

- **Provider versions:** the constraints in `versions.tf` are permissive. Pin to
  the latest from the Terraform Registry and commit `.terraform.lock.hcl` for
  reproducible, auditable applies (good practice for SecNumCloud).
- **Outbound traffic:** if cloud-init can't install Docker (no internet egress),
  set `add_egress_rule = true` and re-apply.
- **OOS bucket:** if `aws_s3_bucket` fails against the OOS endpoint, set
  `create_backup_bucket = false` and create it once with the AWS CLI (see
  `oos.tf`).
- **Default SSH user** depends on the OMI (`outscale`, `admin`, or `debian`).
- **State contains secrets.** `terraform.tfvars` and `*.tfstate` are gitignored.
  For team use, store state in a remote backend (e.g. an OOS bucket via the S3
  backend with the OOS endpoint).
- **Single VM = single point of failure.** Rely on the OOS backups; for higher
  availability, split Postgres onto its own VM/volume later.

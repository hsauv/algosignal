#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Dump the PostgreSQL database and upload it to Outscale Object Storage (OOS),
# which is S3-compatible. Schedule via cron (see docs/DEPLOY_OUTSCALE.md).
#
# Requires on the host: docker, awscli (configured with Outscale OOS keys).
#
# Environment:
#   OOS_BUCKET    e.g. algosignal-backups
#   OOS_REGION    e.g. cloudgouv-eu-west-1   (SecNumCloud)
#   COMPOSE_FILE  defaults to docker-compose.prod.yml
# ---------------------------------------------------------------------------
set -euo pipefail

OOS_REGION="${OOS_REGION:-cloudgouv-eu-west-1}"
OOS_ENDPOINT="https://oos.${OOS_REGION}.outscale.com"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
FILE="algosignal-${STAMP}.sql.gz"

: "${OOS_BUCKET:?set OOS_BUCKET}"

echo "Dumping database…"
docker compose -f "$COMPOSE_FILE" exec -T db \
  pg_dump -U algosignal algosignal | gzip > "/tmp/${FILE}"

echo "Uploading to s3://${OOS_BUCKET}/${FILE} (Outscale OOS, ${OOS_REGION})…"
aws s3 cp "/tmp/${FILE}" "s3://${OOS_BUCKET}/${FILE}" \
  --endpoint-url "$OOS_ENDPOINT"

rm -f "/tmp/${FILE}"
echo "Backup done: ${FILE}"

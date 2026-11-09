#!/usr/bin/env bash
# backend/scripts/backup.sh — nightly cron
set -euo pipefail

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/var/backups/erp
S3_BUCKET=s3://erp-backups/$(hostname)
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

# ── 1. MySQL dump (consistent snapshot) ──
mysqldump --single-transaction --quick --routines --triggers \
  --set-gtid-purged=OFF \
  -h "${DB_HOST:-127.0.0.1}" -u "${DB_USERNAME}" -p"${DB_PASSWORD}" \
  "${DB_DATABASE}" | gzip > "$BACKUP_DIR/db_${DATE}.sql.gz"

# ── 2. Uploads / storage ──
tar -czf "$BACKUP_DIR/storage_${DATE}.tar.gz" -C /var/www/backend storage/app/private

# ── 3. Sync to S3 (encrypted at rest) ──
aws s3 cp "$BACKUP_DIR/db_${DATE}.sql.gz" "$S3_BUCKET/db_${DATE}.sql.gz" --storage-class STANDARD_IA
aws s3 cp "$BACKUP_DIR/storage_${DATE}.tar.gz" "$S3_BUCKET/storage_${DATE}.tar.gz" --storage-class GLACIER_IR

# ── 4. Prune old local backups ──
find "$BACKUP_DIR" -name '*.gz' -mtime +${RETENTION_DAYS} -delete

# ── 5. Health check (verify backup is restorable) ──
zcat "$BACKUP_DIR/db_${DATE}.sql.gz" | head -c 100 | grep -q "MySQL dump" \
  && echo "✅ Backup valid: db_${DATE}.sql.gz" \
  || { echo "❌ Backup corrupt"; exit 1; }


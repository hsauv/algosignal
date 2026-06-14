# Backup bucket on Outscale Object Storage (OOS, S3-compatible).
# Created through the AWS provider aimed at the OOS endpoint (see providers.tf).
# If your provider/region rejects this, set create_backup_bucket = false and
# create it once via: aws s3 mb s3://<name> --endpoint-url https://oos.<region>.outscale.com
resource "aws_s3_bucket" "backups" {
  count    = var.create_backup_bucket ? 1 : 0
  provider = aws.oos
  bucket   = var.backup_bucket_name
}

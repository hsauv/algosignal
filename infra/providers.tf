provider "outscale" {
  access_key_id = var.outscale_access_key
  secret_key_id = var.outscale_secret_key
  region        = var.region
}

provider "gandi" {
  # Gandi Personal Access Token (PAT). Create one at:
  # Gandi account → Security → Personal Access Tokens (scope: manage DNS).
  personal_access_token = var.gandi_pat
}

# AWS provider aimed at the Outscale Object Storage (OOS) S3-compatible endpoint.
# Used only to create the backup bucket — never talks to real AWS.
provider "aws" {
  alias      = "oos"
  region     = var.region
  access_key = var.outscale_access_key
  secret_key = var.outscale_secret_key

  skip_credentials_validation = true
  skip_region_validation      = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
  s3_use_path_style           = true

  endpoints {
    s3 = "https://oos.${var.region}.outscale.com"
  }
}

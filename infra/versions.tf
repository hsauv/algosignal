terraform {
  required_version = ">= 1.3"

  required_providers {
    # 3DS Outscale (SecNumCloud IaaS). Pin to the latest from the registry:
    # https://registry.terraform.io/providers/outscale/outscale/latest
    outscale = {
      source  = "outscale/outscale"
      version = ">= 1.0.0"
    }

    # Gandi LiveDNS (your domain registrar) — manages the A record.
    # https://registry.terraform.io/providers/go-gandi/gandi/latest
    gandi = {
      source  = "go-gandi/gandi"
      version = ">= 2.0.0"
    }

    # AWS provider, used only against the S3-compatible Outscale OOS endpoint
    # to create the backup bucket.
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

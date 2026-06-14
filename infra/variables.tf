variable "project" {
  description = "Name prefix for created resources."
  type        = string
  default     = "algosignal"
}

# --- Outscale credentials & region -----------------------------------------

variable "outscale_access_key" {
  description = "Outscale Access Key (Cockpit → Access Keys)."
  type        = string
  sensitive   = true
}

variable "outscale_secret_key" {
  description = "Outscale Secret Key."
  type        = string
  sensitive   = true
}

variable "region" {
  description = "Outscale region. cloudgouv-eu-west-1 is the SecNumCloud region."
  type        = string
  default     = "cloudgouv-eu-west-1"
}

variable "subregion" {
  description = "Subregion (availability zone). Empty → <region>a."
  type        = string
  default     = ""
}

# --- VM ---------------------------------------------------------------------

variable "image_id" {
  description = <<-EOT
    OMI id of a Debian 12 image in the chosen region. Find it in Cockpit
    (Images catalog) or via: osc-cli api ReadImages --Filters '{"ImageNames":["Debian-12*"]}'.
    OMI ids are region-specific.
  EOT
  type        = string
}

variable "vm_type" {
  description = "Outscale VM type (~2 vCPU / 4 GB)."
  type        = string
  default     = "tinav6.c2r4p2"
}

variable "root_volume_size" {
  description = "Root volume size in GB (holds the Postgres data volume)."
  type        = number
  default     = 30
}

variable "ssh_public_key" {
  description = "SSH public key content (e.g. file contents of ~/.ssh/id_ed25519.pub)."
  type        = string
}

variable "admin_ssh_cidr" {
  description = "CIDR allowed to SSH in, e.g. 203.0.113.4/32 (your IP)."
  type        = string
}

variable "add_egress_rule" {
  description = <<-EOT
    Add an explicit allow-all outbound rule. Leave false if your Outscale
    security groups already include a default allow-all egress (AWS-like).
    Set true if the VM cannot reach the internet (Docker install fails).
  EOT
  type        = bool
  default     = false
}

# --- Network ----------------------------------------------------------------

variable "net_ip_range" {
  description = "CIDR for the Net (VPC)."
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_ip_range" {
  description = "CIDR for the public subnet."
  type        = string
  default     = "10.0.1.0/24"
}

# --- DNS (Gandi) ------------------------------------------------------------

variable "manage_dns" {
  description = "Create the Gandi A record pointing the domain at the VM."
  type        = bool
  default     = true
}

variable "gandi_pat" {
  description = "Gandi Personal Access Token (required if manage_dns = true)."
  type        = string
  default     = ""
  sensitive   = true
}

variable "gandi_domain" {
  description = "Your Gandi domain (zone), e.g. exemple.fr."
  type        = string
}

variable "subdomain" {
  description = "Record name: \"@\" for the apex (exemple.fr) or e.g. \"app\"."
  type        = string
  default     = "@"
}

variable "dns_ttl" {
  description = "TTL (seconds) for the A record."
  type        = number
  default     = 300
}

# --- Backups (OOS) ----------------------------------------------------------

variable "create_backup_bucket" {
  description = "Create the OOS backup bucket via Terraform."
  type        = bool
  default     = true
}

variable "backup_bucket_name" {
  description = "OOS bucket name for database backups (globally unique)."
  type        = string
  default     = "algosignal-backups"
}

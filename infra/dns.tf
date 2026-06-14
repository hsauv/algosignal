# Gandi LiveDNS A record → the VM's public IP.
# Disable with manage_dns = false to set the record manually in the Gandi UI.
resource "gandi_livedns_record" "app" {
  count = var.manage_dns ? 1 : 0

  zone   = var.gandi_domain
  name   = var.subdomain
  type   = "A"
  ttl    = var.dns_ttl
  values = [outscale_public_ip.this.public_ip]
}

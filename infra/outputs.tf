output "public_ip" {
  description = "Public IP of the VM. Point your DNS here (done automatically if manage_dns = true)."
  value       = outscale_public_ip.this.public_ip
}

output "fqdn" {
  description = "The application's fully-qualified domain name."
  value       = local.fqdn
}

output "vm_id" {
  description = "Outscale VM id."
  value       = outscale_vm.web.vm_id
}

output "ssh_command" {
  description = "Convenience SSH command (adjust the key path / user as needed)."
  value       = "ssh outscale@${outscale_public_ip.this.public_ip}"
}

output "backup_bucket" {
  description = "OOS bucket name used for database backups."
  value       = var.create_backup_bucket ? var.backup_bucket_name : "(not managed by Terraform)"
}

output "app_url" {
  description = "URL once the app is deployed and DNS has propagated."
  value       = "https://${local.fqdn}"
}

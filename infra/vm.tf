# Cloud-init: install Docker + git so the VM is ready to run the app on boot.
locals {
  cloud_init = <<-EOT
    #!/bin/bash
    set -e
    export DEBIAN_FRONTEND=noninteractive
    apt-get update
    apt-get install -y ca-certificates curl git
    curl -fsSL https://get.docker.com | sh
    systemctl enable --now docker
    # Add the default login user to the docker group (name varies by OMI).
    for u in outscale admin debian ubuntu; do
      usermod -aG docker "$u" 2>/dev/null || true
    done
  EOT
}

resource "outscale_keypair" "this" {
  keypair_name = "${var.project}-key"
  public_key   = var.ssh_public_key
}

resource "outscale_vm" "web" {
  image_id           = var.image_id
  vm_type            = var.vm_type
  keypair_name       = outscale_keypair.this.keypair_name
  security_group_ids = [outscale_security_group.web.security_group_id]
  subnet_id          = outscale_subnet.this.subnet_id
  user_data          = base64encode(local.cloud_init)

  block_device_mappings {
    device_name = "/dev/sda1"
    bsu {
      volume_size           = var.root_volume_size
      volume_type           = "gp2"
      delete_on_vm_deletion = true
    }
  }

  tags {
    key   = "name"
    value = "${var.project}-web"
  }

  # Ensure the route to the internet exists before the VM boots (cloud-init
  # needs outbound access to install Docker).
  depends_on = [outscale_route.default, outscale_route_table_link.this]
}

resource "outscale_public_ip" "this" {
  tags {
    key   = "name"
    value = "${var.project}-eip"
  }
}

resource "outscale_public_ip_link" "this" {
  vm_id        = outscale_vm.web.vm_id
  public_ip_id = outscale_public_ip.this.public_ip_id
}

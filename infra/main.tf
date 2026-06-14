locals {
  subregion = var.subregion != "" ? var.subregion : "${var.region}a"
  fqdn      = var.subdomain == "@" ? var.gandi_domain : "${var.subdomain}.${var.gandi_domain}"
}

# --- Network (Net / Subnet / Internet access) -------------------------------

resource "outscale_net" "this" {
  ip_range = var.net_ip_range
  tags {
    key   = "name"
    value = "${var.project}-net"
  }
}

resource "outscale_subnet" "this" {
  net_id         = outscale_net.this.net_id
  ip_range       = var.subnet_ip_range
  subregion_name = local.subregion
  tags {
    key   = "name"
    value = "${var.project}-subnet"
  }
}

resource "outscale_internet_service" "this" {
  tags {
    key   = "name"
    value = "${var.project}-igw"
  }
}

resource "outscale_internet_service_link" "this" {
  internet_service_id = outscale_internet_service.this.internet_service_id
  net_id              = outscale_net.this.net_id
}

resource "outscale_route_table" "this" {
  net_id = outscale_net.this.net_id
  tags {
    key   = "name"
    value = "${var.project}-rt"
  }
}

resource "outscale_route" "default" {
  route_table_id       = outscale_route_table.this.route_table_id
  destination_ip_range = "0.0.0.0/0"
  gateway_id           = outscale_internet_service.this.internet_service_id
}

resource "outscale_route_table_link" "this" {
  route_table_id = outscale_route_table.this.route_table_id
  subnet_id      = outscale_subnet.this.subnet_id
}

# --- Security group ---------------------------------------------------------

resource "outscale_security_group" "web" {
  description         = "AlgoSignal web (SSH/HTTP/HTTPS)"
  security_group_name = "${var.project}-web-sg"
  net_id              = outscale_net.this.net_id
}

resource "outscale_security_group_rule" "ssh" {
  flow              = "Inbound"
  security_group_id = outscale_security_group.web.security_group_id
  rules {
    from_port_range = 22
    to_port_range   = 22
    ip_protocol     = "tcp"
    ip_ranges       = [var.admin_ssh_cidr]
  }
}

resource "outscale_security_group_rule" "http" {
  flow              = "Inbound"
  security_group_id = outscale_security_group.web.security_group_id
  rules {
    from_port_range = 80
    to_port_range   = 80
    ip_protocol     = "tcp"
    ip_ranges       = ["0.0.0.0/0"]
  }
}

resource "outscale_security_group_rule" "https" {
  flow              = "Inbound"
  security_group_id = outscale_security_group.web.security_group_id
  rules {
    from_port_range = 443
    to_port_range   = 443
    ip_protocol     = "tcp"
    ip_ranges       = ["0.0.0.0/0"]
  }
}

# Optional explicit allow-all egress (see var.add_egress_rule).
resource "outscale_security_group_rule" "egress" {
  count             = var.add_egress_rule ? 1 : 0
  flow              = "Outbound"
  security_group_id = outscale_security_group.web.security_group_id
  rules {
    from_port_range = -1
    to_port_range   = -1
    ip_protocol     = "-1"
    ip_ranges       = ["0.0.0.0/0"]
  }
}

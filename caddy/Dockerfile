# Custom Caddy image with the rate-limit module baked in.
# (rate_limit is a third-party module, not part of the default Caddy build.)
FROM caddy:2-builder AS builder
RUN xcaddy build --with github.com/mholt/caddy-ratelimit

FROM caddy:2
COPY --from=builder /usr/bin/caddy /usr/bin/caddy

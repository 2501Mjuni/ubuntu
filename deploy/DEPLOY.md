# Demo deployment (VPS + Docker + HTTPS)

Runs the site with the mock API behind Caddy, which gets a free HTTPS certificate automatically.

## 1. DNS (Namecheap)

Domain List > Manage > Advanced DNS > Add New Record

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A Record | `demo` (or any subdomain) | the VPS IP address | Automatic |

The site will be at `https://demo.<your-domain>`. Use a subdomain so the domain's existing records are untouched.

## 2. Server (once)

```bash
ssh root@<VPS_IP>
curl -fsSL https://get.docker.com | sh      # installs Docker and the compose plugin
ufw allow 80,443/tcp 2>/dev/null || true     # only if a firewall is enabled
```

Contabo also has a Firewall page in the customer panel. Ports 80 and 443 must be open there if you have created a firewall.

## 3. Upload and start (from your laptop)

```bash
cd ~/Documents/Main_Projects/ubuntu_impact
rsync -az --exclude node_modules --exclude .next --exclude '.env*' site/ root@<VPS_IP>:/opt/ubuntu-site/
ssh root@<VPS_IP> 'cd /opt/ubuntu-site && SITE_DOMAIN=demo.<your-domain> docker compose up -d --build'
```

The first build takes a few minutes. Then open `https://demo.<your-domain>`.

## Operations

- Logs: `docker compose logs -f` in `/opt/ubuntu-site`
- Update after changes: repeat the rsync, then run the same `docker compose up -d --build`
- Stop: `docker compose down`

Notes: the DNS record must resolve to the server before the first start, or the certificate request fails (it retries on its own, or run `docker compose restart caddy`).

## Quickest option: a spare port, no proxy (touches nothing that already runs)

```bash
rsync -az --exclude node_modules --exclude .next --exclude '.env*' site/ root@<VPS_IP>:/opt/ubuntu-site/
ssh root@<VPS_IP> 'cd /opt/ubuntu-site && SITE_DOMAIN=ubuntu.shambaos.org docker compose -f docker-compose.behind-proxy.yml up -d --build'
```

Then open `http://<VPS_IP>:3010` (or `http://ubuntu.shambaos.org:3010`). This is plain HTTP, so browsers show "Not secure"; the demo still works because the mock API runs inside the page and needs no service worker.

- If the page does not open, port 3010 is blocked: allow it in the Contabo firewall (customer panel > Firewall) and, if enabled, `ufw allow 3010/tcp`.
- Use another port with `SITE_PORT=3020`, if 3010 is taken (check with `ss -tlnp | grep 3010`).

## Later: proper HTTPS on the subdomain

If ports 80/443 are already used by another proxy, keep the container above and add a site to that proxy:

- Caddy (`Caddyfile`): `ubuntu.shambaos.org { reverse_proxy 127.0.0.1:3010 }` then reload Caddy.
- nginx: a `server { server_name ubuntu.shambaos.org; location / { proxy_pass http://127.0.0.1:3010; proxy_set_header Host $host; proxy_set_header X-Forwarded-Proto $scheme; } }` block, then `certbot --nginx -d ubuntu.shambaos.org` and reload.
- If that proxy itself runs in Docker, use its container network instead of 127.0.0.1 (ask for help with that case).

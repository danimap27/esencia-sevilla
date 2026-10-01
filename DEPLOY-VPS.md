# Despliegue en VPS (Hostalia) — Tutorial completo

Guía paso a paso para montar Esencia Sevilla en un **VPS de Hostalia** (o cualquier VPS con Ubuntu y acceso root) con Nginx, PM2 y SSL de Let's Encrypt.

> ⚠️ **Hosting compartido (cPanel) de Hostalia: NO sirve.** Next.js necesita un proceso Node siempre activo y SSH. Si tu contratación es "Alojamiento Web" con cPanel, tienes que contratar un **VPS de Hostalia** (acceso root vía *Power Panel*, credenciales SSH que llegan por email) o un Cloud con SSH.

---

## Arquitectura final

```
Internet → DNS (Hostalia) → IP del VPS
        → Nginx :443 (SSL Let's Encrypt) → reverse proxy a 127.0.0.1:3010
        → PM2 (next start) con .env.local
        → Supabase / Stripe / OpenRouter (servicios externos, todo en la nube)
```

Servicios externos (Supabase, Stripe, OpenRouter, Resend, Twilio) **no se instalan en el VPS**: solo necesitas sus claves en `.env.local`.

---

## Requisitos

- VPS Hostalia con Ubuntu 22.04/24.04 (2 vCPU / 2 GB RAM mínimo; 4 GB cómodo)
- IP pública y acceso SSH root (o usuario sudo) — te llega en el email de alta del VPS
- Tu dominio (ej. `esenciasevilla.com`) registrado **en Hostalia o en otro registrador**
- Una máquina local con `git` y `ssh`

---

## Paso 1 — Preparar el VPS

```bash
ssh root@IP_DEL_VPS

# Actualizar sistema
apt update && apt upgrade -y

# Firewall: HTTP/HTTPS + SSH
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Node.js 20 (NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx certbot python3-certbot-nginx

# PM2 (gestor de procesos) y utilidades
npm install -g pm2
pm2 startup systemd -u root --hp /root
```

Comprueba: `node -v` (v20.x) · `nginx -v` · `pm2 -v`.

## Paso 2 — Apuntar el dominio (DNS en Hostalia)

En el panel de Hostalia → **Dominios → tu dominio → DNS / Zona DNS**, crear:

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | `@` | IP del VPS | 300 |
| A | `www` | IP del VPS | 300 |

Si el dominio está en Cloudflare y usas proxied (nube naranja), recuerda que el SSL lo gestiona Cloudflare entonces; con DNS *DNS only* (sin proxy) lo gestiona Certbot en el VPS.

Verifica con `dig +short tu-dominio.com` (o `nslookup`) hasta que devuelva la IP. La propagación suele tardar unos minutos.

## Paso 3 — Subir el código

**Opción A (git, recomendada):** el repo es privado → usa un *Personal Access Token* de GitHub (Settings → Developer settings → Fine-grained tokens, alcance solo `esencia-sevilla`, permisos Contents: Read) o una SSH key.

```bash
# con token (usa PAT como contraseña)
cd /var/www
git clone https://TU_USUARIO:PAT@github.com/danimap27/esencia-sevilla.git
cd esencia-sevilla

# o con SSH key
ssh-keygen -t ed25519 -C "vps-esencia"
cat ~/.ssh/id_ed25519.pub   # pégalo en GitHub → Settings → SSH keys
git clone git@github.com:danimap27/esencia-sevilla.git
```

**Opción B (sin git):** desde tu máquina local

```bash
rsync -avz --exclude node_modules --exclude .env.local --exclude .next \
  ./esencia-sevilla/ root@IP_DEL_VPS:/var/www/esencia-sevilla/
```

## Paso 4 — Variables de entorno

```bash
cd /var/www/esencia-sevilla
cp .env.example .env.local
nano .env.local     # rellena (tabla completa en DEPLOY.md)
chmod 600 .env.local
```

Obligatorias: Supabase (URL + anon key + service role), Stripe (secret + publishable + webhook secret), OpenRouter, `ADMIN_PASSWORD`.

Ajusta además el dominio público:

```bash
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

**Nunca** subas `.env.local` a git (`.gitignore` ya lo excluye).

## Paso 5 — Build y arranque con PM2

```bash
cd /var/www/esencia-sevilla
npm ci
npm run build          # ~1-2 min en un VPS de 2 GB
pm2 start ecosystem.config.js
pm2 save
```

El `ecosystem.config.js` (incluido en la raíz del repo) arranca `next start -p 3010` con reinicio automático si cae.

Comprobación local en el VPS:

```bash
curl -I http://127.0.0.1:3010/es    # debe dar 200
pm2 logs esencia-sevilla --lines 50
```

## Paso 6 — Nginx reverse proxy

Crea `/etc/nginx/sites-available/esencia`:

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
        client_max_body_size 10m;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/esencia /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

Desde tu máquina local: `curl -I https://tu-dominio.com/es` (tras el SSL) o `http://tu-dominio.com/es` debe devolver 200.

## Paso 7 — SSL con Let's Encrypt

```bash
certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
# aceptar redirecciones (HTTPS) — certbot reescribe el vhost solo
systemctl status certbot.timer     # renovación automática
certbot renew --dry-run            # verificar
```

## Paso 8 — Webhook de Stripe

En [Dashboard Stripe → Developers → Webhooks](https://dashboard.stripe.com/webhooks) → **Add endpoint**:

- URL: `https://tu-dominio.com/api/webhooks/stripe`
- Eventos: `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`

Copia el *Signing secret* a `STRIPE_WEBHOOK_SECRET` en `.env.local` y reinicia: `pm2 restart esencia-sevilla`.

> Nota: la reserva directa con Stripe está hoy **ocultada en la web** (solo Booking.com), pero el endpoint sigue vivo por si la reactivas.

## Paso 9 — Servicios externos mínimos

| Servicio | Qué tocar |
|----------|-----------|
| **Supabase** | SQL Editor → ejecutar el schema (ver DEPLOY.md). Free plan vale. |
| **Stripe** | Solo claves + webhook (Paso 8). |
| **OpenRouter** | API key para el chat (`OPENROUTER_API_KEY`). |
| **Resend / Twilio** | Opcionales (emails y WhatsApp). |
| **iCal** | `ICAL_BOOKING_URL` = calendario iCal de Booking.com para evitar reservas duplicadas. |

---

## Actualizaciones (deploy de futuras versiones)

```bash
cd /var/www/esencia-sevilla
git pull
npm ci
npm run build
pm2 restart esencia-sevilla
curl -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3010/es
```

**Opción automática (GitHub Actions):** crear `deploy-vps.yml` con `secrets.VPS_HOST`, `secrets.VPS_SSH_KEY` y `secrets.VPS_USER` que haga `ssh → git pull → npm ci → build → pm2 restart` en cada push a `master`. Así el VPS se actualiza solo al hacer push.

---

## Mantenimiento

```bash
pm2 logs esencia-sevilla        # logs de la app
pm2 monit                       # CPU/RAM en vivo
journalctl -u nginx -n 50       # logs de Nginx
certbot renew --dry-run         # renovación SSL
nginx -t                        # validar config
df -h && free -h                # disco y RAM
```

**Backups:** Supabase ya hace backup de la BD. Del VPS, copia `.env.local` y el repo a tu máquina/Drive de forma periódica (`rsync` o `restic`).

---

## Troubleshooting

| Síntoma | Causa probable | Fix |
|---------|----------------|-----|
| 502 Bad Gateway | PM2 caído o puerto distinto | `pm2 status` · `pm2 start ecosystem.config.js` · revisa `proxy_pass` |
| 502 con PM2 OK | `.next` desactualizado tras `git pull` | `npm run build && pm2 restart esencia-sevilla` |
| 404 en `/api/*` | Falta `proxy_set_header` o hay un redirect previo | revisa el vhost (Host Paso 6) |
| `ENOTFOUND ...supabase.co` en build | Falta `.env.local` en el build | `cp .env.example .env.local` y rellena |
| Certbot: "unable to receive http challenge" | DNS aún no apunta o Nginx bloquea 80 | `dig tu-dominio.com` y `ufw status` |
| Chat IA: HTTP 500 | Cadena de modelos OpenRouter caída / key sin saldo | `curl -s -H "Authorization: Bearer $KEY" https://openrouter.ai/api/v1/credits` |
| Eventos desactualizados | Llegan por `git pull` | haz pull + `pm2 restart` (o activa auto-deploy) |

---

## Checklist post-despliegue

```bash
D=tu-dominio.com
for p in /es /en /es/guia /en/guia /es/blog /es/welcome-book /es/pre-checkin \
         /api/weather /api/events /api/availability; do
  echo -n "$p -> "; curl -s -o /dev/null -w "%{http_code}\n" https://$D$p
done
```

- [ ] Todo 200 y `http://` redirige a `https://`
- [ ] `https://$D/api/events` devuelve JSON de eventos con imágenes
- [ ] Chat IA responde desde el navegador
- [ ] Webhook de Stripe da 200 en el dashboard de Stripe
- [ ] La guía muestra WiFi (SSID/pass) y los eventos con foto
- [ ] Reserva en la web → solo el botón de Booking.com

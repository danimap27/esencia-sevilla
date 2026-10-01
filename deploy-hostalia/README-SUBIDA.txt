ESENCIA SEVILLA — WEB ESTÁTICA PARA HOSTING COMPARTIDO (Hostalia)
=================================================================

QUÉ ES
------
Export estático de Next.js: HTML + JS + fotos. Sin servidor Node, así que el
hosting de solo PHP de Hostalia lo sirve tal cual.

INSTRUCCIONES DE SUBIDA (3 minutos)
-----------------------------------
1. Entra en el panel de Hostalia → Administrador de archivos (o por FTP con
   FileZilla: datos en "Datos de tu cuenta" del panel).
2. Sube TODO el contenido de este zip a la RAÍZ de public_html
   (donde ya esté index.html o donde el panel crea la web). Debe quedar:
       public_html/index.html?  (no hace falta, la raíz redirige a /es/)
       public_html/es/
       public_html/en/  fr/  de/  it/  pt/
       public_html/_next/
       public_html/chat.php
       public_html/chat-config.php   ← tu API key de OpenRouter (NO borrar)
       public_html/events.json
       public_html/.htaccess         ← invisible; asegúrate de subirlo
       public_html/fotos/  tours-360/  icons/  sw.js  workbox-*.js ...
3. En Hostalia → Dominios: si aún no lo tienes, añade tu dominio al hosting
   y apunta los nameservers de Hostalia (o el registro A desde Cloudflare).
4. SSL: Dominios → SSL/HTTPS → emite certificado Let's Encrypt (gratis, 1 clic).
5. Abre el dominio: debe cargar en /es/ directamente.

QUÉ FUNCIONA EN ESTE BUILD
--------------------------
✓ Todas las páginas en 6 idiomas (home, guía, rutas, welcome book, FAQ,
  reseñas, privacidad, blog, mapa, tour 360...)
✓ Tiempo en Sevilla (fallback directo a Open-Meteo desde el navegador)
✓ Eventos (events.json incluido; el cron del homelab puede reemplazarlo con
  rsync — ver más abajo)
✓ Chat del asistente (vía chat.php → OpenRouter)
✓ Reservas por Booking + WhatsApp (enlaces directos)
✓ PWA offline

QUÉ NO FUNCIONA (necesita servidor)
-----------------------------------
✗ Pre-check-in y panel admin (redirigen a /es/guia)
✗ Reservas directas con Stripe / disponibilidad en tiempo real
✗ Webhook de Stripe

ACTUALIZAR EVENTOS DESPUÉS
---------------------------
Sustituye public_html/events.json por el data/events.json actual del repo
(un archivo, se puede pisar sin rebuild).

ACTUALIZAR LA WEB
------------------
En el repo: bash scripts/build-static-export.sh  →  sube el out/ nuevo
(repite los pasos 2-3 de arriba; puedes borrar antes las carpetas es/ en/
fr/ de/ it/ pt/ _next/ para que no queden chunks huérfanos).

SEGURIDAD
---------
- chat-config.php contiene tu API key de OpenRouter. No lo subas a git ni lo
  compartas. Si crees que se filtró, revócala en openrouter.ai (clave → revoke)
  y genera otra.
- La key NO se envía al navegador: solo chat.php (servidor) la usa.

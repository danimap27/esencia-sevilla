#!/usr/bin/env bash
# Build de EXPORT ESTÁTICO de Esencia Sevilla para hosting compartido (Hostalia).
# Genera out/ listo para subir a public_html.
#
# IMPORTANTE — POR QUÉ COPIA AISLADA:
#   El build de export (output:'export') escribe SIEMPRE los artefactos en .next/
#   (Next 14.2: con output:'export', configOutDir=distDir para la salida pero
#   config.distDir se fuerza a ".next" para los intermedios). Si se construye
#   in-place, .next de PRODUCCIÓN (el que sirve `next start -p 3010` con las API
#   routes) queda machacado y todas las /api/* devuelven 404 hasta el siguiente
#   `npm run build`. Pasó el 2026-10-05: /api/events y /api/weather en 404 una
#   semana. Por eso el export corre en una COPIA (.export-work/) y el .next del
#   repo no se toca jamás.
#
# Trucos del export (inyectados SOLO en la copia):
#  - output:'export' + trailingSlash + images.unoptimized.
#  - src/app/api y pre-checkin fuera: no exportables (force-dynamic/searchParams).
#    El hosting estático usa los fallbacks (/events.json, Open-Meteo directo, /chat.php).
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$(pwd)"
WORK="$ROOT/.export-work"

echo "==> Sincronizando copia de trabajo en $WORK (rsync)"
mkdir -p "$WORK"
rsync -a --delete \
  --exclude node_modules --exclude .next --exclude out --exclude .git \
  --exclude '.export-work' \
  "$ROOT/" "$WORK/"
ln -sfn "$ROOT/node_modules" "$WORK/node_modules"

echo "==> Inyectando output:'export' + trailingSlash + images.unoptimized (solo en la copia)"
python3 - "$WORK/next.config.mjs" <<'PY'
import pathlib, sys
p = pathlib.Path(sys.argv[1])
t = p.read_text()
assert "output: 'export'" not in t
t = t.replace("const nextConfig = {\n", "const nextConfig = {\n  output: 'export',\n  trailingSlash: true,\n", 1)
t = t.replace("  images: {\n    remotePatterns:", "  images: {\n    unoptimized: true,\n    remotePatterns:", 1)
p.write_text(t)
PY

echo "==> Sacando src/app/api y pre-checkin (solo de la copia)"
rm -rf "$WORK/src/app/api" "$WORK/src/app/[locale]/pre-checkin"

echo "==> npm run build (export) en la copia"
( cd "$WORK" && rm -rf out && npm run build )

# La raíz '/' genera redirect a /es en el deploy normal; en export no hay index.html
# en la raíz (el .htaccess lo redirige a /es/). Comprobamos el home en español:
if [ ! -f "$WORK/out/es/index.html" ]; then
  echo "ERROR: no se generó out/es/index.html" >&2
  exit 1
fi

echo "==> Reemplazando out/ del repo con el export nuevo"
rm -rf "$ROOT/out"
mv "$WORK/out" "$ROOT/out"
rm -rf "$WORK"

echo "==> Copiando data/events.json → out/events.json (fallback de eventos)"
cp data/events.json out/events.json

echo "==> Añadiendo extras para hosting compartido (chat.php, .htaccess, README)"
cp deploy-hostalia/chat.php out/chat.php
cp deploy-hostalia/.htaccess out/.htaccess
cp deploy-hostalia/README-SUBIDA.txt out/README-SUBIDA.txt
python3 - <<'PY'
import pathlib
env = pathlib.Path('.env.local')
key = ''
if env.exists():
    for line in env.read_text().splitlines():
        if line.startswith('OPENROUTER_API_KEY='):
            key = line.split('=', 1)[1].strip()
tpl = pathlib.Path('deploy-hostalia/chat-config.template.php').read_text()
if key:
    tpl = tpl.replace('PEGA_AQUI_TU_OPENROUTER_KEY', key)
pathlib.Path('out/chat-config.php').write_text(tpl)
print('chat-config.php escrito' + (' (con key de .env.local)' if key else '  ⚠ SIN KEY: rellena chat-config.php antes de subir'))
PY

echo "OK: build estático en $(pwd)/out ($(du -sh out | cut -f1))"

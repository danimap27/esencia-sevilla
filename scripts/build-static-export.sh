#!/usr/bin/env bash
# Build de EXPORT ESTÁTICO de Esencia Sevilla para hosting compartido (Hostalia).
# Genera out/ listo para subir a public_html.
#
# Trucos necesarios (y por qué):
#  - output:'export' en next.config.mjs (temporal): genera out/ con HTML+JS puro.
#  - images.unoptimized: el export no soporta el optimizador de imágenes de Next.
#  - src/app/api fuera del build: los route handlers con force-dynamic no se pueden
#    exportar (el build fallaría); el hosting estático no los necesita porque los
#    componentes llevan fallbacks (/events.json, Open-Meteo directo, /chat.php).
#
# El repo queda EXACTAMENTE igual al terminar (se restaura siempre, incluso con Ctrl-C).
set -euo pipefail
cd "$(dirname "$0")/.."

BAK="$(mktemp -d)"
echo "==> Backup en $BAK"
cp next.config.mjs "$BAK/next.config.mjs"

cleanup() {
  echo "==> Restaurando repo"
  cp "$BAK/next.config.mjs" next.config.mjs
  [ -d "$BAK/api" ] && mv "$BAK/api" src/app/api || true
  [ -d "$BAK/pre-checkin" ] && mv "$BAK/pre-checkin" "src/app/[locale]/pre-checkin" || true
  rm -rf "$BAK"
}
trap cleanup EXIT INT TERM

echo "==> Inyectando output:'export' + trailingSlash + images.unoptimized (temporal)"
python3 - <<'PY'
import pathlib
p = pathlib.Path('next.config.mjs')
t = p.read_text()
assert "output: 'export'" not in t
t = t.replace("const nextConfig = {\n", "const nextConfig = {\n  output: 'export',\n  trailingSlash: true,\n", 1)
t = t.replace("  images: {\n    remotePatterns:", "  images: {\n    unoptimized: true,\n    remotePatterns:", 1)
p.write_text(t)
PY

echo "==> Sacando src/app/api y pre-checkin (temporal; necesitan APIs/searchParams dinámicos)"
mv src/app/api "$BAK/api"
mv "src/app/[locale]/pre-checkin" "$BAK/pre-checkin"

echo "==> npm run build (export)"
rm -rf out
npm run build

# La raíz '/' genera redirect a /es en el deploy normal; en export no hay index.html
# en la raíz (el .htaccess lo redirige a /es/). Comprobamos el home en español:
if [ ! -f out/es/index.html ]; then
  echo "ERROR: no se generó out/es/index.html" >&2
  exit 1
fi

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

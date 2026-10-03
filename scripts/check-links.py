#!/usr/bin/env python3
"""Auditoría de enlaces de Esencia Sevilla.

1. EXTERNOS: extrae todas las URLs http(s) de src/data/*.ts, data/events.json,
   messages/*.json y src/app (system prompt del chat) y comprueba su estado.
   HEAD primero; si no es 2xx/3xx, reintenta con GET (muchas webs bloquean HEAD).
   Clasifica: OK / REDIR / ROTO (4xx/5xx) / BLOQUEADO (000, 403, 429, 503 con
   'cf-ray'...) — BLOQUEADO suele ser anti-bots, verificar a mano antes de tocar.

2. INTERNOS: recorre out/*.html (export estático), extrae href/src internos y
   verifica que el destino exista como archivo (evita 404 por enlaces rotos).

Uso: python3 scripts/check-links.py [--no-internal] [--json salida.json]
"""
import argparse
import json
import os
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

PROJ = os.path.expanduser("~/proyectos/active/esencia-sevilla")
OUT = os.path.join(PROJ, "out")
URL_RE = re.compile(r"https?://[^\s\"'<>()\\]+")
HREF_RE = re.compile(r'(?:href|src)="(/[^"#?]*)')
SOURCES = [
    "src/data/sights.ts",
    "src/data/routes.ts",
    "src/data/events.ts",
    "src/data/blog-posts.ts",
    "src/data/apartment.ts",
    "src/data/reviews.ts",
    "data/events.json",
    "src/app/api/chat/route.ts",
    "deploy-hostalia/chat.php",
]
MSG_DIR = os.path.join(PROJ, "messages")


def collect_urls():
    urls = set()
    files = [os.path.join(PROJ, s) for s in SOURCES if os.path.exists(os.path.join(PROJ, s))]
    files += [os.path.join(MSG_DIR, f) for f in os.listdir(MSG_DIR)] if os.path.isdir(MSG_DIR) else []
    for path in files:
        with open(path, errors="replace") as fh:
            for m in URL_RE.findall(fh.read()):
                u = m.rstrip(".,;:)'\"")
                if "localhost" in u or "127.0.0.1" in u:
                    continue
                if "/api/v1/" in u or "/api/v2/" in u or "openrouter.ai/api" in u:
                    continue  # endpoints de API, no enlaces de usuario
                urls.add(u)
    return sorted(urls)


def check_one(url):
    def curl(method):
        try:
            r = subprocess.run(
                ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-L",
                 "--max-time", "25", "-A", "Mozilla/5.0 (X11; Linux x86_64)", method, url],
                capture_output=True, text=True, timeout=40)
            return r.stdout.strip()
        except Exception:  # noqa: BLE001
            return "000"

    code = curl("-I")
    if code in ("000", "400", "403", "405", "406", "429", "501", "503"):
        code = curl("-X" + "GET") or code
    code = int(code) if code.isdigit() else 0
    if 200 <= code < 300:
        status = "OK"
    elif 300 <= code < 400:
        status = "REDIR"
    elif code in (0, 403, 429, 503, 999):
        status = "BLOQUEADO"
    else:
        status = "ROTO"
    return url, code, status


def check_internal():
    problems = []
    if not os.path.isdir(OUT):
        return ["out/ no existe — lanza build-static-export.sh antes"]
    # inventario de destinos servibles (archivos reales + rutas de página)
    servible = set()
    for dp, _dn, fn in os.walk(OUT):
        rel = os.path.relpath(dp, OUT).replace(os.sep, "/")
        for f in fn:
            p = f"/{rel}/{f}" if rel != "." else f"/{f}"
            servible.add(p.replace("//", "/"))
            if f == "index.html":
                base = "" if rel == "." else f"/{rel}"
                servible.add(base + "/")
                servible.add(base or "/")
            elif f.endswith(".html"):
                servible.add(p[:-5])
                servible.add(p[:-5] + "/")
    n = 0
    for dp, _dn, fn in os.walk(OUT):
        for f in fn:
            if not f.endswith(".html"):
                continue
            with open(os.path.join(dp, f), errors="replace") as fh:
                html = fh.read()
            for link in HREF_RE.findall(html):
                n += 1
                link = link.rstrip("/") or "/"
                if link in ("/", ""):
                    continue
                ok = link in servible or (link + "/") in servible or f"{link}/index.html" in servible
                if not ok and not any(link.startswith(p) for p in ("/_next", "/fotos", "/icons", "/tours-360", "/files")):
                    problems.append((os.path.relpath(os.path.join(dp, f), OUT), link))
    print(f"internos: {n} enlaces revisados en el export")
    return problems


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-internal", action="store_true")
    ap.add_argument("--json", dest="json_out")
    args = ap.parse_args()

    urls = collect_urls()
    print(f"externos: {len(urls)} URLs únicas")
    results = []
    with ThreadPoolExecutor(max_workers=6) as pool:
        futs = [pool.submit(check_one, u) for u in urls]
        for i, fut in enumerate(as_completed(futs), 1):
            results.append(fut.result())
            if i % 25 == 0:
                print(f"  comprobadas {i}/{len(urls)}")

    results.sort(key=lambda r: ({"ROTO": 0, "BLOQUEADO": 1, "REDIR": 2, "OK": 3}[r[2]], r[0]))
    counts = {}
    for _u, _c, st in results:
        counts[st] = counts.get(st, 0) + 1
    print("\n== RESUMEN EXTERNOS ==", counts)
    for url, code, st in results:
        if st != "OK":
            print(f"[{st}] {code} {url}")

    internal = []
    if not args.no_internal:
        print("\n== INTERNOS ==")
        internal = check_internal()
        if internal:
            for page, link in internal:
                print(f"[ROTO-INT] {page} -> {link}")
        else:
            print("sin enlaces internos rotos")

    if args.json_out:
        with open(args.json_out, "w") as fh:
            json.dump({"externos": results,
                       "internos": [{"page": p, "link": l} for p, l in internal]}, fh, indent=1)

    roto = counts.get("ROTO", 0) + len(internal)
    sys.exit(1 if roto else 0)


if __name__ == "__main__":
    main()

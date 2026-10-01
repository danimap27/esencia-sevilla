#!/usr/bin/env python3
"""Subida recursiva del build estático al hosting de Hostalia por FTP_TLS.

- Idempotente: si el archivo remoto ya existe con el mismo tamaño, se salta.
- Reintenta cada archivo hasta 3 veces (los FTP se cortan).
- Log de progreso en stdout.
"""
import os
import pathlib
import ssl
import sys
import time
import ftplib
from ftplib import error_perm, error_temp

HOME = pathlib.Path.home()
LOCAL = HOME / "proyectos/active/esencia-sevilla/out"
REMOTE_ROOT = "/esenciasevilla.com"

env = dict(
    line.split("=", 1)
    for line in (HOME / ".secrets/hostalia-ftp.env").read_text().splitlines()
)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE  # cert de *.servicio-online.net (guía Hostalia)

ftp = ftplib.FTP_TLS(context=ctx)
ftp.connect(env["HOST"], 21, timeout=60)
ftp.login(env["USER"], env["PASS"])
ftp.prot_p()
ftp.set_pasv(True)
print(f"conectado: {ftp.getwelcome()[:70]}", flush=True)

stats = {"subidos": 0, "omitidos": 0, "dirs": 0, "fallos": []}


def ensure_dir(path: str) -> None:
    if path in ("", "/"):
        return
    try:
        ftp.mkd(path)
        stats["dirs"] += 1
    except error_perm as e:
        if "existe" in str(e).lower() or "exist" in str(e).lower() or "550" in str(e):
            pass  # ya está
        raise


def remote_size(path: str):
    try:
        return ftp.size(path)
    except Exception:
        return None


def upload_file(local: pathlib.Path, remote: str) -> None:
    size = local.stat().st_size
    if remote_size(remote) == size:
        stats["omitidos"] += 1
        return
    for attempt in (1, 2, 3):
        try:
            with local.open("rb") as fh:
                ftp.storbinary(f"STOR {remote}", fh)
            stats["subidos"] += 1
            return
        except (error_temp, EOFError, ConnectionError, OSError) as e:
            if attempt == 3:
                stats["fallos"].append(f"{remote}: {e}")
                return
            time.sleep(1.5 * attempt)
            reconnect()


def reconnect() -> None:
    global ftp
    try:
        ftp.close()
    except Exception:
        pass
    ftp = ftplib.FTP_TLS(context=ctx)
    ftp.connect(env["HOST"], 21, timeout=60)
    ftp.login(env["USER"], env["PASS"])
    ftp.prot_p()
    ftp.set_pasv(True)


def walk(local: pathlib.Path, remote: str) -> None:
    for entry in sorted(local.iterdir(), key=lambda p: (p.is_file(), p.name)):
        rpath = f"{remote}/{entry.name}"
        if entry.is_dir():
            ensure_dir(rpath)
            walk(entry, rpath)
        else:
            upload_file(entry, rpath)


# Renombrar el index de prueba para no dejarlo como DirectoryIndex colisionando
try:
    ftp.rename(f"{REMOTE_ROOT}/index.html", f"{REMOTE_ROOT}/index-test.html.bak")
    print("index de prueba renombrado a index-test.html.bak", flush=True)
except Exception:
    pass  # no existe o ya renombrado

t0 = time.time()
total = sum(1 for _ in LOCAL.rglob("*") if _.is_file())
print(f"subiendo {total} archivos desde {LOCAL} → {REMOTE_ROOT}", flush=True)

ftp.cwd(REMOTE_ROOT)
walk(LOCAL, REMOTE_ROOT)

dt = time.time() - t0
print(
    f"\nDONE en {dt:.0f}s | subidos={stats['subidos']} omitidos={stats['omitidos']} "
    f"dirs_nuevos={stats['dirs']} fallos={len(stats['fallos'])}",
    flush=True,
)
for f in stats["fallos"][:20]:
    print("  FALLO:", f)
sys.exit(1 if stats["fallos"] else 0)

#!/usr/bin/env python3
"""Sincroniza el export estático (out/) con el hosting Hostalia por FTPS.

- Sube TODO out/ a la RAÍZ de esenciasevilla.com/ (creando dirs).
- Borra remotos que ya no existan en out/ (libera inodos).
- NUNCA toca: .well-known/**, .user.ini, README-SUBIDA.txt, index-test.html.bak.

Uso: python3 scripts/hostalia-ftp-sync.py [--dry-run]
Credenciales: ~/.secrets/hostalia-ftp.env (HOST/USER/PASS).
"""
import os
import posixpath
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

import ftplib

ENV_PATH = os.path.expanduser("~/.secrets/hostalia-ftp.env")
ROOT = os.path.expanduser("~/proyectos/active/esencia-sevilla/out")
BASE = "esenciasevilla.com"
KEEP_EXTRA = {".user.ini", "README-SUBIDA.txt", "index-test.html.bak"}
WORKERS = 4
DRY = "--dry-run" in sys.argv


def load_env():
    env = {}
    with open(ENV_PATH) as fh:
        for line in fh:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip().strip("\"'")
    return env


ENV = load_env()


def connect():
    ftp = ftplib.FTP_TLS()
    ftp.connect(ENV["HOST"], 21, timeout=60)
    ftp.login(ENV["USER"], ENV["PASS"])
    ftp.prot_p()
    return ftp


def local_inventory():
    files, dirs = set(), set()
    for dirpath, dirnames, filenames in os.walk(ROOT):
        for d in dirnames:
            rel = os.path.relpath(os.path.join(dirpath, d), ROOT).replace(os.sep, "/")
            dirs.add(rel)
        for f in filenames:
            rel = os.path.relpath(os.path.join(dirpath, f), ROOT).replace(os.sep, "/")
            files.add(rel)
    return files, dirs


def remote_inventory(ftp):
    files = set()

    def walk(path, rel=""):
        for name, facts in ftp.mlsd(path):
            r = f"{rel}/{name}" if rel else name
            if facts["type"] == "dir":
                walk(f"{path}/{name}", r)
            elif facts["type"] == "file":
                files.add(r)

    walk(BASE)
    return files


def upload_one(rel):
    err = None
    for attempt in range(3):
        ftp = None
        try:
            ftp = connect()
            with open(os.path.join(ROOT, rel), "rb") as fh:
                ftp.storbinary(f"STOR {BASE}/{rel}", fh)
            return rel, None
        except Exception as exc:  # noqa: BLE001
            err = exc
            time.sleep(1 + attempt)
        finally:
            if ftp:
                try:
                    ftp.quit()
                except Exception:  # noqa: BLE001
                    pass
    return rel, err


def main():
    if not os.path.isdir(ROOT):
        sys.exit(f"No existe {ROOT} — lanza antes scripts/build-static-export.sh")

    local_files, local_dirs = local_inventory()
    print(f"local: {len(local_files)} archivos, {len(local_dirs)} dirs")

    ftp = connect()
    remote_files = remote_inventory(ftp)
    print(f"remoto: {len(remote_files)} archivos")

    # dirs primero (orden lexicográfico = padres antes que hijos)
    for rel in sorted(local_dirs):
        try:
            ftp.mkd(f"{BASE}/{rel}")
        except ftplib.error_perm:
            pass  # ya existe

    to_upload = sorted(local_files)
    ok = fail = 0
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futs = [pool.submit(upload_one, rel) for rel in to_upload]
        for i, fut in enumerate(as_completed(futs), 1):
            rel, err = fut.result()
            if err:
                fail += 1
                print(f"FALLO {rel}: {err}")
            else:
                ok += 1
            if i % 100 == 0 or i == len(to_upload):
                print(f"  subidos {i}/{len(to_upload)} (ok={ok} fail={fail})")

    to_delete = []
    for rel in sorted(remote_files - local_files):
        if rel in KEEP_EXTRA or rel.startswith(".well-known/"):
            continue
        to_delete.append(rel)
    print(f"a borrar: {len(to_delete)} archivos obsoletos")
    if not DRY:
        # conexión fresca: la de subidas largas muere por idle timeout
        try:
            ftp.quit()
        except Exception:  # noqa: BLE001
            pass
        ftp = connect()
        derr = 0
        for rel in to_delete:
            try:
                ftp.delete(f"{BASE}/{rel}")
            except (ftplib.error_perm, EOFError) as exc:
                try:
                    ftp = connect()
                except Exception:  # noqa: BLE001
                    pass
                derr += 1
                print(f"  no borrado {rel}: {exc}")
        print(f"borrados: {len(to_delete) - derr}, fallos: {derr}")
    ftp.quit()
    print(f"DONE subidos ok={ok} fail={fail}")


if __name__ == "__main__":
    main()

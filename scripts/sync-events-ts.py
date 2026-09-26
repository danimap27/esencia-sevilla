#!/usr/bin/env python3
"""Regenera src/data/events.ts (fallback estático de eventos) desde data/events.json.

El cron semanal de eventos actualiza data/events.json y después ejecuta este script
para mantener sincronizado el fallback que viaja en el bundle.

Uso:
    python3 scripts/sync-events-ts.py          # desde la raíz del repo
    python3 scripts/sync-events-ts.py --check  # solo verifica, no escribe
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
JSON_PATH = ROOT / "data" / "events.json"
TS_PATH = ROOT / "src" / "data" / "events.ts"
LOCALES = ("es", "en", "fr", "de", "it", "pt")


def esc(s: str) -> str:
    return str(s).replace("\\", "\\\\").replace("'", "\\'")


def record(d: dict, indent: str) -> str:
    """Bloque multilínea Record<Locale,string> con el estilo del repo."""
    lines = ["{"]
    for k in LOCALES:
        if k in d:
            lines.append(f"{indent}  {k}: '{esc(d[k])}',")
    lines.append(f"{indent}}}")
    return "\n".join(lines)


def render(events: list) -> str:
    out = [
        "import { SevilleEvent } from '@/types';",
        "",
        "// GENERADO por scripts/sync-events-ts.py a partir de data/events.json",
        "// No editar a mano: el cron semanal de eventos regenera este fichero.",
        "export const SEVILLE_EVENTS: SevilleEvent[] = [",
    ]
    for e in events:
        out.append("  {")
        out.append(f"    id: '{esc(e['id'])}',")
        out.append(f"    title: {record(e['title'], '    ')},")
        out.append(f"    description: {record(e['description'], '    ')},")
        out.append(f"    startDate: '{esc(e['startDate'])}',")
        out.append(f"    endDate: '{esc(e['endDate'])}',")
        out.append(f"    category: '{esc(e['category'])}',")
        out.append(f"    image: '{esc(e['image'])}',")
        if e.get("url"):
            out.append(f"    url: '{esc(e['url'])}',")
        loc = e.get("location")
        if loc:
            addr = f", address: '{esc(loc['address'])}'" if loc.get("address") else ""
            out.append(
                f"    location: {{ name: '{esc(loc['name'])}'{addr}, "
                f"lat: {loc['lat']}, lng: {loc['lng']} }},"
            )
        out.append(f"    isHighSeason: {'true' if e.get('isHighSeason') else 'false'},")
        out.append("  },")
    out.append("];")
    out.append("")
    return "\n".join(out)


def main() -> int:
    check = "--check" in sys.argv
    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    events = data.get("events", [])
    if not events:
        print("events.json sin eventos, nada que hacer", file=sys.stderr)
        return 1
    ts = render(events)
    if check:
        current = TS_PATH.read_text(encoding="utf-8") if TS_PATH.exists() else ""
        if current == ts:
            print(f"OK: events.ts sincronizado ({len(events)} eventos)")
            return 0
        print(f"DESINCRONIZADO: events.ts difiere del JSON ({len(events)} eventos)", file=sys.stderr)
        return 2
    TS_PATH.write_text(ts, encoding="utf-8")
    print(f"OK: {TS_PATH.relative_to(ROOT)} regenerado con {len(events)} eventos")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

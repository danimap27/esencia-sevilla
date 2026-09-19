#!/usr/bin/env python3
"""
Integra fotos 360° (equirectangulares) en el tour virtual del apartamento.

Uso:
    python3 scripts/add-360-photos.py <foto1.jpg> [foto2.jpg ...]
    python3 scripts/add-360-photos.py --dir ~/fotos-360/
    python3 scripts/add-360-photos.py --dir ~/fotos-360/ --order salon dormitorio cocina bano

Qué hace:
  1. Valida que cada imagen sea equirectangular (ratio ancho/alto ≈ 2:1)
  2. La redimensiona a máx. 4096 px de ancho y la comprime (JPG q82) para que
     el tour cargue rápido en móvil
  3. La guarda en public/tours-360/ con el nombre de escena correcto
     (salon, dormitorio, cocina, bano) detectado por el nombre del archivo

Consejo: haz las fotos con una cámara 360 (Insta360, Ricoh Theta) o una app
equirectangular, a la altura de los ojos (1,5 m) y con buena luz.
"""
import argparse
import os
import sys

try:
    from PIL import Image
except ImportError:
    print("Falta Pillow. Instálalo con: uv pip install pillow  (o pip install pillow)")
    sys.exit(1)

DEST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "tours-360")
DEST = os.path.normpath(DEST)

# nombre de escena esperado -> palabras clave para detectarla en el nombre del archivo
SCENE_KEYWORDS = {
    "salon": ["salon", "salón", "living", "sala"],
    "dormitorio": ["dormitorio", "bedroom", "habitacion", "habitación", "cuarto"],
    "cocina": ["cocina", "kitchen"],
    "bano": ["bano", "baño", "bathroom", "bath"],
}

MAX_WIDTH = 4096
QUALITY = 82
MIN_WIDTH_WARN = 3000


def detect_scene(filename: str) -> str | None:
    low = filename.lower()
    for scene, kws in SCENE_KEYWORDS.items():
        if any(kw in low for kw in kws):
            return scene
    return None


def process_image(path: str, scene: str) -> bool:
    try:
        im = Image.open(path)
        im = im.convert("RGB")
    except Exception as e:
        print(f"  ✗ {os.path.basename(path)}: no se puede abrir ({e})")
        return False

    w, h = im.size
    ratio = w / h if h else 0
    if not (1.85 <= ratio <= 2.15):
        print(f"  ✗ {os.path.basename(path)}: ratio {ratio:.2f} — NO es equirectangular (debe ser ≈2.00, p.ej. 8000x4000)")
        return False

    if w < MIN_WIDTH_WARN:
        print(f"  ⚠ {os.path.basename(path)}: solo {w}px de ancho (recomendado ≥4000 para no verse borroso)")

    if w > MAX_WIDTH:
        nh = round(h * MAX_WIDTH / w)
        resample = getattr(Image, "Resampling", Image).LANCZOS
        im = im.resize((MAX_WIDTH, nh), resample)

    out = os.path.join(DEST, f"{scene}.jpg")
    im.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    kb = os.path.getsize(out) // 1024
    print(f"  ✓ {os.path.basename(path)} → tours-360/{scene}.jpg ({im.width}x{im.height}, {kb} KB)")
    return True


def main():
    ap = argparse.ArgumentParser(description="Integrar fotos 360° en el tour del apartamento")
    ap.add_argument("files", nargs="*", help="archivos de imagen")
    ap.add_argument("--dir", help="carpeta con fotos (se cogen todas las imágenes)")
    ap.add_argument("--order", nargs=4, metavar=("SALON", "DORM", "COCINA", "BANO"),
                    help="asignar escenas por orden de archivo si el nombre no las identifica")
    args = ap.parse_args()

    paths = list(args.files)
    if args.dir:
        d = os.path.expanduser(args.dir)
        paths += sorted(
            os.path.join(d, f) for f in os.listdir(d)
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"))
        )

    if not paths:
        ap.print_help()
        sys.exit(1)

    os.makedirs(DEST, exist_ok=True)
    print(f"Destino: {DEST}\n")

    used = set()
    ok = 0
    for i, p in enumerate(paths):
        p = os.path.expanduser(p)
        if not os.path.isfile(p):
            print(f"  ✗ {p}: no existe")
            continue
        scene = detect_scene(os.path.basename(p))
        if scene is None and args.order:
            # asignación posicional: 1º salon, 2º dormitorio, 3º cocina, 4º bano
            remaining = [s for s in args.order if s not in used]
            scene = remaining[0] if remaining else None
        if scene is None:
            print(f"  ? {os.path.basename(p)}: no se identifica la escena — renómbralo (p.ej. salon.jpg) o usa --order")
            continue
        if scene in used:
            print(f"  ⚠ {os.path.basename(p)}: escena '{scene}' duplicada — se sobreescribe")
        if process_image(p, scene):
            used.add(scene)
            ok += 1

    print(f"\n{ok} foto(s) integradas.")
    missing = [s for s in SCENE_KEYWORDS if s not in used]
    if missing:
        print(f"Escenas sin foto: {', '.join(missing)}")
    print("\nSiguiente paso: reinicia el sitio (systemctl --user restart esencia-sevilla) y el botón")
    print("'Tour virtual 360°' aparecerá activo automáticamente en la galería.")


if __name__ == "__main__":
    main()

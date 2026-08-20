#!/bin/sh
# Regera o PDF de arquitetura a partir de arquitetura.html.
set -e
DIR=$(cd "$(dirname "$0")" && pwd)
CHROME=${CHROME:-$(command -v chromium || command -v chromium-browser || command -v google-chrome || echo /opt/pw-browsers/chromium)}

"$CHROME" --headless --no-sandbox --disable-gpu \
  --allow-file-access-from-files --font-render-hinting=none \
  --run-all-compositor-stages-before-draw --virtual-time-budget=8000 \
  --no-pdf-header-footer \
  --print-to-pdf="$DIR/Match-House-Arquitetura.pdf" \
  "file://$DIR/arquitetura.html"

python3 - "$DIR/Match-House-Arquitetura.pdf" <<'PY' || echo "metadados: pulados (pypdf ausente)"
import sys
from pypdf import PdfReader, PdfWriter
path = sys.argv[1]
r = PdfReader(path); w = PdfWriter()
for p in r.pages: w.add_page(p)
w.add_metadata({'/Title': 'Match House — Arquitetura Técnica',
                '/Author': 'Match House', '/Creator': 'Match House'})
with open(path, 'wb') as f: w.write(f)
PY
echo "ok: $DIR/Match-House-Arquitetura.pdf"

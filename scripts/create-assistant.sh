#!/usr/bin/env bash
# Creates the Vapi assistant from vapi-assistant.json and writes the resulting
# assistant ID into .env.local. Safe to re-run: it creates a NEW assistant each
# time, so delete old ones in the dashboard if you experiment.
set -euo pipefail
cd "$(dirname "$0")/.."

KEY_FILE="${VAPI_KEY_FILE:-$HOME/.vapi-key}"
if [ ! -f "$KEY_FILE" ]; then
  echo "✗ Private key not found at $KEY_FILE"
  echo "  Create it (it stays outside this project, never committed):"
  echo "    printf '%s' 'YOUR_VAPI_PRIVATE_KEY' > ~/.vapi-key && chmod 600 ~/.vapi-key"
  exit 1
fi
KEY="$(tr -d '[:space:]' < "$KEY_FILE")"

echo "→ Creating assistant on Vapi…"
BODY="$(mktemp)"
CODE="$(curl -sS -o "$BODY" -w '%{http_code}' -X POST https://api.vapi.ai/assistant \
  -H "Authorization: Bearer $KEY" \
  -H 'Content-Type: application/json' \
  --data-binary @vapi-assistant.json)"

if [ "$CODE" != "200" ] && [ "$CODE" != "201" ]; then
  echo "✗ Vapi returned HTTP $CODE:"
  cat "$BODY"; echo
  rm -f "$BODY"
  exit 1
fi

ID="$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['id'])" "$BODY")"
rm -f "$BODY"
echo "✓ Assistant created: $ID"

touch .env.local
python3 - "$ID" <<'PY'
import re, sys
aid = sys.argv[1]
path = '.env.local'
text = open(path).read()
if re.search(r'^VITE_VAPI_ASSISTANT_ID=.*$', text, re.M):
    text = re.sub(r'^VITE_VAPI_ASSISTANT_ID=.*$', f'VITE_VAPI_ASSISTANT_ID={aid}', text, flags=re.M)
else:
    text = text.rstrip('\n') + f'\nVITE_VAPI_ASSISTANT_ID={aid}\n'
open(path, 'w').write(text)
print('✓ .env.local updated with the assistant ID')
PY

echo
echo "Ab sirf VITE_VAPI_PUBLIC_KEY reh gayi — dashboard → Vapi API Keys → Public Key."
echo "Phir: npm run dev"

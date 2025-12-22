#!/usr/bin/env bash
set -euo pipefail

# run-local.sh - helper to run replace-attachment server locally
# Usage:
# 1) create a `.env.local` in this folder with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
#    or rely on `.env.example` (included) which exports VITE_* keys (index.js accepts both)
# 2) ./run-local.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "[run-local] Starting replace-attachment helper..."

if [ -f .env.local ]; then
  echo "[run-local] Sourcing .env.local"
  set -a
  # shellcheck disable=SC1091
  . .env.local
  set +a
elif [ -f .env.development ]; then
  echo "[run-local] Sourcing .env.development"
  set -a
  # shellcheck disable=SC1091
  . .env.development
  set +a
elif [ -f .env.example ]; then
  echo "[run-local] Sourcing .env.example (for dev only)"
  set -a
  # shellcheck disable=SC1091
  . .env.example
  set +a
else
  echo "[run-local] No .env.local, .env.development or .env.example found. You must set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env." >&2
fi

: ${PORT:=3001}
export PORT

echo "[run-local] Using PORT=${PORT}"

echo "[run-local] Running: node index.js"
node index.js

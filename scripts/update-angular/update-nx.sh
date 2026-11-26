#!/usr/bin/env bash
# Moves Nx to a release that supports the target Angular, when the installed one does not,
# and runs the required Nx migrations.
# Usage: update-nx.sh <angular-major>
set -euo pipefail

TARGET_MAJOR="${1:?Target Angular major is required}"
TEMP_DIR="${RUNNER_TEMP:?RUNNER_TEMP is required}"

mkdir -p "$TEMP_DIR/reported"

NX_SPEC=$(node scripts/update-angular/plan-nx.mjs "$TARGET_MAJOR")
if [ -z "$NX_SPEC" ]; then
  echo "Installed Nx already supports Angular $TARGET_MAJOR"
else
  pnpm nx migrate "$NX_SPEC" --include=required
  pnpm install --no-frozen-lockfile
  git add -A
  git diff --cached --quiet || git commit -m "chore: update Nx to ${NX_SPEC#nx@}"
fi

if [ -f migrations.json ]; then
  cp migrations.json "$TEMP_DIR/reported/nx.json"
  PENDING_FILE="$TEMP_DIR/pending-migrations.json"
  PENDING=$(node scripts/update-angular/pending-migrations.mjs migrations.json "$PENDING_FILE")
  if [ "$PENDING" != "0" ]; then
    pnpm nx migrate --run-migrations="$(realpath --relative-to=. "$PENDING_FILE")" --create-commits
  fi
  git rm -f --ignore-unmatch migrations.json
  git diff --cached --quiet || git commit -m "chore: remove Nx migrations file"
fi

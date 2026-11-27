#!/usr/bin/env bash
# Runs the collected Nx migrations that an earlier attempt did not commit yet (one commit each),
# then removes the migrations file and refreshes the lockfile.
set -euo pipefail

TEMP_DIR="${RUNNER_TEMP:?RUNNER_TEMP is required}"
PENDING_FILE="$TEMP_DIR/pending-migrations.json"

PENDING=$(node scripts/update-angular/pending-migrations.mjs migrations.json "$PENDING_FILE")
if [ "$PENDING" != "0" ]; then
  pnpm nx migrate --run-migrations="$(realpath --relative-to=. "$PENDING_FILE")" --create-commits
fi

git rm -f --ignore-unmatch migrations.json
pnpm install --no-frozen-lockfile

git add -A
git diff --cached --quiet || git commit -m "chore: remove migrations file and refresh lockfile"

#!/usr/bin/env bash
# Removes the pnpm overrides that are no longer needed after the packages bump.
# An override is obsolete when a lockfile resolved without any override still satisfies it.
set -euo pipefail

TEMP_DIR="${RUNNER_TEMP:?RUNNER_TEMP is required}"
FRESH="$TEMP_DIR/fresh-resolution"
REPORT_DIR="$TEMP_DIR/overrides-report"

git worktree add --detach "$FRESH"
node scripts/update-angular/remove-all-overrides.mjs "$FRESH/pnpm-workspace.yaml"
rm "$FRESH/pnpm-lock.yaml"
(cd "$FRESH" && pnpm install --lockfile-only --ignore-scripts)

node scripts/update-angular/find-obsolete-overrides.mjs pnpm-workspace.yaml "$FRESH/pnpm-lock.yaml" "$TEMP_DIR/override-decisions.json"
mkdir -p "$REPORT_DIR"
node scripts/update-angular/remove-obsolete-overrides.mjs pnpm-workspace.yaml "$TEMP_DIR/override-decisions.json" "$REPORT_DIR/overrides.md"
pnpm install --lockfile-only --ignore-scripts

git add -A
git diff --cached --quiet || git commit -m "chore: remove obsolete pnpm overrides"

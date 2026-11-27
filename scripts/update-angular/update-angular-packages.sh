#!/usr/bin/env bash
# Bumps every Angular package to the target major, one planned step at a time,
# merges the generated migrations, regenerates the lockfile and commits the result.
# Usage: update-angular-packages.sh <angular-major> <resolved-angular-version>
set -euo pipefail

TARGET_MAJOR="${1:?Target Angular major is required}"
VERSION="${2:?Resolved Angular version is required}"

TEMP_DIR="${RUNNER_TEMP:?RUNNER_TEMP is required}"
MIGRATIONS_DIR="$TEMP_DIR/migrations"
MERGE_MIGRATIONS="node scripts/update-angular/merge-migrations.mjs"

PLAN=$(node scripts/update-angular/plan-angular-packages.mjs "$TARGET_MAJOR" "$TEMP_DIR/missing-releases.log")
echo "$PLAN"

mkdir -p "$MIGRATIONS_DIR" "$TEMP_DIR/reported"
COUNT=0
MIGRATION_FILES=()

if [ -f migrations.json ]; then
  mv migrations.json "$MIGRATIONS_DIR/previous.json"
  MIGRATION_FILES+=("$MIGRATIONS_DIR/previous.json")
fi

while read -r spec; do
  [ -n "$spec" ] || continue
  ./node_modules/.bin/nx migrate "$spec"
  if [ -f migrations.json ]; then
    mv migrations.json "$MIGRATIONS_DIR/$COUNT.json"
    MIGRATION_FILES+=("$MIGRATIONS_DIR/$COUNT.json")
  fi
  $MERGE_MIGRATIONS migrations.json "${MIGRATION_FILES[@]}"
  COUNT=$((COUNT+1))
done <<< "$PLAN"

$MERGE_MIGRATIONS migrations.json "${MIGRATION_FILES[@]}"
pnpm install --no-frozen-lockfile
node scripts/update-angular/verify-versions.mjs "$TARGET_MAJOR"
cp migrations.json "$TEMP_DIR/reported/angular.json"

git add -A
git diff --cached --quiet || git commit -m "chore: update Angular to $VERSION"

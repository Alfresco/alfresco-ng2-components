#!/usr/bin/env bash
# Stores the outcome of a validation step and an excerpt of its log, with secrets redacted,
# so that the pull request can show them. Writes the sanitized name of the check to the step output.
# Required environment: CHECK_NAME, OUTCOME. Optional: SHA
set -euo pipefail

: "${CHECK_NAME:?}" "${OUTCOME:?}"
SHA="${SHA:-}"
TEMP_DIR="${RUNNER_TEMP:?RUNNER_TEMP is required}"

SAFE_NAME="${CHECK_NAME//\//-}"
RESULTS="$TEMP_DIR/validation-results/$SAFE_NAME"
ERROR_PATTERN='error|Error|ERROR|✖|FAIL'

mkdir -p "$RESULTS"
echo "$OUTCOME" > "$RESULTS/$SAFE_NAME.status"
if [ -n "$SHA" ]; then
  echo "$SHA" > "$RESULTS/$SAFE_NAME.sha"
fi

if [ -f "$TEMP_DIR/validation.log" ]; then
  CLEAN_LOG="$TEMP_DIR/validation-clean.log"

  # Strip the colors and redact private keys and tokens
  sed 's/\x1b\[[0-9;]*[A-Za-z]//g' "$TEMP_DIR/validation.log" | perl -0pe '
    s/-----BEGIN PGP PRIVATE KEY BLOCK-----.*?-----END PGP PRIVATE KEY BLOCK-----/[redacted PGP private key]/gs;
    s/\b(?:gh[pousr]_|github_pat_|npm_)[A-Za-z0-9_]{20,}/[redacted token]/g;
    s/x-access-token:[^@\s]+@/x-access-token:[redacted]@/g;
    s/(AUTHORIZATION:\s*basic\s+)\S+/$1\[redacted]/gi;
  ' > "$CLEAN_LOG"

  {
    if grep -qE "$ERROR_PATTERN" "$CLEAN_LOG"; then
      echo "Errors found in the full log (last 40 matching lines):"
      grep -nE "$ERROR_PATTERN" "$CLEAN_LOG" | tail -n 40 | cut -c1-300 | head -c 3500
      echo
      echo
    fi
    echo "End of the log (last 60 lines):"
    tail -n 60 "$CLEAN_LOG" | cut -c1-300 | tail -c 2000
  } > "$RESULTS/$SAFE_NAME.log"
fi

echo "safe-name=$SAFE_NAME" >> "$GITHUB_OUTPUT"

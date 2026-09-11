#!/usr/bin/env bash
set -euo pipefail

# Export your GPG public key to .git/signing.pub so the devcontainer can auto-import it.
# Usage:
#   ./.devcontainer/export-signing-key.sh
#   ./.devcontainer/export-signing-key.sh <KEY_ID>

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
OUTPUT_FILE="${REPO_ROOT}/.git/signing.pub"

KEY_ID="${1:-$(git config --global user.signingkey || true)}"
if [[ -z "${KEY_ID}" ]]; then
  echo "No key ID provided and git user.signingkey is not set."
  echo "Set it with: git config --global user.signingkey <YOUR_KEY_ID>"
  echo "Or run: ./.devcontainer/export-signing-key.sh <YOUR_KEY_ID>"
  exit 1
fi

available_bins=()
for candidate in gpg2 gpg; do
  if command -v "${candidate}" >/dev/null 2>&1; then
    available_bins+=("${candidate}")
  fi
done

if [[ ${#available_bins[@]} -eq 0 ]]; then
  echo "Neither gpg nor gpg2 is available on PATH."
  exit 1
fi

has_secret_key() {
  local bin="$1"
  "${bin}" --list-secret-keys --with-colons "${KEY_ID}" 2>/dev/null | grep -q '^sec'
}

try_export() {
  local bin="$1"
  "${bin}" --armor --export "${KEY_ID}" > "${OUTPUT_FILE}"
  [[ -s "${OUTPUT_FILE}" ]]
}

selected_bin=""
for bin in "${available_bins[@]}"; do
  if has_secret_key "${bin}"; then
    selected_bin="${bin}"
    break
  fi
done

if [[ -z "${selected_bin}" ]]; then
  selected_bin="${available_bins[0]}"
fi

rm -f "${OUTPUT_FILE}"
if ! try_export "${selected_bin}"; then
  for bin in "${available_bins[@]}"; do
    if [[ "${bin}" == "${selected_bin}" ]]; then
      continue
    fi
    if try_export "${bin}"; then
      selected_bin="${bin}"
      break
    fi
  done
fi

if [[ ! -s "${OUTPUT_FILE}" ]]; then
  rm -f "${OUTPUT_FILE}"
  echo "Failed to export public key for ${KEY_ID}."
  echo "Tried binaries: ${available_bins[*]}"
  echo "Check key visibility with:"
  echo "  gpg --list-secret-keys --keyid-format=long"
  echo "  gpg2 --list-secret-keys --keyid-format=long"
  exit 1
fi

echo "Exported public key ${KEY_ID} to ${OUTPUT_FILE}"
echo "Using: ${selected_bin}"
echo "Rebuild/start the devcontainer to auto-import it."

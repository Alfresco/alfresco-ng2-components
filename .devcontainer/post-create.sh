#!/usr/bin/env bash
set -euo pipefail

if command -v sudo >/dev/null 2>&1 && sudo -n true >/dev/null 2>&1; then
    sudo chown -R "$(whoami)": /commandhistory
fi

pnpm install --frozen-lockfile

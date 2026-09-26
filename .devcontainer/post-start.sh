#!/usr/bin/env bash
set -euo pipefail

# If pubring.kbx is bind-mounted read-only from host, skip import fallback.
if [ -f .git/signing.pub ] && [[ ! -f "${HOME}/.gnupg/pubring.kbx" || -w "${HOME}/.gnupg/pubring.kbx" ]]; then
    gpg --import .git/signing.pub
fi

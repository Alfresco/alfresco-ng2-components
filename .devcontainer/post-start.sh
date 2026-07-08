#!/usr/bin/env bash
set -euo pipefail

if [ -f .git/signing.pub ]; then
    gpg --import .git/signing.pub
fi

#!/usr/bin/env bash
# Signs the commits that are not pushed yet by rebasing them onto the remote branch (or the base branch
# when the update branch does not exist on the remote yet).
# Required environment: BRANCH, BASE_BRANCH, GPG_KEY
set -euo pipefail

: "${BRANCH:?}" "${BASE_BRANCH:?}" "${GPG_KEY:?}"

echo "$GPG_KEY" | gpg --batch --import
git config user.signingkey "$(gpg --list-secret-keys --with-colons | awk -F: '/^sec/ {print $5; exit}')"

UPSTREAM="origin/$BASE_BRANCH"
if git rev-parse --verify --quiet "refs/remotes/origin/$BRANCH" > /dev/null; then
  UPSTREAM="origin/$BRANCH"
fi
git rebase --force-rebase --gpg-sign "$UPSTREAM"

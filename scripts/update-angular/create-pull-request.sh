#!/usr/bin/env bash
# Opens the update pull request, or updates it when a re-run of the workflow resumed the branch.
# The pull request is a draft when validation did not fully pass.
# Required environment: GH_TOKEN, GH_REPO, BRANCH, VERSION, JOB_RESULTS, BASE_BRANCH, RUN_URL
set -euo pipefail

: "${GH_REPO:?}" "${BRANCH:?}" "${VERSION:?}" "${BASE_BRANCH:?}" "${RUN_URL:?}"

HEAD_SHA=$(gh api "repos/$GH_REPO/git/ref/heads/$BRANCH" --jq '.object.sha')
STATE=$(node scripts/update-angular/build-pull-request-body.mjs body.md validation report "$VERSION" "$RUN_URL" "$HEAD_SHA" $JOB_RESULTS)

TITLE="GH auto: Update Angular to $VERSION"
DRAFT_FLAG=""
if [ "$STATE" == "draft" ]; then
  DRAFT_FLAG="--draft"
  TITLE="$TITLE (needs manual fixes)"
fi

EXISTING=$(gh pr list --head "$BRANCH" --base "$BASE_BRANCH" --state open --json number,isDraft --jq '.[0] // empty | "\(.number) \(.isDraft)"')
if [ -z "$EXISTING" ]; then
  # shellcheck disable=SC2086
  gh pr create --base "$BASE_BRANCH" --head "$BRANCH" --title "$TITLE" --body-file body.md $DRAFT_FLAG
  exit 0
fi

read -r NUMBER IS_DRAFT <<< "$EXISTING"
echo "Updating pull request #$NUMBER"
gh api -X PATCH "repos/$GH_REPO/pulls/$NUMBER" -f title="$TITLE" -F body=@body.md > /dev/null

if [ "$STATE" == "draft" ] && [ "$IS_DRAFT" == "false" ]; then
  gh pr ready "$NUMBER" --undo
elif [ "$STATE" != "draft" ] && [ "$IS_DRAFT" == "true" ]; then
  gh pr ready "$NUMBER"
fi

#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

AFFECTED_E2E="$(./scripts/affected-folder.sh -b $TRAVIS_BRANCH -f "e2e")";
AFFECTED_LIBS="$(./scripts/affected-libs.sh -gnu -b $TRAVIS_BRANCH)";

if [[ $AFFECTED_LIBS =~ "core$" || $TRAVIS_PULL_REQUEST == "false"  ]];
then
    node ./scripts/check-env/check-ps-env.js --host "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" || exit 1;
    node ./scripts/check-env/check-cs-env.js --host "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" || exit 1;
    ./scripts/test-e2e-lib.sh -host http://localhost:4200 -proxy "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" -e "$E2E_EMAIL" --folder core --skip-lint -save --use-dist -b || exit 1;
else [[ $AFFECTED_E2E = "e2e" ]];
    HEAD_SHA_BRANCH="$(git merge-base origin/$BRANCH_NAME HEAD)"
    LIST_SPECS="$(git diff --name-only $HEAD_SHA_BRANCH HEAD | grep "^e2e" | paste -sd , -)"
    echo "Run the e2e with the specs: "$LIST_SPECS
    ./scripts/test-e2e-lib.sh -host http://localhost:4200 -proxy "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" -e "$E2E_EMAIL" --skip-lint -save --use-dist -s "$LIST_SPECS"
fi;

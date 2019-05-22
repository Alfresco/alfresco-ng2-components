#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

AFFECTED_E2E="$(./scripts/affected-folder.sh -b $TRAVIS_BRANCH -f "e2e")";
AFFECTED_LIBS="$(./scripts/affected-libs.sh -gnu -b $TRAVIS_BRANCH)";
if [[ $AFFECTED_LIBS =~ "content-services$"  || $AFFECTED_E2E = "e2e" || $TRAVIS_PULL_REQUEST == "false"  ]];
then
    node ./scripts/check-env/check-cs-env.js --host "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" || exit 1;
    ./scripts/test-e2e-lib.sh -host http://localhost:4200 -proxy "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" -e "$E2E_EMAIL" --folder search --skip-lint --use-dist -save  -b || exit 1;
fi;

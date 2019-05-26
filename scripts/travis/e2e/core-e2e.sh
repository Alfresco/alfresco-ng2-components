#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

./scripts/check-branch-updated.sh -b $TRAVIS_BRANCH || exit 1;
AFFECTED_E2E="$(./scripts/affected-folder.sh -b $TRAVIS_BRANCH -f "e2e")";
AFFECTED_LIBS="$(./scripts/affected-libs.sh -gnu -b $TRAVIS_BRANCH)";
echo "AFFECTED_E2E: "$AFFECTED_E2E
echo "AFFECTED_LIBS: "$AFFECTED_LIBS

if [[ $AFFECTED_LIBS =~ "core$" || $TRAVIS_PULL_REQUEST == "false"  ]];
then
    node ./scripts/check-env/check-ps-env.js --host "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" || exit 1;
    node ./scripts/check-env/check-cs-env.js --host "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" || exit 1;
    ./scripts/test-e2e-lib.sh -host http://localhost:4200 -proxy "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" -e "$E2E_EMAIL" --folder core -save --use-dist -b || exit 1;
else [[ $AFFECTED_E2E = "e2e" ]];
    HEAD_SHA_BRANCH="$(git merge-base origin/$TRAVIS_BRANCH HEAD)"
    LIST_CONTENT_SPECS="$(git diff --name-only $HEAD_SHA_BRANCH HEAD | grep "^e2e/content-services" | paste -sd , -)"
    if [[ $LIST_CONTENT_SPECS != "" ]];
    then
        echo "Run content e2e based on the sha $HEAD_SHA_BRANCH with the specs: "$LIST_CONTENT_SPECS
        ./scripts/test-e2e-lib.sh -host http://localhost:4200 -proxy "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" -e "$E2E_EMAIL" -ud -s "$LIST_CONTENT_SPECS"
    fi
    LIST_CLOUD_SPECS="$(git diff --name-only $HEAD_SHA_BRANCH HEAD | grep "^e2e/process-services-cloud" | paste -sd , -)"
    if [[ $LIST_CLOUD_SPECS != "" ]];
    then
        echo "Run cloud e2e based on the sha $HEAD_SHA_BRANCH with the specs: "$LIST_CLOUD_SPECS
        ./scripts/test-e2e-lib.sh -host http://localhost:4200 -u "$E2E_USERNAME" -p "$E2E_PASSWORD" -e "$E2E_EMAIL" -host_sso "$E2E_HOST_SSO" -host_bpm "$E2E_HOST_BPM" -host_identity "$E2E_HOST_IDENTITY" -ud -s "$LIST_CLOUD_SPECS"
    fi
fi;

#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

CONTEXT_ENV="process-services-cloud"
./scripts/check-branch-updated.sh -b $TRAVIS_BRANCH || exit 1;
AFFECTED_LIBS="$(./scripts/affected-libs.sh -gnu -b $TRAVIS_BRANCH)";
AFFECTED_E2E="$(./scripts/affected-folder.sh -b $TRAVIS_BRANCH -f "e2e/$CONTEXT_ENV")";

RUN_CHECK=$(echo node ./scripts/check-env/check-activiti-env.js --host "$E2E_HOST_BPM" --oauth "$E2E_HOST_SSO" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" --client 'activiti' || exit 1 )
RUN_E2E=$(echo ./scripts/test-e2e-lib.sh -host http://localhost:4200 -proxy "$E2E_HOST_BPM" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" -e "$E2E_EMAIL" -host_sso "$E2E_HOST_SSO" -host_bpm "$E2E_HOST_BPM" -host_identity "$E2E_HOST_IDENTITY" --use-dist )

if [[ $AFFECTED_LIBS =~ "$CONTEXT_ENV$" || $TRAVIS_PULL_REQUEST == "false"  ]];
then
    $RUN_CHECK
    $RUN_E2E --folder $CONTEXT_ENV
else [[ $AFFECTED_E2E = "e2e/$CONTEXT_ENV" ]];
    HEAD_SHA_BRANCH="$(git merge-base origin/$TRAVIS_BRANCH HEAD)"
    LIST_SPECS="$(git diff --name-only $HEAD_SHA_BRANCH HEAD | grep "^e2e/$CONTEXT_ENV" | paste -sd , -)"
    if [[ $LIST_SPECS != "" ]];
    then
        echo "Run $CONTEXT_ENV e2e based on the sha $HEAD_SHA_BRANCH with the specs: "$LIST_SPECS
        $RUN_CHECK
        $RUN_E2E --specs "$LIST_SPECS"
    fi
fi;

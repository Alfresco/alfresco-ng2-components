#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

export CONTEXT_ENV="process-services"
export PROVIDER='BPM'
export AUTH_TYPE="OAUTH"

echo "Start process services e2e"

if [ "${TRAVIS_EVENT_TYPE}" == "pull_request" ]; then
    echo "Calculate affected e2e $BASE_HASH $HEAD_HASH"
    ./scripts/git-util/check-branch-updated.sh -b $TRAVIS_BRANCH || exit 1;
    AFFECTED_LIBS="$(nx affected:libs --base=$BASE_HASH --head=$HEAD_HASH --plain)"
    echo "Affected libs ${AFFECTED_LIBS}"
    AFFECTED_E2E="$(./scripts/git-util/affected-folder.sh -b $TRAVIS_BRANCH -f "e2e/$CONTEXT_ENV")";
    echo "Affected e2e ${AFFECTED_E2E}"
fi;

RUN_E2E=$(echo ./scripts/test-e2e-lib.sh -host http://localhost:4200 -proxy "$E2E_HOST" -host_sso "$HOST_SSO" -identity_admin_email "$E2E_ADMIN_EMAIL_IDENTITY" -identity_admin_password "$E2E_ADMIN_PASSWORD_IDENTITY" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" --use-dist || exit 1)

if [[  $AFFECTED_LIBS =~ "testing" || $AFFECTED_LIBS =~ "$CONTEXT_ENV" || "${TRAVIS_EVENT_TYPE}" == "push" ||  "${TRAVIS_EVENT_TYPE}" == "api"  ]]; then
    echo "Run all e2e $CONTEXT_ENV"
    $RUN_E2E --folder $CONTEXT_ENV
else if [[ $AFFECTED_E2E == "e2e/$CONTEXT_ENV" ]]; then
        echo "Run affected e2e"

        HEAD_SHA_BRANCH="$(git merge-base origin/$TRAVIS_BRANCH HEAD)"
        LIST_SPECS="$(git diff --name-only $HEAD_SHA_BRANCH HEAD | grep "^e2e/$CONTEXT_ENV/" | paste -sd , -)"

        echo "Run $CONTEXT_ENV e2e based on the sha $HEAD_SHA_BRANCH with the specs: "$LIST_SPECS

        if [[ $LIST_SPECS != "" ]];
        then
            $RUN_E2E --specs "$LIST_SPECS"
        fi
    fi
fi;

#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

CONTEXT_ENV="process-services-cloud"

./scripts/git-util/check-branch-updated.sh -b $TRAVIS_BRANCH || exit 1;

AFFECTED_LIBS="$(./scripts/affected-libs.sh -gnu -b $TRAVIS_BRANCH)";
AFFECTED_E2E="$(./scripts/git-util/affected-folder.sh -b $TRAVIS_BRANCH -f "e2e/$CONTEXT_ENV")";

RUN_E2E=$(echo ./scripts/test-e2e-lib.sh -host http://localhost:4200 -proxy "$E2E_HOST_BPM" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" -e "$E2E_EMAIL" -host_sso "$E2E_HOST_SSO" -host_bpm "$E2E_HOST_BPM" -host_identity "$E2E_HOST_IDENTITY" -identity_admin_email "$E2E_ADMIN_EMAIL_IDENTITY" -identity_admin_password "$E2E_ADMIN_PASSWORD_IDENTITY" -prefix $TRAVIS_BUILD_NUMBER  --use-dist -gnu )

if [[  $AFFECTED_LIBS =~ "testing" || $AFFECTED_LIBS =~ "$CONTEXT_ENV" || $TRAVIS_PULL_REQUEST == "false"  ]];
then
    node ./scripts/check-env/check-activiti-env.js --host "$E2E_HOST_BPM" --oauth "$E2E_HOST_SSO" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" --client 'activiti' || exit 1
    node ./scripts/check-env/check-cs-env.js --host "$E2E_HOST_BPM" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" || exit 1

    $RUN_E2E --folder $CONTEXT_ENV
else if [[ $AFFECTED_E2E = "e2e/$CONTEXT_ENV" ]];
    then
        HEAD_SHA_BRANCH="$(git merge-base origin/$TRAVIS_BRANCH HEAD)"
        LIST_SPECS="$(git diff --name-only $HEAD_SHA_BRANCH HEAD | grep "^e2e/$CONTEXT_ENV" | paste -sd , -)"
        node ./scripts/check-env/check-activiti-env.js --host "$E2E_HOST_BPM" --oauth "$E2E_HOST_SSO" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" --client 'activiti' || exit 1
        if [[ $LIST_SPECS != "" ]];
        then
            echo "Run $CONTEXT_ENV e2e based on the sha $HEAD_SHA_BRANCH with the specs: "$LIST_SPECS
            $RUN_E2E --specs "$LIST_SPECS"
        fi
    fi
fi;

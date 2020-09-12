#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Start search e2e"

cd $DIR/../../../

export CONTEXT_ENV="search"
export PROVIDER='ECM'
export AUTH_TYPE='BASIC'

if [ "${TRAVIS_EVENT_TYPE}" == "pull_request" ];then
    echo "Calculate affected e2e $BASE_HASH $HEAD_HASH"
    ./scripts/git-util/check-branch-updated.sh -b $TRAVIS_BRANCH || exit 1;
    AFFECTED_LIBS="$(nx affected:libs --base=$BASE_HASH --head=$HEAD_HASH --plain)"
    echo "Affected libs ${AFFECTED_LIBS}"
    AFFECTED_E2E="$(./scripts/git-util/affected-folder.sh -b $TRAVIS_BRANCH -f "e2e/$CONTEXT_ENV")";
    echo "Affected e2e ${AFFECTED_E2E}"
fi;

./node_modules/@alfresco/adf-cli/bin/adf-cli check-cs-env --host "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" || exit 1
RUN_E2E=$(echo ./scripts/test-e2e-lib.sh -host http://localhost:4200 -proxy "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" --use-dist -m 2 -b || exit 1)

if [[  $AFFECTED_LIBS =~ "testing" || $AFFECTED_LIBS =~ "content-services" || "${TRAVIS_EVENT_TYPE}" == "push"  ]];
then
    $RUN_E2E --folder $CONTEXT_ENV
else if [[ $AFFECTED_E2E  == "e2e/$CONTEXT_ENV" ]];
    then
        HEAD_SHA_BRANCH="$(git merge-base origin/$TRAVIS_BRANCH HEAD)"
        LIST_SPECS="$(git diff --name-only $HEAD_SHA_BRANCH HEAD | grep "^e2e/$CONTEXT_ENV" | paste -sd , -)"

        echo "Run $CONTEXT_ENV e2e based on the sha $HEAD_SHA_BRANCH with the specs: "$LIST_SPECS

        if [[ $LIST_SPECS != "" ]];
        then
            $RUN_E2E --specs "$LIST_SPECS"
        fi
    fi
fi;

#!/usr/bin/env bash

echo "Start e2e"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

BASE_DIRECTORY=$(echo "$CONTEXT_ENV" | cut -d "/" -f1)

if [ "${TRAVIS_EVENT_TYPE}" == "pull_request" ]; then
    echo "Calculate affected e2e $BASE_HASH $HEAD_HASH"
    echo "nx affected:libs --base=$BASE_HASH --head=$HEAD_HASH --plain"
    AFFECTED_LIBS="$(nx affected:libs --base=$BASE_HASH --head=$HEAD_HASH --plain || exit 1)"
    echo "Affected libs ${AFFECTED_LIBS}"
    AFFECTED_E2E="$(./scripts/git-util/affected-folder.sh -b $TRAVIS_BRANCH -f "e2e/$CONTEXT_ENV")";
    echo "Affected e2e ${AFFECTED_E2E}"
fi;

if [[  $AFFECTED_LIBS =~ "testing" || $AFFECTED_LIBS =~ "$BASE_DIRECTORY" ||  "${TRAVIS_EVENT_TYPE}" == "push" ||  "${TRAVIS_EVENT_TYPE}" == "api" ]]; then
    echo "Run all e2e $CONTEXT_ENV"
    ./scripts/test-e2e-lib.sh --use-dist
else if [[ $AFFECTED_E2E  == "e2e/$CONTEXT_ENV" ]]; then
        echo "Run affected e2e"

        HEAD_SHA_BRANCH="$(git merge-base origin/$TRAVIS_BRANCH HEAD)"
        LIST_SPECS="$(git diff --name-only $HEAD_SHA_BRANCH HEAD | grep "^e2e/$CONTEXT_ENV" | paste -sd , -)"

        echo "Run $CONTEXT_ENV e2e based on the sha $HEAD_SHA_BRANCH with the specs: "$LIST_SPECS

        if [[ $LIST_SPECS != "" ]]; then
            ./scripts/test-e2e-lib.sh --use-dist
        fi
    fi
fi;

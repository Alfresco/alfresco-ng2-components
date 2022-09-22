#!/usr/bin/env bash

echo "Start e2e"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

BASE_DIRECTORY=$(echo "$FOLDER" | cut -d "/" -f1)
verifyLib=$1;
echo "Step1 - Verify if affected libs contains $verifyLib"

AFFECTED_LIB="$(./scripts/travis/affected-contains.sh $verifyLib )";
if [ ${AFFECTED_LIB} == true ]; then
    echo "Step2 - $verifyLib affected... will execute e2e"

    if [ "${TRAVIS_EVENT_TYPE}" == "pull_request" ]; then
        echo "Calculate affected e2e $BASE_HASH $HEAD_HASH"
        echo "nx affected:libs --base=$BASE_HASH --head=$HEAD_HASH --plain"
        AFFECTED_LIBS="$(nx affected:libs --base=$BASE_HASH --head=$HEAD_HASH --plain || exit 1)"
        echo "Affected libs ${AFFECTED_LIBS}"
        AFFECTED_E2E="$(./scripts/git-util/affected-folder.sh -b $TRAVIS_BRANCH -f "e2e/$FOLDER")";
        echo "Affected e2e ${AFFECTED_E2E}"
    fi;

    if [[  $AFFECTED_LIBS =~ "testing" || $AFFECTED_LIBS =~ "$BASE_DIRECTORY" ||  "${TRAVIS_EVENT_TYPE}" == "push" ||  "${TRAVIS_EVENT_TYPE}" == "api" ||  "${TRAVIS_EVENT_TYPE}" == "cron" ]]; then
        echo "Run all e2e $FOLDER"
        ./scripts/test-e2e-lib.sh --use-dist
    else if [[ $AFFECTED_E2E  == "e2e/$FOLDER" ]]; then
            echo "Run affected e2e"

            HEAD_SHA_BRANCH="$(git merge-base origin/$TRAVIS_BRANCH HEAD)"
            LIST_SPECS="$(git diff --name-only $HEAD_SHA_BRANCH HEAD | grep "^e2e/$FOLDER" | paste -sd , -)"

            echo "Run $FOLDER e2e based on the sha $HEAD_SHA_BRANCH with the specs: "$LIST_SPECS

            if [[ $LIST_SPECS != "" ]]; then
                ./scripts/test-e2e-lib.sh --use-dist
            fi
        fi
    fi;

else
    echo "Step2 - Lib $verifyLib NOT affected. No need to run e2e"
    exit 0
fi

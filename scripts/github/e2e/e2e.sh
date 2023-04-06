#!/usr/bin/env bash
echo "Start e2e"
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

BASE_DIRECTORY=$(echo "$FOLDER" | cut -d "/" -f1)
verifyLib=$1;
deps=$2;
REGEX="(repository|workflow)_dispatch"

# set test-e2e params
if [ -n "$3" ]; then
      e2eParams="--$3"
else
      e2eParams=""
fi

echo "Step1 - Verify if affected libs contains $verifyLib or if deps $deps are affected"

AFFECTED_LIB=$(./scripts/github/affected-contains.sh $verifyLib $deps)

if [ ${AFFECTED_LIB} == true ]; then
    echo "Step2 - $verifyLib OR deps $deps affected... will execute e2e"

    if [ "${GITHUB_EVENT_NAME}" == "pull_request" ]; then
        echo "Calculate affected e2e $BASE_HASH $HEAD_HASH"
        echo "nx affected:libs --base=$BASE_HASH --head=$HEAD_HASH --plain"
        AFFECTED_LIBS="$(nx affected:libs --base=$BASE_HASH --head=$HEAD_HASH --plain || exit 1)"
        echo "Affected libs ${AFFECTED_LIBS}"
        AFFECTED_E2E="$(./scripts/git-util/affected-folder.sh -b $GITHUB_BASE_REF -f "e2e/$FOLDER")";
        echo "Affected e2e ${AFFECTED_E2E}"
    fi;

    if [ "${GITHUB_EVENT_NAME}" == "schedule" ]; then
        echo "CRON running everything "
    fi;

    if [[  $AFFECTED_LIBS =~ "testing" || $AFFECTED_LIBS =~ "$BASE_DIRECTORY" ||  "${GITHUB_EVENT_NAME}" == "push" ||  "${GITHUB_EVENT_NAME}" == "$REGEX" ||  "${GITHUB_EVENT_NAME}" == "schedule" ]]; then
        echo "Run all e2e $FOLDER"
        ./scripts/test-e2e-lib.sh --use-dist $e2eParams
    else if [[ $AFFECTED_E2E  == "e2e/$FOLDER" ]]; then
            echo "Run affected e2e"

            HEAD_SHA_BRANCH="$(git merge-base origin/$GITHUB_HEAD_REF HEAD)"
            LIST_SPECS="$(git diff --name-only $HEAD_SHA_BRANCH HEAD | grep "^e2e/$FOLDER" | paste -sd , -)"

            echo "Run $FOLDER e2e based on the sha $HEAD_SHA_BRANCH with the specs: "$LIST_SPECS

            if [[ $LIST_SPECS != "" ]]; then
                ./scripts/test-e2e-lib.sh --use-dist $e2eParams
            fi
        fi
    fi;

else
    echo "Step2 - Lib $verifyLib OR deps $deps NOT affected. No need to run e2e"
    exit 0
fi

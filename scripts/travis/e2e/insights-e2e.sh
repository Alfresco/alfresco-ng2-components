#!/usr/bin/env bash

echo "Start insight e2e"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export PROVIDER='BPM'
export AUTH_TYPE='OAUTH'

cd $DIR/../../../

if [ "${TRAVIS_EVENT_TYPE}" == "pull_request" ]; then
    echo "Calculate affected e2e $BASE_HASH $HEAD_HASH"
    ./scripts/git-util/check-branch-updated.sh -b $TRAVIS_BRANCH || exit 1;
    echo "Affected libs ${AFFECTED_LIBS}"
    AFFECTED_LIBS="$(nx affected:libs --base=$BASE_HASH --head=$HEAD_HASH --plain)"
    echo "Affected e2e ${AFFECTED_E2E}"
fi;

if [[  $AFFECTED_LIBS =~ "testing" || $AFFECTED_LIBS =~ "insight" || "${TRAVIS_EVENT_TYPE}" == "push" ||  "${TRAVIS_EVENT_TYPE}" == "api"  ]];
then
  ./node_modules/@alfresco/adf-cli/bin/adf-cli check-ps-env --host "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" || exit 1;
  ./scripts/test-e2e-lib.sh -host http://localhost:4200 -proxy "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" --folder insights --use-dist   || exit 1;
fi;

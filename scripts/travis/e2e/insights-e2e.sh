#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export PROVIDER='BPM'
export AUTH_TYPE='BASIC'

cd $DIR/../../../

if [[ $TRAVIS_PULL_REQUEST == "true"  ]]; then
    ./scripts/git-util/check-branch-updated.sh -b $TRAVIS_BRANCH || exit 1;
    AFFECTED_LIBS="$(nx affected:libs --base=$BASE_HASH --head=$HEAD_HASH --plain)"
fi;

if [[  $AFFECTED_LIBS =~ "testing" || $AFFECTED_LIBS =~ "insight" || $TRAVIS_PULL_REQUEST == "false"  ]];
then
  ./node_modules/@alfresco/adf-cli/bin/adf-cli check-ps-env --host "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" || exit 1;
  ./scripts/test-e2e-lib.sh -host http://localhost:4200 -proxy "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" -e "$E2E_EMAIL" --folder insights --use-dist   || exit 1;
fi;

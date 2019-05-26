#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

./scripts/check-branch-updated.sh -b $TRAVIS_BRANCH || exit 1;
AFFECTED_LIBS="$(./scripts/affected-libs.sh -gnu -b $TRAVIS_BRANCH)";
if [[ $AFFECTED_LIBS =~ "process-services-cloud$" || $TRAVIS_PULL_REQUEST == "false"  ]];
then
    node ./scripts/check-env/check-activiti-env.js --host "$E2E_HOST_BPM" --oauth "$E2E_HOST_SSO" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" --client 'activiti' || exit 1;
    ./scripts/test-e2e-lib.sh -host http://localhost:4200 -proxy "$E2E_HOST_BPM" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" -e "$E2E_EMAIL" -host_sso "$E2E_HOST_SSO" -host_bpm "$E2E_HOST_BPM" -host_identity "$E2E_HOST_IDENTITY" --folder process-services-cloud --skip-lint --use-dist -b -save || exit 1;
fi;

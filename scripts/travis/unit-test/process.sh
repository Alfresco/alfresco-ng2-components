#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

AFFECTED_LIBS="$(./scripts/affected-libs.sh -gnu -b $TRAVIS_BRANCH)";
if [[ $AFFECTED_LIBS =~ "process-services$" || $TRAVIS_PULL_REQUEST == "false"  ]];
then
    ng test process-services --watch=false || exit 1;
fi;
AFFECTED_LIBS="$(./scripts/affected-libs.sh -gnu -b $TRAVIS_BRANCH)";
if [[ $AFFECTED_LIBS =~ "insights$" || $TRAVIS_PULL_REQUEST == "false"  ]];
then
    ng test insights --watch=false || exit 1;
fi;
AFFECTED_LIBS="$(./scripts/affected-libs.sh -gnu -b $TRAVIS_BRANCH)";
if [[ $AFFECTED_LIBS =~ "process-services-cloud$" || $TRAVIS_PULL_REQUEST == "false"  ]];
then
    ng test process-services-cloud --watch=false || exit 1;
fi;

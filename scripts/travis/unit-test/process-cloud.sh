#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

command="concurrently "

cd $DIR/../../../

AFFECTED_LIBS="$(./scripts/affected-libs.sh -gnu -b $TRAVIS_BRANCH)";

echo "================== process-services-cloud unit ==================="
if [[ $AFFECTED_LIBS =~ "process-services-cloud$" || $TRAVIS_PULL_REQUEST == "false"  ]];
then
    ng test process-services-cloud --watch=false || exit 1;
fi;

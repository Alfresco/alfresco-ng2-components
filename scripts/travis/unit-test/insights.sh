#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

command="concurrently "

cd $DIR/../../../

AFFECTED_LIBS="$(./scripts/affected-libs.sh -gnu -b $TRAVIS_BRANCH)";

echo "================== insights unit ==================="
if [[ $AFFECTED_LIBS =~ "insights$" || $TRAVIS_PULL_REQUEST == "false"  ]];
then
    ng test insights --watch=false || exit 1;
fi;

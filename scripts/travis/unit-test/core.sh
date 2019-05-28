#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

AFFECTED_LIBS="$(./scripts/affected-libs.sh -gnu -b $TRAVIS_BRANCH)";

echo "================== core unit ==================="

if [[ $AFFECTED_LIBS =~ "core$" || $TRAVIS_PULL_REQUEST == "false" ]];
then
    ng test core --watch=false || exit 1;
fi;

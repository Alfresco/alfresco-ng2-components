#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

AFFECTED_LIBS="$(./scripts/affected-libs.sh -gnu -b $TRAVIS_BRANCH)";

echo "================== core unit ==================="

if [[ $AFFECTED_LIBS =~ "core$" || $TRAVIS_PULL_REQUEST == "false" ]];
then
    ng test core --watch=false || exit 1;
fi;

echo "================== extensions unit ==================="

if [[ $AFFECTED_LIBS =~ "extensions$" || $TRAVIS_PULL_REQUEST == "false"  ]];
then
    ng test extensions --watch=false || exit 1;
fi;

echo "================== demo unit ==================="

if ([ "$TRAVIS_BRANCH" = "master" ]); then
   (./scripts/start.sh -t -ss  -si || exit 1;);
else
   (./scripts/start.sh -dev -t -ss -si || exit 1;);
fi;

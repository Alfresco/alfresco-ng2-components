#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../


AFFECTED_LIBS="$(nx affected:libs --base=$BASE_HASH --head=$HEAD_HASH --plain)"

echo "================== core unit ==================="

if [[ $AFFECTED_LIBS =~ "core" || $TRAVIS_PULL_REQUEST == "false" ]];
then
    ng test core --watch=false || exit 1;
fi;

echo "================== extensions unit ==================="

if [[ $AFFECTED_LIBS =~ "extensions" || $TRAVIS_PULL_REQUEST == "false"  ]];
then
    ng test extensions --watch=false || exit 1;
fi;

# bash <(curl -s https://codecov.io/bash) -X gcov

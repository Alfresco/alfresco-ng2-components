#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

ng test content-services --watch=false || exit 1;

# echo "================== content-services unit ==================="

AFFECTED_LIBS="$(nx affected:libs --base=$BASE_HASH --head=$HEAD_HASH --plain)"
if [[ $AFFECTED_LIBS =~ "content-services" || $TRAVIS_PULL_REQUEST == "false"  ]];
then
    ng test content-services --watch=false || exit 1;
fi;

# bash <(curl -s https://codecov.io/bash) -X gcov

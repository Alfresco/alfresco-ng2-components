#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

ng test content-services --watch=false || exit 1;

echo "================== AFFECTED_LIBS  ${AFFECTED_LIBS} ==================="

echo "================== content-services unit ==================="

AFFECTED_LIBS="$(nx affected:libs --base=$BASE_HASH --head=$HEAD_HASH --plain || exit 1)"
if [[ $AFFECTED_LIBS =~ "content-services" ||  "${TRAVIS_EVENT_TYPE}" == "push"  ]];
then
    ng test content-services --watch=false || exit 1;
fi;

bash <(curl -s https://codecov.io/bash) -X gcov

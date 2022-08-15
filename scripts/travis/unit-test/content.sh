#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

AFFECTED_LIBS="$(nx affected:libs --base=$BASE_HASH --head=$HEAD_HASH --plain || exit 1)"

echo "================== AFFECTED_LIBS  ${AFFECTED_LIBS} ==================="

echo "================== content-services unit ==================="

if [[ $AFFECTED_LIBS =~ "content-services" ||  "${TRAVIS_EVENT_TYPE}" == "cron" ]];
then
    ng test content-services --watch=false || exit 1;
fi;

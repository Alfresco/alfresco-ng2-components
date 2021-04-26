#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../


AFFECTED_LIBS="$(nx affected:libs --base=$BASE_HASH --head=$HEAD_HASH --plain || exit 1)"

echo "================== AFFECTED_LIBS  ${AFFECTED_LIBS} ==================="

echo "================== core unit ==================="

if [[ $AFFECTED_LIBS =~ "core" || "${TRAVIS_EVENT_TYPE}" == "push" || "${TRAVIS_EVENT_TYPE}" == "cron" ]];
then
    ng test core --watch=false || exit 1;
fi;

echo "================== extensions unit ==================="

if [[ $AFFECTED_LIBS =~ "extensions" || "${TRAVIS_EVENT_TYPE}" == "push" || "${TRAVIS_EVENT_TYPE}" == "cron" ]];
then
    ng test extensions --watch=false || exit 1;
fi;

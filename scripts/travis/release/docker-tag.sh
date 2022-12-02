#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../../../

if [[ $TRAVIS_BRANCH =~ ^master(-patch.*)?$ ]]; then
    export TAGS=$(grep -m1 version package.json | awk '{ print $2 }' | sed 's/[", ]//g')
else
    if [[ "${TRAVIS_PULL_REQUEST_BRANCH}" != "" ]];
    then
        export TAGS="$TRAVIS_PULL_REQUEST_BRANCH-$TRAVIS_BUILD_NUMBER"
    else
        export TAGS="$TRAVIS_BRANCH-$TRAVIS_BUILD_NUMBER,$TRAVIS_BRANCH"
    fi;

fi;

echo $TAGS

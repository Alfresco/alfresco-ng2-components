#!/usr/bin/env bash

if [[ $TRAVIS_BRANCH == "master" ]]; then
    TAG_VERSION=$(grep -m1 version package.json | awk '{ print $2 }' | sed 's/[", ]//g')
else
    TAG_VERSION=$TRAVIS_BRANCH-$TRAVIS_BUILD_NUMBER
fi;

echo $TAG_VERSION;

#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../../../
BRANCH=${GITHUB_REF##*/}
if [[ $BRANCH =~ ^master(-patch.*)?$ ]]; then
    export TAGS=$(grep -m1 version package.json | awk '{ print $2 }' | sed 's/[", ]//g')
else
    if [[ "${GITHUB_BASE_REF}" != "" ]];
    then
        export TAGS="${GITHUB_BASE_REF}-$GH_BUILD_NUMBER"
    else
        export TAGS="$GITHUB_BASE_REF-$GH_BUILD_NUMBER,$GITHUB_BASE_REF"
    fi;
fi;

if [[ -n "$GITHUB_ACTIONS" ]]; then
    echo "TAGS=$TAGS" >> $GITHUB_ENV;
fi
echo "$TAGS"

#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../
BRANCH=${GITHUB_REF##*/}
if [[ $BRANCH =~ ^develop(-patch.*)?$ ]]
then
    echo "Replace NPM version with new Alpha tag"
    ./scripts/update-version.sh -gnu || exit 1;
fi

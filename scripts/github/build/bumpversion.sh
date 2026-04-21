#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../
BRANCH=${GITHUB_REF##*/}
if [[ ! $BRANCH =~ ^master(-patch.*)?$ ]]
then
    echo "Replace NPM version with new Alpha tag"
    ./scripts/update-version.sh -gnu || exit 1;
else
    # For master branch, read current version from package.json
    CURRENT_VERSION=$(node -p "require('./package.json').version")
    echo "Current version for master branch: $CURRENT_VERSION"
    echo "release_version=$CURRENT_VERSION" >> $GITHUB_OUTPUT
fi

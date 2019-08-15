#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

rm -rf tmp && mkdir tmp;

./node_modules/@alfresco/adf-cli/bin/adf-cli update-commit-sha --pointer "HEAD" --pathPackage "$(pwd)"

if [[ $TRAVIS_PULL_REQUEST == "false" ]];
then
    ./scripts/update-version.sh -nextalpha -gnu -minor -components
    ./scripts/npm-build-all.sh -c || exit 1;
else
    ./scripts/update-version.sh -gnu -alpha || exit 1;
    ./scripts/smart-build.sh -b $TRAVIS_BRANCH  -gnu || exit 1;
fi;

echo "====== Build Demo shell dist ====="
npm run build:dist || exit 1;

echo "====== License Check ====="
npm run license-checker

#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

rm -rf tmp && mkdir tmp;

./scripts/lint.sh || exit 1;

if [[ $TRAVIS_PULL_REQUEST == "false" ]];
then
    ./scripts/npm-build-all.sh || exit 1;
else
    ./scripts/update-version.sh -gnu -alpha || exit 1;
    npm install;
    ./scripts/smart-build.sh -b $TRAVIS_BRANCH  -gnu || exit 1;
fi;

npm run build:dist || exit 1;
npm run license-checker

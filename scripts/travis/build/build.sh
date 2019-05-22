#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

rm -rf tmp && mkdir tmp;

if [[ $TRAVIS_PULL_REQUEST == "false" ]];
then
    ./scripts/npm-build-all.sh || exit 1;
else
    ./scripts/update-version.sh -gnu -alpha || exit 1;
    npm install;
fi;

npm run build:dist || exit 1;

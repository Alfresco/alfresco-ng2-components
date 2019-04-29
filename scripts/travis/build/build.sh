#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../

if [[ $TRAVIS_PULL_REQUEST == "false" ]];
then
    ./lint.sh || exit 1;
    ./npm-build-all.sh || exit 1;
else
    ./update-version.sh -gnu -alpha || exit 1;
    npm install;
    ./lint.sh || exit 1;
    rm -rf tmp && mkdir tmp;
    git merge-base origin/$TRAVIS_BRANCH HEAD > ./tmp/devhead.txt;
    ./smart-build.sh -b $TRAVIS_BRANCH  -gnu || exit 1;
fi;
npm run build:dist || exit 1;
./license-list-generator.sh || exit 1;

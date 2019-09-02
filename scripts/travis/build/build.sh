#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

rm -rf tmp && mkdir tmp;

npm install @alfresco/adf-cli@alpha
./node_modules/@alfresco/adf-cli/bin/adf-cli update-commit-sha --pointer "HEAD" --pathPackage "$(pwd)"

if [[ $TRAVIS_PULL_REQUEST == "false" ]];
then
    TAG_NPM=latest
    if [[ $TRAVIS_BRANCH == "development" ]];
    then
        NEXT_VERSION=-nextalpha
        TAG_NPM=alpha
        if [[ $TRAVIS_EVENT_TYPE == "cron" ]];
        then
            NEXT_VERSION=-nextbeta
            TAG_NPM=beta
        fi
        ./scripts/update-version.sh -gnu $NEXT_VERSION || exit 1;
    fi

    node ./scripts/pre-publish.js

    npm install

    ./scripts/npm-build-all.sh || exit 1;
else
    ./node_modules/@alfresco/adf-cli/bin/adf-cli update-version --alpha --pathPackage "$(pwd)"

    npm install;

    ./scripts/smart-build.sh -b $TRAVIS_BRANCH  -gnu || exit 1;
fi;

echo "====== Build Demo shell dist ====="
npm run build:dist || exit 1;

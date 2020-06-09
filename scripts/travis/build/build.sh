#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

rm -rf tmp && mkdir tmp;

npx @alfresco/adf-cli@alpha update-commit-sha --pointer "HEAD" --pathPackage "$(pwd)"

if [[ $TRAVIS_PULL_REQUEST == "false" ]];
then
    if [[ $TRAVIS_BRANCH == "develop" ]];
    then
        NEXT_VERSION=-nextalpha
        if [[ $TRAVIS_EVENT_TYPE == "cron" ]];
        then
            NEXT_VERSION=-nextbeta
        fi
        #./scripts/update-version.sh -gnu $NEXT_VERSION || exit 1;
    fi

    node ./scripts/pre-publish.js

    npm install

    ./scripts/npm-build-all.sh || exit 1;
else
    npm install;
    # npx @alfresco/adf-cli@alpha update-version --alpha --pathPackage "$(pwd)"

    ./scripts/smart-build.sh -gnu || exit 1;
fi;

echo "====== Build Demo shell for production ====="
npm run build:prod || exit 1;

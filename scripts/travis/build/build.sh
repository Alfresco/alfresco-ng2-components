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
        ./scripts/update-version.sh -gnu $NEXT_VERSION || exit 1;
    fi

    node ./scripts/pre-publish.js

    npm install
else
    echo "====== Update the package.json with latest JS-API/CLI deps ====="
    npx @alfresco/adf-cli@alpha update-version --alpha --pathPackage "$(pwd)"
    npm install;
#    nx affected --target=build --base=$BASE_HASH --head=$HEAD_HASH --exclude="cli,demoshell" --prod --with-deps  || exit 1;  TODO comment out when affected is fixe
fi;

./scripts/build/build-all-lib.sh

echo "====== Build Demo shell for production ====="
nx build demoshell --prod

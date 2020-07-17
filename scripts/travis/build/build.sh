#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

rm -rf tmp && mkdir tmp;

echo "Update commit sha in package JSON"

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

    echo "Install dependencies"

    npm install

else
    echo "====== Update the package.json with latest JS-API/CLI deps ====="
    npx @alfresco/adf-cli@alpha update-version --alpha --pathPackage "$(pwd)"

    echo "Install dependencies"
    npm install;

#    echo "Check affected lib $BASE_HASH $HEAD_HASH" TODO restore later
#    nx affected --target=build --base=origin/develop --head=HEAD --exclude="cli,demoshell" --prod  || exit 1;
fi;

./scripts/build/build-all-lib.sh

echo "====== Build Demo shell for production ====="
nx build demoshell --prod

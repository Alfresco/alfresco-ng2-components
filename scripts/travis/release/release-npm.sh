#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

if [[ $TRAVIS_EVENT_TYPE == "push"  ]] || [[ $TRAVIS_EVENT_TYPE == "cron" ]] || [[ $TRAVIS_EVENT_TYPE == "api" ]]
then

    if [[ $TRAVIS_BRANCH =~ ^master(-patch.*)?$ ]]
    then
        TAG_NPM=latest
    fi

    if [[ $TRAVIS_BRANCH =~ ^develop(-patch.*)?$ ]]
    then
        TAG_NPM=alpha
    fi

    if [[ $TRAVIS_BRANCH =~ angular-14-rebase ]]
    then
        TAG_NPM=a14
    fi

    echo "Publishing on npm with tag $TAG_NPM"
    ./dist/libs/cli/bin/adf-cli npm-publish --npmRegistry $NPM_REGISTRY_ADDRESS --tokenRegistry $NPM_REGISTRY_TOKEN --tag $TAG_NPM --pathProject "$(pwd)"
else
    echo "PR No need to release in NPM"
fi;

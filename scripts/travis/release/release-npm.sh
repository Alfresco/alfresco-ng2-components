#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

if [[ $TRAVIS_BRANCH =~ ^master(-patch.*)?$ ]]
then
    TAG_NPM=latest
fi

if [[ $TRAVIS_BRANCH =~ ^develop(-patch.*)?$ ]]
then
    TAG_NPM=alpha
fi

if [[ -n "$GITHUB_ACTIONS" ]]; then
    TAG_NPM=test
fi
echo "Publishing on npm with tag $TAG_NPM"
./node_modules/@alfresco/adf-cli/bin/adf-cli npm-publish \
    --npmRegistry $NPM_REGISTRY_ADDRESS \
    --tokenRegistry $NPM_REGISTRY_TOKEN \
    --tag $TAG_NPM \
    --pathProject "$(pwd)" \
    "$@"

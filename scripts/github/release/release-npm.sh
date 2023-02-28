#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

VERSION_IN_PACKAGE_JSON=`node -p "require('./package.json')".version;`;
BRANCH=${GITHUB_REF##*/}
#BRANCH=${GITHUB_BASE_REF}
if [[ $BRANCH =~ ^master(-patch.*)?$ ]]
then
    # Pre-release versions
    if [[ $VERSION_IN_PACKAGE_JSON =~ ^[0-9]*\.[0-9]*\.[0-9]*-A\.[0-9]*$ ]];
    then
        TAG_NPM=next
    # Stable major versions
    else
        TAG_NPM=latest
    fi
fi

if [[ $BRANCH =~ ^develop(-patch.*)?$ ]]
then
    TAG_NPM=alpha
fi

echo "Publishing on GH PKG registry with tag $TAG_NPM"
./node_modules/@alfresco/adf-cli/bin/adf-cli npm-publish \
    --npmRegistry "npm.pkg.github.com" \
    --tokenRegistry $github_token \
    --tag $TAG_NPM \
    --pathProject "$(pwd)" \
    "$@"

echo "Publishing on Public npm registry with tag $TAG_NPM"
./node_modules/@alfresco/adf-cli/bin/adf-cli npm-publish \
    --npmRegistry $NPM_REGISTRY_ADDRESS \
    --tokenRegistry $NPM_REGISTRY_TOKEN \
    --tag $TAG_NPM \
    --pathProject "$(pwd)" \
    "$@"

#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

./node_modules/@alfresco/adf-cli/bin/adf-cli npm-publish --npmRegistry $NPM_REGISTRY_ADDRESS --tokenRegistry $NPM_REGISTRY_TOKEN --tag $TAG_NPM --pathProject "$(pwd)"

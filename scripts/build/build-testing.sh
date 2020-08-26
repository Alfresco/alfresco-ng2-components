#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Testing ======"
echo "====== Build ======"


if [ "$CI" = "true" ]; then
    echo "Building testing for production"
    NODE_OPTIONS="--max-old-space-size=8192" nx build testing --prod || exit 1
else
    echo "Building testing for development"
    nx build testing || exit 1
fi

echo "====== Move to node_modules ======"
rm -rf ./node_modules/@alfresco/adf-testing/ && \
mkdir -p ./node_modules/@alfresco/adf-testing/ && \
cp -R ./lib/dist/testing/* ./node_modules/@alfresco/adf-testing/

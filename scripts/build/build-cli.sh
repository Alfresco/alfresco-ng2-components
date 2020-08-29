#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../
rm -rf lib/cli/dist
rm -rf lib/dist/cli

cd $DIR/../../lib/cli/



echo "====== Cli ======"
echo "====== Build ======"
npm i
npm run dist

cd $DIR/../../
cp -R ./lib/cli/dist lib/dist/cli/
cp ./lib/cli/README.md lib/dist/cli/README.md

echo "====== Move to node_modules ======"
rm -rf ./node_modules/@alfresco/adf-cli/ && \
mkdir -p ./node_modules/@alfresco/adf-cli/ && \
cp -R ./lib/dist/cli/* ./node_modules/@alfresco/adf-cli/

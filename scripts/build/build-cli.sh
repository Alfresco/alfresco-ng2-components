#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../lib/cli/

echo "====== Cli ======"
echo "====== Build ======"
npm install
npm run build

cd $DIR/../../
rm -rf ./lib/dist/cli/ && \
cp -R ./lib/cli/dist lib/dist/cli/

echo "====== Move to node_modules ======"
rm -rf ./node_modules/@alfresco/adf-cli/ && \
mkdir -p ./node_modules/@alfresco/adf-cli/ && \
cp -R ./lib/dist/cli/* ./node_modules/@alfresco/adf-cli/

#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/..

echo "====== Extensions ======"
echo "====== Build ======"
ng build extensions || exit 1

echo "====== Move to node_modules ======"
rm -rf ./node_modules/@alfresco/adf-extensions/ && \
mkdir -p ./node_modules/@alfresco/adf-extensions/ && \
cp -R ./lib/dist/extensions/* ./node_modules/@alfresco/adf-extensions/

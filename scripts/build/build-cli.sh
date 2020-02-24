#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../lib/cli/

npm install -g typescript

echo "====== Cli ======"
echo "====== Build ======"
npm run dist

cd $DIR/../../
if [ -e "./lib/dist/cli" ];
then
    rm -rf "./lib/dist/cli" ;
else if [ ! -d "./lib/dist" ];
    then
    mkdir ./lib/dist
    fi
fi

cp -R ./lib/cli/dist lib/dist/cli/
exit 0
echo "====== Move to node_modules ======"
rm -rf ./node_modules/@alfresco/adf-cli/ && \
mkdir -p ./node_modules/@alfresco/adf-cli/ && \
cp -R ./lib/dist/cli/* ./node_modules/@alfresco/adf-cli/

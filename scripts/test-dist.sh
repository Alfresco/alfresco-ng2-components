#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval NAME=

show_help() {
    echo "Usage: test-dist.sh"
    echo ""
    echo "-n or --name pr name"
}

name(){
    NAME="/$1"
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -n|--name)  name $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

echo "====== Install lib ===== "

cd $DIR/../
npm install

echo "====== Install JS-API alpha ===== "

npm install alfresco-js-api@alpha

echo "====== Build ADF ===== "

npm run build-lib || exit 1

echo "====== COPY new build in node_modules ===== "

rm -rf ../node_modules/@alfresco

mkdir -p $DIR/../node_modules/@alfresco/adf-core
mkdir -p $DIR/../node_modules/@alfresco/adf-content-services
mkdir -p $DIR/../node_modules/@alfresco/adf-process-services
mkdir -p $DIR/../node_modules/@alfresco/adf-process-services-cloud
mkdir -p $DIR/../node_modules/@alfresco/adf-insights
mkdir -p $DIR/../node_modules/@alfresco/adf-extensions

cp -R $DIR/../lib/dist/core/* $DIR/../node_modules/@alfresco/adf-core
cp -R $DIR/../lib/dist/content-services/* $DIR/../node_modules/@alfresco/adf-content-services
cp -R $DIR/../lib/dist/process-services/* $DIR/../node_modules/@alfresco/adf-process-services
cp -R $DIR/../lib/dist/process-services-cloud/* $DIR/../node_modules/@alfresco/adf-process-services-cloud
cp -R $DIR/../lib/dist/insights/* $DIR/../node_modules/@alfresco/adf-insights
cp -R $DIR/../lib/dist/extensions/* $DIR/../node_modules/@alfresco/adf-extensions

echo "====== Build dist demo shell ===== "

npm run server-versions
ng build dist --base-href=$NAME/ --output-path demo-shell/dist/$NAME || exit 1

echo "====== e2e test ===== "

npm run e2e || exit 1

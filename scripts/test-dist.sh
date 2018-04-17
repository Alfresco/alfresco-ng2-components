#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "====== Install demo-shell ===== "

cd $DIR/../demo-shell
npm install

echo "====== Install lib ===== "

cd $DIR/../lib
npm install

echo "====== Install JS-API alpha ===== "

npm install alfresco-js-api@alpha

echo "====== Build ADF ===== "

npm run build

echo "====== COPY new build in demo shell node_modules ===== "

rm -rf ../demo-shell/node_modules/@alfresco

mkdir -p $DIR/../demo-shell/node_modules/@alfresco/adf-core
mkdir -p $DIR/../demo-shell/node_modules/@alfresco/adf-content-services
mkdir -p $DIR/../demo-shell/node_modules/@alfresco/adf-process-services
mkdir -p $DIR/../demo-shell/node_modules/@alfresco/adf-insights

cp -R $DIR/../lib/dist/core/* $DIR/../demo-shell/node_modules/@alfresco/adf-core
cp -R $DIR/../lib/dist/content-services/* $DIR/../demo-shell/node_modules/@alfresco/adf-content-services
cp -R $DIR/../lib/dist/process-services/* $DIR/../demo-shell/node_modules/@alfresco/adf-process-services
cp -R $DIR/../lib/dist/insights/* $DIR/../demo-shell/node_modules/@alfresco/adf-insights

echo "====== Build dist demo shell ===== "

cd $DIR/../demo-shell
npm run build:dist

echo "====== e2e test ===== "

npm run e2e

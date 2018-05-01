#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/..

echo "====== lint ====="

npm run lint-lib

echo "====== clean ====="

rm -rf node_modules/@alfresco

echo "====== Build lib ====="

ng-packagr -p ./lib/core/package.json
mkdir -p ./node_modules/@alfresco/adf-core/
cp -R ./lib/dist/core/* ./node_modules/@alfresco/adf-core/

ng-packagr -p ./lib/content-services/package.json
mkdir -p ./node_modules/@alfresco/adf-content-services/
cp -R ./lib/dist/content-services/* ./node_modules/@alfresco/adf-content-services/

ng-packagr -p ./lib/process-services/package.json

ng-packagr -p ./lib/insights/package.json

echo "====== Build style ====="

node ./lib/config/bundle-scss.js

npm run webpack -- --config ./lib/config/webpack.style.js --progress --profile --bail

echo "====== Copy i18n ====="

mkdir -p ./lib/dist/core/bundles/assets/adf-core/i18n
cp -R ./lib/core/i18n/* ./lib/dist/core/bundles/assets/adf-core/i18n

mkdir -p ./lib/dist/content-services/bundles/assets/adf-content-services/i18n
cp -R ./lib/content-services/i18n/* ./lib/dist/content-services/bundles/assets/adf-content-services/i18n

mkdir -p ./lib/dist/process-services/bundles/assets/adf-process-services/i18n
cp -R ./lib/process-services/i18n/* ./lib/dist/process-services/bundles/assets/adf-process-services/i18n

mkdir -p ./lib/dist/insights/bundles/assets/adf-insights/i18n
cp -R ./lib/insights/i18n/* ./lib/dist/insights/bundles/assets/adf-insights/i18n

echo "====== Copy assets ====="

cp -R ./lib/core/assets/* ./lib/dist/core/bundles/assets
cp -R ./lib/content-services/assets/* ./lib/dist/content-services/bundles/assets
cp -R ./lib/process-services/assets/* ./lib/dist/process-services/bundles/assets

echo "====== Copy schema ====="

cp ./lib/core/app-config/schema.json ./lib/dist/core/app.config.schema.json

npm run bundlesize-check

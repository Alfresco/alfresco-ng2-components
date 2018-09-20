#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/..

echo "====== clean ====="

rm -rf node_modules/@alfresco

echo "====== Build lib ====="

echo "------ Build core -----"
npm run ng-packagr -- -p ./lib/core/ && \
mkdir -p ./node_modules/@alfresco/adf-core/ && \
cp -R ./lib/dist/core/* ./node_modules/@alfresco/adf-core/

echo "------ Build content-services -----"
npm run ng-packagr -- -p ./lib/content-services/ && \
mkdir -p ./node_modules/@alfresco/adf-content-services/ && \
cp -R ./lib/dist/content-services/* ./node_modules/@alfresco/adf-content-services/

echo "------ Build process-services -----"
npm run ng-packagr -- -p ./lib/process-services/ && \
mkdir -p ./node_modules/@alfresco/adf-process-services/ && \
cp -R ./lib/dist/process-services/* ./node_modules/@alfresco/adf-process-services/

echo "------ Build insights -----"
npm run ng-packagr -- -p ./lib/insights/ && \
mkdir -p ./node_modules/@alfresco/adf-insights/ && \
cp -R ./lib/dist/insights/* ./node_modules/@alfresco/adf-insights/

echo "------ Build extensions -----"
npm run ng-packagr -- -p ./lib/extensions/ && \
mkdir -p ./node_modules/@alfresco/adf-extensions/ && \
cp -R ./lib/dist/extensions/* ./node_modules/@alfresco/adf-extensions/

echo "------ Build process-services-cloud -----"
npm run ng-packagr -- -p ./lib/process-services-cloud/ && \
mkdir -p ./node_modules/@alfresco/adf-process-services-cloud/ && \
cp -R ./lib/dist/process-services-cloud/* ./node_modules/@alfresco/adf-process-services-cloud/


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

mkdir -p ./lib/dist/process-services-cloud/bundles/assets/adf-process-services-cloud/i18n
cp -R ./lib/process-services-cloud/i18n/* ./lib/dist/process-services-cloud/bundles/assets/adf-process-services-cloud/i18n


echo "====== Copy assets ====="

cp -R ./lib/core/assets/* ./lib/dist/core/bundles/assets
cp -R ./lib/content-services/assets/* ./lib/dist/content-services/bundles/assets
cp -R ./lib/process-services/assets/* ./lib/dist/process-services/bundles/assets
cp -R ./lib/process-services-cloud/assets/* ./lib/dist/process-services-cloud/bundles/assets

echo "====== Copy schema ====="

cp ./lib/core/app-config/schema.json ./lib/dist/core/app.config.schema.json

npm run bundlesize-check

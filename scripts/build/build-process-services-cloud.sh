#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Process Services Cloud ======"
echo "====== Build ======"
npm run ng-packagr -- -p ./lib/process-services-cloud/ || exit 1

echo "====== Build style ======"
node ./lib/config/bundle-process-services-cloud-scss.js || exit 1

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/process-services-cloud/bundles/assets/adf-process-services-cloud/i18n
cp -R ./lib/process-services-cloud/src/lib/i18n/* ./lib/dist/process-services-cloud/bundles/assets/adf-process-services-cloud/i18n

echo "====== Copy assets ======"
cp -R ./lib/process-services-cloud/src/lib/assets/* ./lib/dist/process-services-cloud/bundles/assets

#echo "====== Move to node_modules ======"
#rm -rf ./node_modules/@alfresco/adf-process-services-cloud/ && \
#mkdir -p ./node_modules/@alfresco/adf-process-services-cloud/ && \
#cp -R ./lib/dist/process-services-cloud/* ./node_modules/@alfresco/adf-process-services-cloud/

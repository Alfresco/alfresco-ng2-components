#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Process Services ======"
echo "====== Build ======"
npm run ng-packagr -- -p ./lib/process-services/ || exit 1

echo "====== Build style ======"
node ./lib/config/bundle-process-services-scss.js || exit 1

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/process-services/bundles/assets/adf-process-services/i18n
cp -R ./lib/process-services/src/lib/i18n/* ./lib/dist/process-services/bundles/assets/adf-process-services/i18n

echo "====== Copy assets ======"
cp -R ./lib/process-services/src/lib/assets/* ./lib/dist/process-services/bundles/assets

echo "====== Move to node_modules ======"
rm -rf ./node_modules/@alfresco/adf-process-services/ && \
mkdir -p ./node_modules/@alfresco/adf-process-services/ && \
cp -R ./lib/dist/process-services/* ./node_modules/@alfresco/adf-process-services/

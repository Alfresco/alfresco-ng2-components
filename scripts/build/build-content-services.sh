#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Content Services ======"
echo "====== Build ======"
npm run ng-packagr -- -p ./lib/content-services/ || exit 1

echo "====== Build style ======"
node ./lib/config/bundle-content-services-scss.js || exit 1

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/content-services/bundles/assets/adf-content-services/i18n
cp -R ./lib/content-services/src/lib/i18n/* ./lib/dist/content-services/bundles/assets/adf-content-services/i18n

echo "====== Copy assets ======"
cp -R ./lib/content-services/src/lib/assets/* ./lib/dist/content-services/bundles/assets

#echo "====== Move to node_modules ======"
#rm -rf ./node_modules/@alfresco/adf-content-services/ && \
#mkdir -p ./node_modules/@alfresco/adf-content-services/ && \
#cp -R ./lib/dist/content-services/* ./node_modules/@alfresco/adf-content-services/

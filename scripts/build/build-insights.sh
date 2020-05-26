#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Insights ======"
echo "====== Build ======"
npm run ng-packagr -- -p ./lib/insights/ || exit 1

echo "====== Build style ======"
node ./lib/config/bundle-insights-scss.js || exit 1

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/insights/bundles/assets/adf-insights/i18n
cp -R ./lib/insights/src/lib/i18n/* ./lib/dist/insights/bundles/assets/adf-insights/i18n

#echo "====== Move to node_modules ======"
#rm -rf ./node_modules/@alfresco/adf-insights/ && \
#mkdir -p ./node_modules/@alfresco/adf-insights/ && \
#cp -R ./lib/dist/insights/* ./node_modules/@alfresco/adf-insights/

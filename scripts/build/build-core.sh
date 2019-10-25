#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Core ======"
echo "====== Build ======"
npm run ng-packagr -- -p ./lib/core/ || exit 1

echo "====== Build style ======"
node ./lib/config/bundle-core-scss.js || exit 1

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/core/bundles/assets/adf-core/i18n
cp -R ./lib/core/src/lib/i18n/* ./lib/dist/core/bundles/assets/adf-core/i18n

echo "====== Copy assets ======"
cp -R ./lib/core/src/lib/assets/* ./lib/dist/core/bundles/assets

npm run webpack -- --config ./lib/config/webpack.style.js --progress --profile --bail

echo "====== Move to node_modules ======"
rm -rf ./node_modules/@alfresco/adf-core/ && \
mkdir -p ./node_modules/@alfresco/adf-core/ && \
cp -R ./lib/dist/core/* ./node_modules/@alfresco/adf-core/

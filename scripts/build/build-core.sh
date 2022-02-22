#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Core ======"

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/core/bundles/assets/adf-core/i18n
cp -R ./lib/core/i18n/* ./lib/dist/core/bundles/assets/adf-core/i18n

echo "====== Copy schema ======"
cp -R ./lib/core/app-config/schema.json lib/dist/core/app.config.schema.json

echo "====== Copy assets ======"
cp -R ./lib/core/assets/* ./lib/dist/core/bundles/assets

echo "====== Prebuilt Themes ====="
npm run webpack -- --config ./lib/config/webpack.style.js --progress --profile --bail
rm ./lib/dist/core/prebuilt-themes/*.js

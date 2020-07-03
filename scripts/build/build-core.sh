#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Core ======"
echo "====== Build ======"
npm run ng -- build core|| exit 1

echo "====== Build style ======"
node ./lib/config/bundle-core-scss.js || exit 1

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/core/bundles/assets/adf-core/i18n
cp -R ./lib/core/i18n/* ./lib/dist/core/bundles/assets/adf-core/i18n

echo "====== Copy assets ======"
cp -R ./lib/core/assets/* ./lib/dist/core/bundles/assets

npm run webpack -- --config ./lib/config/webpack.style.js --progress --profile --bail
rm ./lib/dist/core/prebuilt-themes/*.js

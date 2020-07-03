#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Content Services ======"
echo "====== Build ======"

if [ "$CI" = "true" ]; then
    echo "Building content-services for production"
    npm run ng -- build content-services --prod || exit 1
else
    echo "Building content-services for development"
    npm run ng -- build content-services || exit 1
fi

echo "====== Build style ======"
node ./lib/config/bundle-content-services-scss.js || exit 1

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/content-services/bundles/assets/adf-content-services/i18n
cp -R ./lib/content-services/src/lib/i18n/* ./lib/dist/content-services/bundles/assets/adf-content-services/i18n

echo "====== Copy assets ======"
cp -R ./lib/content-services/src/lib/assets/* ./lib/dist/content-services/bundles/assets

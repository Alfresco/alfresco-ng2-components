#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Content Services ======"
echo "====== Build ======"

if [ "$CI" = "true" ]; then
    echo "Building content-services for production"
    NODE_OPTIONS="--max-old-space-size=8192" nx build content-services --prod || exit 1
else
    echo "Building content-services for development"
    nx build content-services || exit 1
fi

echo "====== Bundle styles ======"
npm run scss-bundle:content-services || exit 1

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/content-services/bundles/assets/adf-content-services/i18n
cp -R ./lib/content-services/src/lib/i18n/* ./lib/dist/content-services/bundles/assets/adf-content-services/i18n

echo "====== Copy assets ======"
cp -R ./lib/content-services/src/lib/assets/* ./lib/dist/content-services/bundles/assets

#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Process Services ======"
echo "====== Build ======"

export NODE_OPTIONS=--max_old_space_size=8192

if [ "$CI" = "true" ]; then
    echo "Building process-services for production"
    nx build process-services --prod || exit 1
else
    echo "Building process-services for development"
    nx build process-services || exit 1
fi

echo "====== Build style ======"
node ./lib/config/bundle-process-services-scss.js || exit 1

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/process-services/bundles/assets/adf-process-services/i18n
cp -R ./lib/process-services/src/lib/i18n/* ./lib/dist/process-services/bundles/assets/adf-process-services/i18n

echo "====== Copy assets ======"
cp -R ./lib/process-services/src/lib/assets/* ./lib/dist/process-services/bundles/assets

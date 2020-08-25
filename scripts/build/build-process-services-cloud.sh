#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Process Services Cloud ======"
echo "====== Build ======"

NODE_OPTIONS=--max_old_space_size=4096

if [ "$CI" = "true" ]; then
    echo "Building process-services-cloud  for production"
    nx build process-services-cloud --prod || exit 1
else
    echo "Building process-services-cloud  for development"
    nx build process-services-cloud || exit 1
fi

echo "====== Build style ======"
node ./lib/config/bundle-process-services-cloud-scss.js || exit 1

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/process-services-cloud/bundles/assets/adf-process-services-cloud/i18n
cp -R ./lib/process-services-cloud/src/lib/i18n/* ./lib/dist/process-services-cloud/bundles/assets/adf-process-services-cloud/i18n

echo "====== Copy assets ======"
cp -R ./lib/process-services-cloud/src/lib/assets/* ./lib/dist/process-services-cloud/bundles/assets

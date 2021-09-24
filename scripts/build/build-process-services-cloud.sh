#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Process Services Cloud ======"
echo "====== Build ======"

if [ "$CI" = "true" ]; then
    echo "Building process-services-cloud  for production"
    NODE_OPTIONS="--max-old-space-size=8192" nx build process-services-cloud --configuration production || exit 1
else
    echo "Building process-services-cloud  for development"
    NODE_OPTIONS="--max-old-space-size=8192" nx build process-services-cloud || exit 1
fi

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/process-services-cloud/bundles/assets/adf-process-services-cloud/i18n
cp -R ./lib/process-services-cloud/src/lib/i18n/* ./lib/dist/process-services-cloud/bundles/assets/adf-process-services-cloud/i18n

echo "====== Copy assets ======"
cp -R ./lib/process-services-cloud/src/lib/assets/* ./lib/dist/process-services-cloud/bundles/assets

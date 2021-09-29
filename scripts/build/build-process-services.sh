#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Process Services ======"
echo "====== Build ======"

if [ "$CI" = "true" ]; then
    echo "Building process-services for production"
    NODE_OPTIONS="--max-old-space-size=8192" nx build process-services --configuration production || exit 1
else
    echo "Building process-services for development"
    NODE_OPTIONS="--max-old-space-size=8192" nx build process-services || exit 1
fi

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/process-services/bundles/assets/adf-process-services/i18n
cp -R ./lib/process-services/src/lib/i18n/* ./lib/dist/process-services/bundles/assets/adf-process-services/i18n

echo "====== Copy assets ======"
cp -R ./lib/process-services/src/lib/assets/* ./lib/dist/process-services/bundles/assets

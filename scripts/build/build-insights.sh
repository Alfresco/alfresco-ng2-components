#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Insights ======"
echo "====== Build ======"

if [ "$CI" = "true" ]; then
    echo "Building insights for production"
    NODE_OPTIONS="--max-old-space-size=8192" nx build insights --configuration production || exit 1
else
    echo "Building insights for development"
    NODE_OPTIONS="--max-old-space-size=8192" nx build insights || exit 1
fi

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/insights/bundles/assets/adf-insights/i18n
cp -R ./lib/insights/src/lib/i18n/* ./lib/dist/insights/bundles/assets/adf-insights/i18n

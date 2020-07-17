#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Insights ======"
echo "====== Build ======"

if [ "$CI" = "true" ]; then
    echo "Building insights for production"
    nx build insights --prod || exit 1
else
    echo "Building insights for development"
    nx build insights || exit 1
fi

echo "====== Build style ======"
node ./lib/config/bundle-insights-scss.js || exit 1

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/insights/bundles/assets/adf-insights/i18n
cp -R ./lib/insights/src/lib/i18n/* ./lib/dist/insights/bundles/assets/adf-insights/i18n

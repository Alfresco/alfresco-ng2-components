#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Process Services ======"

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/process-services/bundles/assets/adf-process-services/i18n
cp -R ./lib/process-services/src/lib/i18n/* ./lib/dist/process-services/bundles/assets/adf-process-services/i18n

echo "====== Copy assets ======"
cp -R ./lib/process-services/src/lib/assets/* ./lib/dist/process-services/bundles/assets

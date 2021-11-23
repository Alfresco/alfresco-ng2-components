#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Core ======"
echo "====== Build ======"

if [ "$CI" = "true" ]; then
    echo "Building core for production"
    NODE_OPTIONS="--max-old-space-size=8192" nx build core --configuration production || exit 1
else
    echo "Building core for development"
    NODE_OPTIONS="--max-old-space-size=8192" nx build core || exit 1
fi

echo "====== Bundle styles ======"
npm run scss-bundle:core || exit 1

echo "====== Copy i18n ======"
mkdir -p ./lib/dist/core/bundles/assets/adf-core/i18n
cp -R ./lib/core/i18n/* ./lib/dist/core/bundles/assets/adf-core/i18n

echo "====== Copy schema ======"
cp -R ./lib/core/app-config/schema.json lib/dist/core/app.config.schema.json

echo "====== Copy assets ======"
cp -R ./lib/core/assets/* ./lib/dist/core/bundles/assets

echo "====== Bundle prebuilt styles ======"
npx scss-bundle -e "./lib/core/styles/prebuilt/adf-blue-purple.scss" -o "./lib/dist/core/prebuilt-themes/adf-blue-purple.scss" -p "./"
npx scss-bundle -e "./lib/core/styles/prebuilt/adf-cyan-purple.scss" -o "./lib/dist/core/prebuilt-themes/adf-cyan-purple.scss" -p "./"
npx scss-bundle -e "./lib/core/styles/prebuilt/adf-green-purple.scss" -o "./lib/dist/core/prebuilt-themes/adf-green-purple.scss" -p "./"
npx scss-bundle -e "./lib/core/styles/prebuilt/adf-pink-bluegrey.scss" -o "./lib/dist/core/prebuilt-themes/adf-pink-bluegrey.scss" -p "./"
npx scss-bundle -e "./lib/core/styles/prebuilt/adf-cyan-orange.scss" -o "./lib/dist/core/prebuilt-themes/adf-cyan-orange.scss" -p "./"
npx scss-bundle -e "./lib/core/styles/prebuilt/adf-green-orange.scss" -o ".lib/dist/core/prebuilt-themes/adf-green-orange.scss" -p "./"
npx scss-bundle -e "./lib/core/styles/prebuilt/adf-indigo-pink.scss" -o "./lib/dist/core/prebuilt-themes/adf-indigo-pink.scss" -p "./"
npx scss-bundle -e "./lib/core/styles/prebuilt/adf-purple-green.scss" -o "./lib/dist/core/prebuilt-themes/adf-purple-green.scss" -p "./"

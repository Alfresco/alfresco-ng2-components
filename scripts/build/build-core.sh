#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Core ======"

echo "====== Prebuilt Themes ====="
npm run webpack -- --config ./lib/config/webpack.style.js --progress --profile --bail
rm ./lib/dist/core/lib/prebuilt-themes/*.js

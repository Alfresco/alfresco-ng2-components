#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Build Themes ====="
nx build demoshell && \
mkdir -p ./lib/dist/core/prebuilt-themes && \
cp ./dist/demo-shell/adf-*.css ./lib/dist/core/prebuilt-themes/

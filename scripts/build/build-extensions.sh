#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Extensions ======"
echo "====== Build ======"
npm run ng-packagr -- -p ./lib/extensions/ || exit 1

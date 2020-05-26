#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Testing ======"
echo "====== Build ======"
npm run ng -- build testing || exit 1

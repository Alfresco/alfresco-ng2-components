#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Testing ======"

echo "====== Move to node_modules ======"
nx build testing
nx run testing:copydist

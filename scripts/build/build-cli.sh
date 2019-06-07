#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Cli ======"
echo "====== Build ======"
cp -R ./lib/cli/ lib/dist/cli/

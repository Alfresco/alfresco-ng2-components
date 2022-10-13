#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../lib/cli/

echo "====== Cli ======"

cd $DIR/../../
cp -R ./lib/cli/dist dist/libs/cli/
cp ./lib/cli/README.md dist/libs/cli/README.md

echo "====== Cli Move to node_modules ======"
npx nx build cli
npx nx run cli:copydist


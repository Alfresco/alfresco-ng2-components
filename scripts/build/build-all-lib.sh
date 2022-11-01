#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR
cd ../../
rm -rf dist/libs
echo "====== Run lib ====="

if [ "$CI" = "true" ]; then
    echo "Building libs for production with NX_FLAG $NX_CALCULATION_FLAGS"
    NODE_OPTIONS="--max-old-space-size=8192" $(npm bin)/nx affected:build $NX_CALCULATION_FLAGS --prod --exclude="demoshell" || exit 1
else
    echo "Building libs for development with NX_FLAG $NX_CALCULATION_FLAGS"
    NODE_OPTIONS="--max-old-space-size=8192" $(npm bin)/nx affected:build $NX_CALCULATION_FLAGS --exclude=demoshell || exit 1
fi

echo "====== run core ====="
./scripts/build/build-core.sh || exit 1


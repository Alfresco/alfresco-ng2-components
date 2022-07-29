#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR
cd ../../
rm -rf lib/dist
echo "====== Run lib ====="

if [ "$CI" = "true" ]; then
    echo "Building libs for production"
    NODE_OPTIONS="--max-old-space-size=8192" $(npm bin)/nx affected:build --all --prod --exclude=demoshell || exit 1
else
    echo "Building libs for development"
    NODE_OPTIONS="--max-old-space-size=8192" $(npm bin)/nx affected:build --all --exclude=demoshell || exit 1
fi

echo "====== run core ====="
./scripts/build/build-core.sh || exit 1

echo "====== Run content-services ====="
./scripts/build/build-content-services.sh || exit 1

echo "====== Run process-services ====="
./scripts/build/build-process-services.sh || exit 1

echo "====== Run insights ====="
./scripts/build/build-insights.sh || exit 1

echo "====== Run process-services-cloud ====="
./scripts/build/build-process-services-cloud.sh || exit 1

echo "====== Run testing ====="
./scripts/build/build-testing.sh || exit 1

echo "====== Run Cli ====="
./scripts/build/build-cli.sh || exit 1

echo "====== Copy schema ====="
cp lib/core/src/lib/app-config/schema.json lib/dist/core/app.config.schema.json



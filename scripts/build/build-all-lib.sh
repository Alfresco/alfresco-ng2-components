#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR

echo "====== Run lib ====="

echo "====== Run extensions ====="
./build-extensions.sh || exit 1

echo "====== run core ====="
./build-core.sh || exit 1

echo "====== Run content-services ====="
./build-content-services.sh || exit 1

echo "====== Run process-services ====="
./build-process-services.sh || exit 1

echo "====== Run insights ====="
./build-insights.sh || exit 1

echo "====== Run process-services-cloud ====="
./build-process-services-cloud.sh || exit 1

echo "====== Run testing ====="
./build-testing.sh || exit 1

echo "====== Run Cli ====="
./build-cli.sh || exit 1

echo "====== Copy schema ====="

cp ../../lib/core/src/lib/app-config/schema.json ../../lib/dist/core/app.config.schema.json

echo "====== Bundle check ====="

npm run bundlesize-check || exit 1

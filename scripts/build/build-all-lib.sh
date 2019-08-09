#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR


echo "====== Run lib ====="

echo "====== Run extensions ====="
./build-extensions.sh

echo "====== run core ====="
./build-core.sh

echo "====== Run content-services ====="
./build-content-services.sh

echo "====== Run process-services ====="
./build-process-services.sh

echo "====== Run insights ====="
./build-insights.sh

echo "====== Run process-services-cloud ====="
./build-process-services-cloud.sh

echo "====== Run testing ====="
./build-testing.sh

echo "====== Run Cli ====="
./build-cli.sh

echo "====== Copy schema ====="

cp ../../lib/core/app-config/schema.json ../../lib/dist/core/app.config.schema.json

echo "====== Bundle check ====="

npm run bundlesize-check || exit 1

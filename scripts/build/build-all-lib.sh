#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR

rm -rf lib/dist

echo "====== Build lib ====="

echo "====== Build extensions ====="
./build-extensions.sh || exit 1

echo "====== Build core ====="
./build-core.sh || exit 1

echo "====== Build content-services ====="
./build-content-services.sh || exit 1

echo "====== Build process-services ====="
./build-process-services.sh || exit 1

echo "====== Build insights ====="
./build-insights.sh || exit 1

echo "====== Build process-services-cloud ====="
./build-process-services-cloud.sh || exit 1

echo "====== Build testing ====="
./build-testing.sh || exit 1

echo "====== Build Cli ====="
./build-cli.sh || exit 1

echo "====== Copy schema ====="

cp ../../lib/core/app-config/schema.json ../../lib/dist/core/app.config.schema.json


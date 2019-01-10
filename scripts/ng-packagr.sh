#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR

echo "====== run lib ====="

echo "------ run core -----"
./build-core.sh

echo "------ run content-services -----"
./build-content-services.sh

echo "------ Build process-services -----"
./build-process-services.sh

echo "------ run insights -----"
./build-insights.sh

echo "------ run extensions -----"
./build-extensions.sh

echo "------ run process-services-cloud -----"
./build-process-services-cloud.sh

echo "====== Copy schema ====="

cp ../lib/core/app-config/schema.json ../lib/dist/core/app.config.schema.json

npm run bundlesize-check

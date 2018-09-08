#!/usr/bin/env bash

echo "====== Build lib ====="

npm run build-lib

echo "====== Upload lib ====="

node ./scripts/upload-build-lib-in-cs.js -u $E2E_USERNAME  -p $E2E_PASSWORD --host $E2E_HOST -f $TRAVIS_BUILD_NUMBER

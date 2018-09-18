#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/../"

echo "====== lint Lib ====="

npm run lint-lib || exit 1

echo "====== lint E2E ====="

npm run lint-e2e || exit 1

echo "====== lint Demo shell ====="

ng lint dev || exit 1

#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

echo "====== Check External ACS is UP ====="

./dist/libs/cli/bin/adf-cli check-cs-env --host "$EXTERNAL_ACS_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" || exit 1

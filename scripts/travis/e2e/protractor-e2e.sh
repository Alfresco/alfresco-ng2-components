#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Start search e2e"

cd $DIR/../../../

# RUN_E2E=$(echo ./scripts/test-e2e-lib.sh -host http://localhost:4200 -proxy "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" --use-dist || exit 1)
RUN_E2E=$(echo ./scripts/test-e2e-lib.sh -host "$URL_HOST_ADF" -proxy "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" --use-dist || exit 1)

$RUN_E2E --specs "e2e/core/user-info-component-cloud.e2e.ts" || exit 1

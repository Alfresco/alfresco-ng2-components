#!/usr/bin/env bash

echo "Start Login e2e"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

SPEC="./e2e/core/login/login-sso/login-sso.e2e.ts"

echo "check ps env"
./node_modules/@alfresco/adf-cli/bin/adf-cli check-ps-env --host "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" || exit 1
echo "check cs env"
./node_modules/@alfresco/adf-cli/bin/adf-cli check-cs-env --host "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" || exit 1
RUN_E2E=$(echo ./scripts/test-e2e-lib.sh -host http://localhost:4200 -proxy "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" -e "$E2E_EMAIL" -s "$SPEC" --use-dist -m 2 || exit 1)

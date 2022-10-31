#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

echo "====== Check PS Cloud UP ====="

./dist/libs/cli/bin/adf-cli init-aae-env --oauth "$E2E_HOST" --host "$E2E_HOST_APA" --modelerUsername "$E2E_MODELER_USERNAME" --modelerPassword "$E2E_MODELER_PASSWORD" --devopsUsername "$E2E_DEVOPS_USERNAME" --devopsPassword "$E2E_DEVOPS_PASSWORD" --clientId 'alfresco' || exit 1

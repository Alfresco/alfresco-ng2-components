#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

./node_modules/@alfresco/adf-cli/bin/adf-cli init-aae-env --host "$E2E_HOST" --oauth "$HOST_SSO" --modelerUsername "$E2E_MODELER_USERNAME" --modelerPassword "$E2E_MODELER_PASSWORD" --devopsUsername "$E2E_DEVOPS_USERNAME" --devopsPassword "$E2E_DEVOPS_PASSWORD" --clientId 'alfresco' || exit 1

./node_modules/@alfresco/adf-cli/bin/adf-cli check-cs-env --host "$E2E_HOST" -u "$E2E_ADMIN_EMAIL_IDENTITY" -p "$E2E_ADMIN_PASSWORD_IDENTITY" || exit 1

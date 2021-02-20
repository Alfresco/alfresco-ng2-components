#!/usr/bin/env bash

./node_modules/@alfresco/adf-cli/bin/adf-cli scan-env --host "$E2E_HOST" -u "$E2E_ADMIN_EMAIL_IDENTITY" -p "$E2E_ADMIN_PASSWORD_IDENTITY"

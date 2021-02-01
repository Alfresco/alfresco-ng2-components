#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

echo "====== Check PS UP ====="

npx @alfresco/adf-cli@alpha init-aps-env --host "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" --license "$AWS_S3_BUCKET_ACTIVITI_LICENSE"

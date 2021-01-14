#!/usr/bin/env bash

./node_modules/@alfresco/adf-cli/bin/adf-cli scan-env --host "$E2E_HOST" -u "$E2E_ADMIN_EMAIL_IDENTITY" -p "$E2E_ADMIN_PASSWORD_IDENTITY"

# Download built application artifact from S3
./scripts/ci/utils/artifact-from-s3.sh -a "$S3_DBP_FOLDER/alfresco-demoshell.tar.bz2" -o "./dist/demo-shell"
./scripts/ci/utils/artifact-from-s3.sh -a "$S3_DBP_FOLDER/alfresco-libs.tar.bz2" -o "./lib/dist"

# Download protractor-smartrunner artifact related to this particular job from S3, if exists
./scripts/ci/utils/artifact-from-s3.sh -a "$S3_DBP_FOLDER/protractor-smartrunner-$TRAVIS_JOB_ID.tar.bz2" -o "$SMART_RUNNER_DIRECTORY"


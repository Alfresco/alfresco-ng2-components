#!/usr/bin/env bash

# TODO: This one needs to be cleaned up... Only fixing it like this, because for the current PR it is out of scope
# =======================================
rm -rf ./node_modules/@alfresco/adf-cli/ && \
mkdir -p ./node_modules/@alfresco/adf-cli/ && \
cp -R ./lib/dist/cli/* ./node_modules/@alfresco/adf-cli/

rm -rf ./node_modules/@alfresco/adf-testing/ && \
mkdir -p ./node_modules/@alfresco/adf-testing/ && \
cp -R ./lib/dist/testing/* ./node_modules/@alfresco/adf-testing/
# =======================================

# Download protractor-smartrunner artifact related to this particular job from S3, if exists
./scripts/ci/utils/artifact-from-s3.sh -a "$S3_SMART_RUNNER_PATH/$TRAVIS_JOB_ID.tar.bz2" -o "$SMART_RUNNER_DIRECTORY"

if [ "$TRAVIS_EVENT_TYPE" = "cron" ]
then
    ./node_modules/@alfresco/adf-cli/bin/adf-cli scan-env --host "$E2E_HOST" -u "$E2E_ADMIN_EMAIL_IDENTITY" -p "$E2E_ADMIN_PASSWORD_IDENTITY"
fi

#!/usr/bin/env bash

E2E_PROTRACTOR=true

if [[ "$E2E_PROTRACTOR" == true ]]; then
    # Download protractor-smartrunner artifact related to this particular job from S3, if exists
    dbpci-artifact-from-s3 -a "$S3_SMART_RUNNER_PATH/$TRAVIS_JOB_ID.tar.bz2" -o "$SMART_RUNNER_DIRECTORY"
fi

# TODO: This one needs to be cleaned up... Only fixing it like this, because for the current PR it is out of scope
# =======================================
rm -rf ./node_modules/@alfresco/adf-cli/ && \
mkdir -p ./node_modules/@alfresco/adf-cli/ && \
cp -R ./lib/dist/cli/* ./node_modules/@alfresco/adf-cli/

rm -rf ./node_modules/@alfresco/adf-testing/ && \
mkdir -p ./node_modules/@alfresco/adf-testing/ && \
cp -R ./lib/dist/testing/* ./node_modules/@alfresco/adf-testing/
# =======================================

exit 0
